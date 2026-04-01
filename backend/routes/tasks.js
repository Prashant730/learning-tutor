const express = require('express')
const { Tasks, Dates } = require('../db/database')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, (req, res) => {
  res.json({ tasks: Tasks.findByUser(req.user.id) })
})

router.post('/', auth, (req, res) => {
  const { text, subject = 'general', is_ai_generated = false } = req.body
  if (!text?.trim())
    return res.status(400).json({ error: 'Task text is required' })
  const task = Tasks.create({
    user_id: req.user.id,
    text: text.trim(),
    subject,
    is_ai_generated,
  })
  res.status(201).json({ task })
})

router.patch('/:id', auth, (req, res) => {
  const task = Tasks.findById(req.params.id)
  if (!task || task.user_id !== req.user.id)
    return res.status(404).json({ error: 'Task not found' })
  const updated = Tasks.update(req.params.id, {
    completed: !!req.body.completed,
  })
  res.json({ task: updated })
})

router.delete('/:id', auth, (req, res) => {
  const task = Tasks.findById(req.params.id)
  if (!task || task.user_id !== req.user.id)
    return res.status(404).json({ error: 'Task not found' })
  Tasks.remove(req.params.id)
  res.json({ success: true })
})

router.get('/dates', auth, (req, res) => {
  res.json({ dates: Dates.findByUser(req.user.id) })
})

router.post('/dates', auth, (req, res) => {
  const { date } = req.body
  if (!date) return res.status(400).json({ error: 'Date is required' })
  if (Dates.exists(req.user.id, date)) {
    Dates.remove(req.user.id, date)
    res.json({ completed: false })
  } else {
    Dates.add(req.user.id, date)
    res.json({ completed: true })
  }
})

module.exports = router
