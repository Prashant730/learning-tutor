const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const crypto = require('crypto')

const adapter = new FileSync(path.join(__dirname, 'db.json'))
const db = low(adapter)

// Default structure
db.defaults({
  users: [],
  tasks: [],
  completed_dates: [],
  chat_messages: [],
}).write()

// Helper: generate a unique ID
function newId() {
  return crypto.randomBytes(8).toString('hex')
}

// ── Users ─────────────────────────────────────────────────────────────────────
const Users = {
  findByEmail: (email) => db.get('users').find({ email }).value(),
  findById: (id) => db.get('users').find({ id }).value(),
  create: ({ name, email, password, role = 'student' }) => {
    const user = {
      id: newId(),
      name,
      email,
      password,
      role,
      created_at: new Date().toISOString(),
    }
    db.get('users').push(user).write()
    return user
  },
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
const Tasks = {
  findByUser: (userId) => db.get('tasks').filter({ user_id: userId }).value(),
  findById: (id) => db.get('tasks').find({ id }).value(),
  create: ({ user_id, text, subject = 'general', is_ai_generated = false }) => {
    const task = {
      id: newId(),
      user_id,
      text,
      subject,
      completed: false,
      is_ai_generated,
      created_at: new Date().toISOString(),
    }
    db.get('tasks').push(task).write()
    return task
  },
  update: (id, data) => {
    db.get('tasks').find({ id }).assign(data).write()
    return db.get('tasks').find({ id }).value()
  },
  remove: (id) => {
    db.get('tasks').remove({ id }).write()
  },
}

// ── Completed Dates ───────────────────────────────────────────────────────────
const Dates = {
  findByUser: (userId) =>
    db.get('completed_dates').filter({ user_id: userId }).map('date').value(),
  exists: (userId, date) =>
    !!db.get('completed_dates').find({ user_id: userId, date }).value(),
  add: (userId, date) => {
    db.get('completed_dates')
      .push({ id: newId(), user_id: userId, date })
      .write()
  },
  remove: (userId, date) => {
    db.get('completed_dates').remove({ user_id: userId, date }).write()
  },
}

// ── Chat Messages ─────────────────────────────────────────────────────────────
const Messages = {
  findByUser: (userId, limit = 100) =>
    db
      .get('chat_messages')
      .filter({ user_id: userId })
      .takeRight(limit)
      .value(),
  create: ({ user_id, role, content }) => {
    const msg = {
      id: newId(),
      user_id,
      role,
      content,
      created_at: new Date().toISOString(),
    }
    db.get('chat_messages').push(msg).write()
    return msg
  },
  clearByUser: (userId) => {
    db.get('chat_messages').remove({ user_id: userId }).write()
  },
}

module.exports = { Users, Tasks, Dates, Messages }
