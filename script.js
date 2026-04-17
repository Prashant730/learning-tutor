// Add active class to current nav link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'
  const navLinks = document.querySelectorAll('.nav-link')

  navLinks.forEach((link) => {
    const href = link.getAttribute('href')
    if (href === currentPage) {
      link.classList.add('active')
    }
  })
}

// Initialize active nav link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink)

// Simulated login function
function simulateLogin(event) {
  event.preventDefault()
  const form = event.target
  const email = form.querySelector('#email').value
  const password = form.querySelector('#password').value

  if (email && password) {
    // In a real app, you would validate credentials with a server
    // For this demo, we'll just redirect to the dashboard
    window.location.href = 'dashboard.html'
  } else {
    alert('Please enter both email and password')
  }
}

// Simulated register function
function simulateRegister(event) {
  event.preventDefault()
  const form = event.target
  const name = form.querySelector('#name').value
  const email = form.querySelector('#reg-email').value
  const password = form.querySelector('#reg-password').value
  const confirmPassword = form.querySelector('#confirm-password').value

  if (name && email && password && confirmPassword) {
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // In a real app, you would send registration data to a server
    // For this demo, we'll just redirect to the dashboard
    window.location.href = 'dashboard.html'
  } else {
    alert('Please fill in all fields')
  }
}

// Chat functionality
function initChat() {
  const chatContent = document.getElementById('chat-content')
  const messageInput = document.getElementById('message-input')
  const chatForm = document.getElementById('chat-form')
  const resourcesToggle = document.getElementById('resources-toggle')
  const resourcesPanel = document.getElementById('resources-panel')
  const topicButtons = document.querySelectorAll('.topic-button')
  const topicResources = document.querySelectorAll('.topic-resources')

  if (!chatContent || !messageInput || !chatForm) return

  let isGenerating = false

  // Toggle resources panel
  if (resourcesToggle && resourcesPanel) {
    resourcesToggle.addEventListener('click', () => {
      resourcesPanel.classList.toggle('hidden')
    })
  }

  // Topic buttons
  if (topicButtons.length > 0 && topicResources.length > 0) {
    topicButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Update active button styles
        topicButtons.forEach((btn) => btn.classList.remove('active'))
        button.classList.add('active')

        // Show corresponding resources
        const topic = button.dataset.topic
        topicResources.forEach((resource) => {
          resource.classList.add('hidden')
        })
        document.getElementById(`${topic}-resources`).classList.remove('hidden')
      })
    })
  }

  // Handle chat form submission
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const message = messageInput.value.trim()

      if (isGenerating || !message) return

      // Add user message to chat
      addUserMessage(message)
      messageInput.value = ''

      // Show loading indicator
      const loadingIndicator = addLoadingIndicator()
      isGenerating = true

      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate AI response
        const response = generateResponse(message)

        // Remove loading indicator and add bot response
        chatContent.removeChild(loadingIndicator)
        addBotMessage(response)
      } catch (error) {
        console.error('Error generating response:', error)
        chatContent.removeChild(loadingIndicator)
        addBotMessage('Sorry, I encountered an error. Please try again.')
      } finally {
        isGenerating = false
        scrollToBottom()
      }
    })
  }

  function addUserMessage(content) {
    const messageDiv = document.createElement('div')
    messageDiv.className = 'user-message'
    messageDiv.innerHTML = `
      <div class="message-bubble user">
        <p>${content}</p>
      </div>
    `
    chatContent.appendChild(messageDiv)
    scrollToBottom()
  }

  function addBotMessage(content) {
    const messageDiv = document.createElement('div')
    messageDiv.className = 'bot-message'
    messageDiv.innerHTML = `
      <div class="message-bubble bot">
        <div class="bot-header">
          <span class="bot-icon">✨</span>
          <span class="bot-name">Gemini Flash</span>
        </div>
        <div class="bot-content">${content}</div>
      </div>
    `
    chatContent.appendChild(messageDiv)
    scrollToBottom()
  }

  function addLoadingIndicator() {
    const loadingDiv = document.createElement('div')
    loadingDiv.className = 'bot-message'
    loadingDiv.innerHTML = `
      <div class="message-bubble bot">
        <div class="loading-dots">
          <span class="dot animate-bounce"></span>
          <span class="dot animate-bounce-delay-1"></span>
          <span class="dot animate-bounce-delay-2"></span>
        </div>
      </div>
    `
    chatContent.appendChild(loadingDiv)
    scrollToBottom()
    return loadingDiv
  }

  function scrollToBottom() {
    chatContent.scrollTop = chatContent.scrollHeight
  }

  // Simple response generation (in a real app, this would call an API)
  function generateResponse(message) {
    const lowerMessage = message.toLowerCase()
    if (
      lowerMessage.includes('math') ||
      lowerMessage.includes('algebra') ||
      lowerMessage.includes('equation')
    ) {
      return `
        <p>I'd be happy to help with math! Here are some key concepts to remember:</p>
        <ul class="response-list">
          <li>Always isolate the variable when solving equations</li>
          <li>Remember the order of operations: PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction)</li>
          <li>Check your work by substituting your answer back into the original equation</li>
        </ul>
        <p class="mt-2">Would you like me to explain a specific math concept or help solve a problem?</p>
      `
    }

    if (
      lowerMessage.includes('science') ||
      lowerMessage.includes('physics') ||
      lowerMessage.includes('chemistry')
    ) {
      return `
        <p>Science is fascinating! Here are some resources that might help:</p>
        <ul class="response-list">
          <li>Khan Academy has excellent science tutorials</li>
          <li>PhET Interactive Simulations let you experiment virtually</li>
          <li>NASA's website has great resources for astronomy and earth science</li>
        </ul>
        <p class="mt-2">What specific science topic are you studying?</p>
      `
    }

    return `
      <p>Thank you for your question! I'm here to help with any subject you're studying.</p>
      <p class="mt-2">To give you the best assistance, could you provide more details about what you're working on? For example:</p>
      <ul class="response-list">
        <li>The specific subject or topic</li>
        <li>Any particular concepts you're finding challenging</li>
        <li>The grade level or course you're taking</li>
      </ul>
    `
  }
}

// Initialize chat functionality on page load
document.addEventListener('DOMContentLoaded', initChat)

// Dashboard functionality
function initDashboard() {
  const taskList = document.getElementById('task-list')
  const addTaskBtn = document.getElementById('add-task-btn')
  const progressBar = document.getElementById('progress-bar')

  if (!taskList || !addTaskBtn || !progressBar) return

  // Sample tasks
  const tasks = [
    { id: 1, text: 'Read for 20 minutes', completed: false },
    { id: 2, text: 'Solve 5 math problems', completed: false },
    { id: 3, text: 'Draw a picture', completed: false },
  ]

  // Render initial tasks
  renderTasks()

  // Add task button
  addTaskBtn.addEventListener('click', () => {
    const taskText = prompt('Enter a new task:')
    if (taskText) {
      const newTask = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        text: taskText,
        completed: false,
      }
      tasks.push(newTask)
      renderTasks()
    }
  })

  function renderTasks() {
    taskList.innerHTML = ''

    if (tasks.length === 0) {
      taskList.innerHTML =
        '<div class="empty-tasks">No tasks yet. Click "Add Task" to create one!</div>'
      return
    }

    tasks.forEach((task) => {
      const taskItem = document.createElement('div')
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`
      taskItem.innerHTML = `
        <input type="checkbox" id="task-${task.id}" ${
          task.completed ? 'checked' : ''
        }>
        <label for="task-${task.id}">${task.text}</label>
        <button class="delete-task" data-id="${task.id}">×</button>
      `
      taskList.appendChild(taskItem)

      // Add event listeners
      const checkbox = taskItem.querySelector(`#task-${task.id}`)
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked
        taskItem.classList.toggle('completed', task.completed)
        updateProgress()
      })

      const deleteBtn = taskItem.querySelector('.delete-task')
      deleteBtn.addEventListener('click', () => {
        const index = tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          tasks.splice(index, 1)
          renderTasks()
        }
      })
    })

    updateProgress()
  }

  function updateProgress() {
    const completedCount = tasks.filter((task) => task.completed).length
    const progress =
      tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
    progressBar.style.width = `${progress}%`
    progressBar.textContent = `${progress}%`
  }
}

// Initialize dashboard functionality on page load
document.addEventListener('DOMContentLoaded', initDashboard)

// Load socket.io library dynamically from backend
function loadSocketIO() {
  return new Promise((resolve, reject) => {
    const backendUrl =
      window.BACKEND_URL || 'https://learning-tutor-api.onrender.com'
    const script = document.createElement('script')
    script.src = `${backendUrl}/socket.io/socket.io.js`
    script.async = true
    script.onload = () => {
      if (window.io && typeof window.io === 'function') {
        console.log('Socket.io library loaded successfully')
        resolve(window.io)
      } else {
        reject(new Error('Socket.io library loaded but not accessible'))
      }
    }
    script.onerror = () => {
      const errorMsg = `Failed to load socket.io from ${script.src}`
      console.error(errorMsg)
      reject(new Error(errorMsg))
    }
    document.head.appendChild(script)
  })
}

// Video call functionality
function initVideoCall() {
  const joinBtn = document.getElementById('join-call-btn')
  const createBtn = document.getElementById('create-call-btn')
  const copyRoomBtn = document.getElementById('copy-room-btn')
  const setupScreen = document.getElementById('setup-screen')
  const callScreen = document.getElementById('call-screen')
  const endCallBtn = document.getElementById('end-call-btn')
  const micBtn = document.getElementById('mic-btn')
  const cameraBtn = document.getElementById('camera-btn')
  const roomCodeInput = document.getElementById('room-code-input')
  const displayNameInput = document.getElementById('display-name-input')
  const activeRoomCode = document.getElementById('active-room-code')
  const localVideo = document.getElementById('local-video')
  const remoteVideo = document.getElementById('remote-video')
  const localPlaceholder = document.getElementById('local-placeholder')
  const remotePlaceholder = document.getElementById('remote-placeholder')
  const connectionStatus = document.getElementById('connection-status')
  const statusDot = document.getElementById('status-dot')
  const statusText = document.getElementById('status-text')
  const participantsList = document.getElementById('participants-list')
  const sessionSummary = document.getElementById('session-summary')
  const shareRoomCode = document.getElementById('share-room-code')

  if (!joinBtn || !createBtn || !setupScreen || !callScreen) return

  let socket = null
  let localStream = null
  let peerConnection = null
  let currentRoomCode = ''
  let currentPeerId = null
  let isEndingCall = false
  let rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }
  const participants = new Map()

  function getDisplayName() {
    const value = displayNameInput?.value?.trim()
    return value || 'Student'
  }

  function getRoomCode() {
    const value = roomCodeInput?.value?.trim()
    return (
      value || `ROOM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    )
  }

  function setStatus(text, type = 'pending') {
    if (statusText) statusText.textContent = text
    if (statusDot) {
      statusDot.classList.remove('connected', 'error')
      if (type === 'connected') statusDot.classList.add('connected')
      if (type === 'error') statusDot.classList.add('error')
    }
  }

  function syncShareCode(code) {
    if (shareRoomCode) shareRoomCode.textContent = code || 'Not created yet'
    if (activeRoomCode) activeRoomCode.textContent = code || 'TUTOR-204'
  }

  async function loadWebRtcConfig() {
    try {
      const backendUrl =
        window.BACKEND_URL || 'https://learning-tutor-api.onrender.com'
      const response = await fetch(`${backendUrl}/api/webrtc-config`)
      if (!response.ok) return

      const data = await response.json()
      if (Array.isArray(data?.iceServers) && data.iceServers.length > 0) {
        rtcConfig = { iceServers: data.iceServers }
      }
    } catch (error) {
      console.warn('Using default WebRTC config:', error)
    }
  }

  function getTrackState() {
    const [audioTrack] = localStream?.getAudioTracks?.() || []
    const [videoTrack] = localStream?.getVideoTracks?.() || []
    return {
      micOn: audioTrack ? audioTrack.enabled : true,
      cameraOn: videoTrack ? videoTrack.enabled : true,
    }
  }

  function ensureMediaVisible() {
    if (localVideo && localVideo.srcObject)
      localPlaceholder?.classList.add('hidden')
    if (remoteVideo && remoteVideo.srcObject)
      remotePlaceholder?.classList.add('hidden')
  }

  function renderParticipants() {
    if (!participantsList) return

    const ordered = [...participants.values()].sort(
      (left, right) => (left.order || 99) - (right.order || 99),
    )

    participantsList.innerHTML = ordered
      .map((participant) => {
        const statusClass = participant.online
          ? participant.connected
            ? 'live'
            : ''
          : 'offline'
        const statusLabel = participant.online
          ? participant.connected
            ? 'Connected'
            : 'In room'
          : 'Left'

        return `
          <div class="participant-row">
            <div class="participant-row-header">
              <div class="participant-name">${participant.name}${participant.isLocal ? ' (You)' : ''}</div>
              <span class="participant-status ${statusClass}">${statusLabel}</span>
            </div>
            <div class="participant-metadata">
              <span class="meta-pill">Joined #${participant.order || '?'}</span>
              <span class="meta-pill">Mic ${participant.micOn ? 'On' : 'Muted'}</span>
              <span class="meta-pill">Camera ${participant.cameraOn ? 'On' : 'Off'}</span>
            </div>
          </div>
        `
      })
      .join('')

    renderSessionSummary()
  }

  function renderSessionSummary() {
    if (!sessionSummary) return

    const ordered = [...participants.values()].sort(
      (left, right) => (left.order || 99) - (right.order || 99),
    )

    if (ordered.length === 0) {
      sessionSummary.textContent =
        'No session started yet. Create or join a room to see who joined first and who is muted.'
      return
    }

    const first = ordered[0]
    const second = ordered[1]
    const local = ordered.find((participant) => participant.isLocal)
    const remote = ordered.find((participant) => !participant.isLocal)

    const firstText = first.isLocal
      ? 'You joined first.'
      : `${first.name} joined first.`
    const secondText = second
      ? second.isLocal
        ? 'You joined second.'
        : `${second.name} joined second.`
      : 'Waiting for a second participant.'

    const localText = local
      ? `You are ${local.micOn ? 'unmuted' : 'muted'} and your camera is ${local.cameraOn ? 'on' : 'off'}.`
      : ''
    const remoteText = remote
      ? `${remote.name} is ${remote.micOn ? 'unmuted' : 'muted'} and their camera is ${remote.cameraOn ? 'on' : 'off'}.`
      : 'No peer is connected yet.'

    sessionSummary.textContent =
      `${firstText} ${secondText} ${localText} ${remoteText}`.trim()
  }

  function upsertParticipant(id, updates) {
    const existing = participants.get(id) || {
      id,
      name: updates.name || 'Anonymous',
      order: updates.order || participants.size + 1,
      isLocal: !!updates.isLocal,
      online: true,
      connected: false,
      micOn: true,
      cameraOn: true,
    }

    Object.assign(existing, updates)
    participants.set(id, existing)
    renderParticipants()
  }

  function markParticipantOffline(id) {
    const participant = participants.get(id)
    if (!participant) return
    participant.online = false
    participant.connected = false
    renderParticipants()
  }

  function syncLocalParticipant() {
    const tracks = getTrackState()
    upsertParticipant('local', {
      name: getDisplayName(),
      order: participants.get('local')?.order || 1,
      isLocal: true,
      online: true,
      connected: true,
      micOn: tracks.micOn,
      cameraOn: tracks.cameraOn,
    })
  }

  function publishMediaState() {
    if (!socket || !currentRoomCode || !localStream) return
    const tracks = getTrackState()

    socket.emit('media-state', {
      roomCode: currentRoomCode,
      video: tracks.cameraOn,
      audio: tracks.micOn,
    })
  }

  async function ensureLocalStream() {
    if (localStream) return localStream

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      if (localVideo) localVideo.srcObject = localStream
      ensureMediaVisible()
      syncLocalParticipant()
      return localStream
    } catch (error) {
      console.error('Failed to access camera/microphone:', error)
      setStatus('Camera or microphone permission blocked', 'error')
      throw error
    }
  }

  function createPeerConnection() {
    if (peerConnection) return peerConnection

    peerConnection = new RTCPeerConnection(rtcConfig)

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })
    }

    peerConnection.ontrack = (event) => {
      if (!remoteVideo) return
      remoteVideo.srcObject = event.streams[0]
      ensureMediaVisible()
      setStatus('Connected', 'connected')
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket && currentPeerId) {
        socket.emit('ice-candidate', {
          to: currentPeerId,
          candidate: event.candidate,
        })
      }
    }

    peerConnection.onconnectionstatechange = () => {
      if (!peerConnection) return
      if (peerConnection.connectionState === 'connected')
        setStatus('Connected', 'connected')
      if (peerConnection.connectionState === 'disconnected')
        setStatus('Peer disconnected', 'pending')
      if (peerConnection.connectionState === 'failed')
        setStatus('Connection failed', 'error')
    }

    return peerConnection
  }

  async function createOffer() {
    if (!peerConnection || !currentPeerId) return

    try {
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      socket.emit('offer', {
        to: currentPeerId,
        offer,
      })
    } catch (error) {
      console.error('Failed to create offer:', error)
      setStatus('Failed to create offer: ' + error.message, 'error')
    }
  }

  async function handlePeerSignal(peerId, shouldInitiate = false) {
    currentPeerId = peerId
    const pc = createPeerConnection()

    if (shouldInitiate) {
      // Small delay to ensure peer connection is ready
      await new Promise((resolve) => setTimeout(resolve, 100))
      await createOffer()
    }
  }

  async function launchCall(roomCodeOverride, mode = 'join') {
    // Load socket.io library if not already loaded
    if (!window.io || typeof window.io !== 'function') {
      try {
        setStatus('Loading socket.io...', 'pending')
        await loadSocketIO()
      } catch (error) {
        console.error('Failed to load socket.io:', error)
        setStatus('Failed to connect: ' + error.message, 'error')
        return
      }
    }

    if (!window.io || typeof window.io !== 'function') {
      setStatus('Socket client not available', 'error')
      return
    }

    await loadWebRtcConfig()

    currentRoomCode = roomCodeOverride || getRoomCode()
    syncShareCode(currentRoomCode)

    participants.clear()
    upsertParticipant('local', {
      name: getDisplayName(),
      order: 1,
      isLocal: true,
      online: true,
      connected: true,
      micOn: true,
      cameraOn: true,
    })

    setupScreen.classList.add('hidden')
    callScreen.classList.remove('hidden')
    setStatus('Requesting camera and microphone...', 'pending')

    try {
      await ensureLocalStream()
    } catch {
      participants.clear()
      renderParticipants()
      syncShareCode('Not created yet')
      currentRoomCode = ''
      callScreen.classList.add('hidden')
      setupScreen.classList.remove('hidden')
      return
    }

    // Connect to backend socket.io server (default: Render production)
    const backendUrl =
      window.BACKEND_URL || 'https://learning-tutor-api.onrender.com'
    socket = window.io(backendUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socket.on('connect', () => {
      console.log('Socket.io connected:', socket.id)
      socket.emit('join-room', {
        roomCode: currentRoomCode,
        userName: getDisplayName(),
      })
      setStatus('Connected to room', 'pending')
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setStatus('Connection error: ' + error.message, 'error')
    })

    socket.on('room-peers', async (peers) => {
      try {
        const peer = peers?.[0]
        if (peer) {
          upsertParticipant(peer.id, {
            name: peer.name || 'Peer',
            order: 1,
            isLocal: false,
            online: true,
            connected: true,
          })
          upsertParticipant('local', {
            name: getDisplayName(),
            order: 2,
            isLocal: true,
            online: true,
            connected: true,
          })
          await handlePeerSignal(peer.id, true)
          setStatus(`Joining as ${getDisplayName()}`, 'pending')
        } else {
          upsertParticipant('local', {
            name: getDisplayName(),
            order: 1,
            isLocal: true,
            online: true,
            connected: true,
          })
          if (mode === 'create')
            setStatus('Waiting for another participant', 'pending')
        }
      } catch (error) {
        console.error('Error handling room-peers event:', error)
        setStatus('Error joining room: ' + error.message, 'error')
      }
    })

    socket.on('peer-joined', async ({ id, name }) => {
      try {
        if (!currentPeerId) {
          upsertParticipant(id, {
            name: name || 'Peer',
            order: 2,
            isLocal: false,
            online: true,
            connected: true,
          })
          await handlePeerSignal(id, false)
        }
        setStatus('Peer joined the room', 'pending')
      } catch (error) {
        console.error('Error handling peer-joined event:', error)
        setStatus('Error with peer: ' + error.message, 'error')
      }
    })

    socket.on('offer', async ({ from, offer }) => {
      try {
        currentPeerId = from
        createPeerConnection()
        await peerConnection.setRemoteDescription(offer)
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        socket.emit('answer', {
          to: from,
          answer,
        })
      } catch (error) {
        console.error('Error handling offer:', error)
        setStatus('Error during offer handling: ' + error.message, 'error')
      }
    })

    socket.on('answer', async ({ answer }) => {
      try {
        if (!peerConnection) return
        await peerConnection.setRemoteDescription(answer)
        setStatus('Connected', 'connected')
      } catch (error) {
        console.error('Error handling answer:', error)
        setStatus('Error during answer handling: ' + error.message, 'error')
      }
    })

    socket.on('ice-candidate', async ({ candidate }) => {
      if (peerConnection && candidate) {
        try {
          await peerConnection.addIceCandidate(candidate)
        } catch (error) {
          console.error('Failed to add ICE candidate:', error)
        }
      }
    })

    socket.on('peer-media-state', ({ id, video, audio }) => {
      const participant = participants.get(id)
      if (!participant) return
      upsertParticipant(id, {
        micOn: !!audio,
        cameraOn: !!video,
        connected: true,
        online: true,
      })
    })

    socket.on('peer-left', ({ id }) => {
      if (id === currentPeerId) {
        currentPeerId = null
        if (remoteVideo) remoteVideo.srcObject = null
        remotePlaceholder?.classList.remove('hidden')
        setStatus('Peer left the room', 'pending')
      }
      markParticipantOffline(id)
    })

    socket.on('disconnect', () => {
      if (!isEndingCall)
        setStatus('Disconnected from signaling server', 'error')
    })
  }

  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      const roomCode = roomCodeInput?.value?.trim()
      if (!roomCode) {
        setStatus('Enter a room code first, then join.', 'error')
        roomCodeInput?.focus()
        return
      }

      launchCall(roomCode, 'join')
    })
  }

  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const roomCode = roomCodeInput?.value?.trim() || getRoomCode()
      if (roomCodeInput) roomCodeInput.value = roomCode
      syncShareCode(roomCode)
      launchCall(roomCode, 'create')
    })
  }

  if (copyRoomBtn) {
    copyRoomBtn.addEventListener('click', async () => {
      const code = currentRoomCode || roomCodeInput?.value?.trim()
      if (!code) {
        setStatus('Create or enter a room code before copying.', 'error')
        return
      }

      try {
        await navigator.clipboard.writeText(code)
        setStatus(`Copied room code ${code}`, 'pending')
      } catch {
        setStatus('Could not copy the room code.', 'error')
      }
    })
  }

  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      endCall()
    })
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      const [audioTrack] = localStream?.getAudioTracks?.() || []
      if (!audioTrack) return

      audioTrack.enabled = !audioTrack.enabled
      micBtn.classList.toggle('active', audioTrack.enabled)
      upsertParticipant('local', {
        name: getDisplayName(),
        ...getTrackState(),
        isLocal: true,
        online: true,
        connected: true,
      })
      setStatus(
        audioTrack.enabled ? 'Microphone on' : 'Microphone muted',
        'pending',
      )
      publishMediaState()
    })
  }

  if (cameraBtn) {
    cameraBtn.addEventListener('click', () => {
      const [videoTrack] = localStream?.getVideoTracks?.() || []
      if (!videoTrack) return

      videoTrack.enabled = !videoTrack.enabled
      cameraBtn.classList.toggle('active', videoTrack.enabled)
      upsertParticipant('local', {
        name: getDisplayName(),
        ...getTrackState(),
        isLocal: true,
        online: true,
        connected: true,
      })
      setStatus(videoTrack.enabled ? 'Camera on' : 'Camera off', 'pending')
      publishMediaState()
    })
  }

  function endCall() {
    isEndingCall = true

    if (socket) {
      socket.emit('leave-room', { roomCode: currentRoomCode })
      socket.removeAllListeners()
      socket.disconnect()
      socket = null
    }

    if (peerConnection) {
      peerConnection.ontrack = null
      peerConnection.onicecandidate = null
      peerConnection.onconnectionstatechange = null
      peerConnection.close()
      peerConnection = null
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      localStream = null
    }

    if (localVideo) localVideo.srcObject = null
    if (remoteVideo) remoteVideo.srcObject = null
    localPlaceholder?.classList.remove('hidden')
    remotePlaceholder?.classList.remove('hidden')

    participants.clear()
    renderParticipants()
    syncShareCode('Not created yet')

    callScreen.classList.add('hidden')
    setupScreen.classList.remove('hidden')
    setStatus('Waiting for connection', 'pending')

    currentPeerId = null
    currentRoomCode = ''
    isEndingCall = false
  }

  renderParticipants()
}

// Initialize video call functionality on page load
document.addEventListener('DOMContentLoaded', initVideoCall)
