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
const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
]

const allowedOrigins = Array.from(
  new Set(
    [process.env.CORS_ORIGIN || '', ...defaultOrigins]
      .filter(Boolean)
      .flatMap((value) => value.split(','))
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
)

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
)
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
)
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

  const fallbackTurnServers = [
    {
      urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: [
        'turn:numb.viagenie.ca:3478?transport=udp',
        'turn:numb.viagenie.ca:3478?transport=tcp',
      ],
      username: 'webrtcdemo@gmail.com',
      credential: 'webrtcdemo',
    },
  ]

  const turnUrls = process.env.TURN_URLS
  const turnUsername = process.env.TURN_USERNAME
  const turnCredential = process.env.TURN_CREDENTIAL
  let hasTurnServer = false

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
      hasTurnServer = true
    }
  }

  if (!hasTurnServer) {
    iceServers.push(...fallbackTurnServers)
  }

  res.json({
    iceServers,
    hasTurn: hasTurnServer || iceServers.length > 2,
  })
})

// Serve frontend static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// Fallback: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
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
  console.log(`🔗 Socket connected: ${socket.id}`)

  // Create a new video room
  socket.on('create-room', ({ name }) => {
    console.log(
      `📍 Received create-room event from ${socket.id} with name: ${name}`,
    )
    // Generate a simple room ID (you could use uuid for better uniqueness)
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()

    socket.join(roomId)
    socket.roomCode = roomId
    socket.userName = name || 'Anonymous'

    if (!rooms.has(roomId)) rooms.set(roomId, new Map())
    rooms.get(roomId).set(socket.id, socket.userName)

    // Send room-created event back to the client
    console.log(
      `📤 Sending room-created event to ${socket.id}: roomId=${roomId}`,
    )
    socket.emit('room-created', {
      roomId: roomId,
      name: socket.userName,
    })

    console.log(`✅ Room ${roomId} created by ${socket.userName}`)
  })

  // Join a video room
  socket.on('join-room', ({ roomId, name }) => {
    if (!roomId) return

    socket.join(roomId)
    socket.roomCode = roomId
    socket.userName = name || 'Anonymous'

    if (!rooms.has(roomId)) rooms.set(roomId, new Map())
    rooms.get(roomId).set(socket.id, socket.userName)

    const peers = [...rooms.get(roomId).entries()]
      .filter(([id]) => id !== socket.id)
      .map(([id, name]) => ({ id, name }))

    // Confirm to the joining peer that they successfully joined
    console.log(
      `📤 Sending room-joined confirmation to ${socket.id} for room ${roomId}`,
    )
    socket.emit('room-joined', {
      roomId: roomId,
      name: socket.userName,
    })

    // Tell the new peer about existing peers
    socket.emit('room-peers', { peers })

    // Tell existing peers about the new joiner
    socket.to(roomId).emit('peer-joined', {
      id: socket.id,
      name: socket.userName,
    })

    console.log(
      `✅ ${socket.userName} joined room ${roomId} (${rooms.get(roomId).size} peers)`,
    )
  })

  // WebRTC offer
  socket.on('offer', ({ target, sdp, name }) => {
    console.log(`Offer from ${socket.id} to ${target}`)
    io.to(target).emit('offer', {
      from: socket.id,
      name: socket.userName || name,
      sdp,
    })
  })

  // WebRTC answer
  socket.on('answer', ({ target, sdp, name }) => {
    console.log(`Answer from ${socket.id} to ${target}`)
    io.to(target).emit('answer', {
      from: socket.id,
      name: socket.userName || name,
      sdp,
    })
  })

  // ICE candidate exchange
  socket.on('ice-candidate', ({ target, candidate }) => {
    io.to(target).emit('ice-candidate', { from: socket.id, candidate })
  })

  // Peer media state changes (mute/camera off)
  socket.on('media-state', ({ video, audio }) => {
    if (socket.roomCode) {
      socket.to(socket.roomCode).emit('peer-media-state', {
        id: socket.id,
        video,
        audio,
      })
    }
  })

  // Explicit leave (end call button)
  socket.on('leave-room', () => {
    const roomCode = socket.roomCode
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
