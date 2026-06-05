import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set base URL pointing directly to our backend server port
const API_URL = 'http://localhost:5001/api/tasks';

function App() {
  // --- State Management ---
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  // --- Fetch Tasks ---
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not connect to the backend server.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Create or Update Task Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Front-end Form Validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    };

    try {
      if (editingTask) {
        // Update existing task
        await axios.put(`${API_URL}/${editingTask.id}`, taskData);
        setEditingTask(null);
      } else {
        // Create brand new task
        await axios.post(API_URL, taskData);
      }
      
      // Clear inputs & refresh list
      setTitle('');
      setDescription('');
      setDueDate('');
      setError('');
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      setError(err.response?.data?.error || 'An error occurred while saving the task.');
    }
  };

  // --- Toggle Complete State ---
  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  // --- Trigger Edit Mode ---
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
  };

  // --- Cancel Edit Mode ---
  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  // --- Delete Task ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Task Management Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Keep track of your project metrics and deliverables in real time.
          </p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Task Form Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingTask ? '🔧 Edit Task' : '📝 Create Task'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add more context or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-colors shadow-sm ${
                      editingTask ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {editingTask ? 'Save Updates' : 'Add Task'}
                  </button>
                  
                  {editingTask && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Column 2 & 3: Task List View */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Total: {tasks.length}
                </span>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-5xl mb-3">🏖️</p>
                  <p className="text-lg font-medium">No tasks found. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-5 rounded-xl border transition-all duration-200 ${
                        task.completed 
                          ? 'bg-gray-50 border-gray-200 opacity-75' 
                          : 'bg-white border-gray-200 hover:border-indigo-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Checkbox status toggle */}
                          <input
                            type="checkbox"
                            className="mt-1.5 h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                            checked={task.completed}
                            onChange={() => toggleComplete(task)}
                          />
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm mt-1 text-gray-600 ${task.completed ? 'text-gray-400' : ''}`}>
                                {task.description}
                              </p>
                            )}
                            {task.dueDate && (
                              <div className="mt-3 flex items-center text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded w-fit">
                                📅 Due: {new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Control Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-1.5 text-gray-400 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition-colors"
                            title="Edit task"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;