const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Users } = require('../db/database')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password, role = 'student' } = req.body
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: 'Name, email and password are required' })
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Invalid email format' })

  try {
    if (Users.findByEmail(email.toLowerCase()))
      return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 12)
    const user = Users.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
    })
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res
      .status(201)
      .json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during registration' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' })

  try {
    const user = Users.findByEmail(email.toLowerCase())
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during login' })
  }
})

router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = Users.findById(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password: _, ...safe } = user
  res.json({ user: safe })
})

module.exports = router
