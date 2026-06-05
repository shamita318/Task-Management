const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001; // avoid macOS services that sometimes use 5000
const DATA_FILE = path.resolve(__dirname, 'tasks.json');

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- API Endpoints ---

// 1. Fetch all tasks
app.get('/api/tasks', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data || '[]'));
  } catch (err) {
    res.json([]);
  }
});

// 2. Add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const tasks = JSON.parse(data || '[]');

    const newTask = { id: Date.now().toString(), title, description, dueDate, completed: false };
    tasks.push(newTask);

    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

    const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body,
      id: tasks[taskIndex].id,
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
    res.json(tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// === Active Persistent Listener Block ===

app.delete('/api/tasks/:id', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

    const tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
    const updatedTasks = tasks.filter((task) => task.id !== req.params.id);

    if (updatedTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedTasks, null, 2));
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- Active Persistent Listener Block ---
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(`🚀 SERVER ACTIVE AND LISTENING ON PORT ${PORT}`);
  console.log(`Using CORS origin: ${CLIENT_ORIGIN}`);
  console.log(`=================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port or set PORT environment variable.`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});