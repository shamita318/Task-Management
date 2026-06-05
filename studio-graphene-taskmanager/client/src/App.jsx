import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

function App() {
  // --- State Management ---
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  // --- Fetch Tasks from Local Storage ---
  const fetchTasks = () => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Error parsing tasks:', err);
      setError('Failed to load tasks from local storage.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Task Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        title: typeof title !== 'undefined' ? title.trim() : '',
        description: typeof description !== 'undefined' ? description.trim() : '',
        dueDate: typeof dueDate !== 'undefined' ? dueDate || null : null,
        id: Date.now().toString(),
        completed: false
      };

      if (!newTask.title) {
        setError('Title is required.');
        return;
      }

      const currentTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
      const updatedTasks = [...currentTasks, newTask];
      
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setError('');
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Could not save your task to local storage.');
    }
  };

  // --- Toggle Complete State ---
  const toggleComplete = (task) => {
    try {
      const currentTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
      const updatedTasks = currentTasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Could not update task status.');
    }
  };

  // --- Delete Task Handler ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const currentTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        const updatedTasks = currentTasks.filter(task => task.id !== id);
        
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Could not delete your task.');
      }
    }
  };

  // --- Render Layout ---
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Task Management Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Keep track of your project metrics and deliverables in real time.
          </p>
        </header>

        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
    </div>
  );
}

export default App;
