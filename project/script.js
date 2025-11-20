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

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I help with your learning today?'
    }

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

// Video call functionality
function initVideoCall() {
  const joinBtn = document.getElementById('join-call-btn')
  const createBtn = document.getElementById('create-call-btn')
  const setupScreen = document.getElementById('setup-screen')
  const callScreen = document.getElementById('call-screen')
  const endCallBtn = document.getElementById('end-call-btn')
  const micBtn = document.getElementById('mic-btn')
  const cameraBtn = document.getElementById('camera-btn')

  if (!joinBtn || !createBtn || !setupScreen || !callScreen) return

  // Join call button
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      const roomCode = prompt('Enter room code:')
      if (roomCode) {
        startCall()
      }
    })
  }

  // Create call button
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      startCall()
    })
  }

  // End call button
  if (endCallBtn) {
    endCallBtn.addEventListener('click', () => {
      endCall()
    })
  }

  // Mic toggle
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      micBtn.classList.toggle('active')
    })
  }

  // Camera toggle
  if (cameraBtn) {
    cameraBtn.addEventListener('click', () => {
      cameraBtn.classList.toggle('active')
    })
  }

  function startCall() {
    setupScreen.classList.add('hidden')
    callScreen.classList.remove('hidden')

    // In a real app, you would initialize WebRTC here
    console.log('Starting call...')
  }

  function endCall() {
    callScreen.classList.add('hidden')
    setupScreen.classList.remove('hidden')

    // In a real app, you would clean up WebRTC connections here
    console.log('Ending call...')
  }
}

// Initialize video call functionality on page load
document.addEventListener('DOMContentLoaded', initVideoCall)
