const express = require('express')
const auth = require('../middleware/auth')
const { Messages } = require('../db/database')

const router = express.Router()

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT = `You are an expert AI tutor. Help students learn academic subjects.
Rules: Only assist with educational topics. Guide critical thinking. Redirect non-educational questions politely.`

router.post('/', auth, async (req, res) => {
  const { message } = req.body
  if (!message?.trim())
    return res.status(400).json({ error: 'Message is required' })
  if (message.length > 1000)
    return res.status(400).json({ error: 'Message too long (max 1000 chars)' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here')
    return res
      .status(503)
      .json({ error: 'Gemini API key not configured. Add it to backend/.env' })

  Messages.create({
    user_id: req.user.id,
    role: 'user',
    content: message.trim(),
  })

  const history = Messages.findByUser(req.user.id, 12)
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    {
      role: 'model',
      parts: [
        {
          text: 'Understood! I am your educational AI tutor. How can I help you learn today?',
        },
      ],
    },
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  try {
    const { default: fetch } = await import('node-fetch')
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      if (response.status === 429)
        return res
          .status(429)
          .json({ error: 'Rate limit reached. Wait a moment.' })
      return res
        .status(502)
        .json({ error: data.error?.message || 'AI service error' })
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!reply) return res.status(502).json({ error: 'No response from AI' })

    Messages.create({ user_id: req.user.id, role: 'assistant', content: reply })
    res.json({ reply })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: 'Failed to reach AI service' })
  }
})

router.get('/history', auth, (req, res) => {
  res.json({ messages: Messages.findByUser(req.user.id) })
})

router.delete('/history', auth, (req, res) => {
  Messages.clearByUser(req.user.id)
  res.json({ success: true })
})

module.exports = router
