// ─── API Client ──────────────────────────────────────────────────────────────
const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('auth_token')
}

function setSession(token, user) {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('auth_user'))
  } catch {
    return null
  }
}

function isLoggedIn() {
  return !!getToken() && !!getUser()
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

// Auth
const Auth = {
  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setSession(data.token, data.user)
    return data
  },

  async register(name, email, password, role) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
    setSession(data.token, data.user)
    return data
  },

  logout() {
    clearSession()
    window.location.href = 'login.html'
  },
}

// Tasks
const Tasks = {
  getAll: () => apiFetch('/tasks'),
  create: (text, subject, is_ai_generated = false) =>
    apiFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify({ text, subject, is_ai_generated }),
    }),
  toggle: (id, completed) =>
    apiFetch(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  remove: (id) => apiFetch(`/tasks/${id}`, { method: 'DELETE' }),
  getDates: () => apiFetch('/tasks/dates'),
  toggleDate: (date) =>
    apiFetch('/tasks/dates', {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),
}

// Chat
const Chat = {
  send: (message) =>
    apiFetch('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getHistory: () => apiFetch('/chat/history'),
  clearHistory: () => apiFetch('/chat/history', { method: 'DELETE' }),
}

// Guard: redirect to login if not authenticated (call on protected pages)
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html'
    return false
  }
  // Show user name in nav if element exists
  const userEl = document.getElementById('nav-user-name')
  if (userEl) userEl.textContent = getUser()?.name || ''
  return true
}
