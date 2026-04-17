require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const jwt = require('jsonwebtoken')

const app = express()
const server = http.createServer(app)

// ─── Socket.io setup ────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json())

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, please slow down.' },
})

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'Chat rate limit reached. Wait a minute.' },
})

app.use('/api/', apiLimiter)
app.use('/api/chat', chatLimiter)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/chat', require('./routes/chat'))

app.get('/api/webrtc-config', (req, res) => {
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]

  const turnUrls = process.env.TURN_URLS
  const turnUsername = process.env.TURN_USERNAME
  const turnCredential = process.env.TURN_CREDENTIAL

  if (turnUrls && turnUsername && turnCredential) {
    const urls = turnUrls
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    if (urls.length > 0) {
      iceServers.push({
        urls,
        username: turnUsername,
        credential: turnCredential,
      })
    }
  }

  res.json({
    iceServers,
    hasTurn: iceServers.length > 2,
  })
})

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')))

// Fallback: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'))
})

// ─── WebRTC Signaling via Socket.io ─────────────────────────────────────────
// rooms: { roomCode: Set<socketId> }
const rooms = new Map()

io.use((socket, next) => {
  // Optional: verify JWT for socket connections
  const token = socket.handshake.auth?.token
  if (token) {
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      socket.user = null
    }
  }
  next()
})

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)

  // Join a video room
  socket.on('join-room', ({ roomCode, userName }) => {
    if (!roomCode) return

    socket.join(roomCode)
    socket.roomCode = roomCode
    socket.userName = userName || 'Anonymous'

    if (!rooms.has(roomCode)) rooms.set(roomCode, new Map())
    rooms.get(roomCode).set(socket.id, socket.userName)

    const peers = [...rooms.get(roomCode).entries()]
      .filter(([id]) => id !== socket.id)
      .map(([id, name]) => ({ id, name }))

    // Tell the new peer about existing peers
    socket.emit('room-peers', peers)

    // Tell existing peers about the new joiner
    socket.to(roomCode).emit('peer-joined', {
      id: socket.id,
      name: socket.userName,
    })

    console.log(
      `${socket.userName} joined room ${roomCode} (${rooms.get(roomCode).size} peers)`,
    )
  })

  // WebRTC offer
  socket.on('offer', ({ to, offer }) => {
    console.log(`Offer from ${socket.id} to ${to}`)
    io.to(to).emit('offer', { from: socket.id, name: socket.userName, offer })
  })

  // WebRTC answer
  socket.on('answer', ({ to, answer }) => {
    console.log(`Answer from ${socket.id} to ${to}`)
    io.to(to).emit('answer', { from: socket.id, answer })
  })

  // ICE candidate exchange
  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate })
  })

  // Peer media state changes (mute/camera off)
  socket.on('media-state', ({ roomCode, video, audio }) => {
    socket.to(roomCode).emit('peer-media-state', {
      id: socket.id,
      video,
      audio,
    })
  })

  // Explicit leave (end call button)
  socket.on('leave-room', ({ roomCode }) => {
    if (roomCode && rooms.has(roomCode)) {
      rooms.get(roomCode).delete(socket.id)
      if (rooms.get(roomCode).size === 0) rooms.delete(roomCode)
      socket.to(roomCode).emit('peer-left', { id: socket.id })
      socket.leave(roomCode)
    }
  })

  // Disconnect
  socket.on('disconnect', () => {
    const roomCode = socket.roomCode
    if (roomCode && rooms.has(roomCode)) {
      rooms.get(roomCode).delete(socket.id)
      if (rooms.get(roomCode).size === 0) rooms.delete(roomCode)
      socket.to(roomCode).emit('peer-left', { id: socket.id })
    }
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`\n🎓 AI Tutoring Tool running at http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(
    `   Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️  Not configured'}\n`,
  )
})
