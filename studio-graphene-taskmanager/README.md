# Task Management Dashboard

A full-stack task management dashboard built with React, Vite, Express, and Node.js. The app lets users create tasks, view task details, and track task completion from a simple dashboard interface.

## Features

- Create tasks with a title, description, and due date
- View all created tasks
- Track total number of tasks
- Mark tasks as complete or incomplete
- Delete tasks
- REST API backend using Express
- Local JSON file storage for task data

## Tech Stack

**Frontend used tech**

- React
- Vite
- Axios
- CSS / Tailwind CSS

**Backend used tech**

- Node.js
- Express.js
- CORS
- Nodemon
- File system based JSON storage

## Project Structure

```text
studio-graphene-taskmanager/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── index.js
│   ├── tasks.json
│   └── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 2. Start the backend server

From the `server` folder:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5001
```

API endpoint:

```text
http://localhost:5001/api/tasks
```

### 3. Start the frontend

Open a second terminal and run:

```bash
cd client
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Important Port Note

The frontend must call the backend on port `5001`:

```js
const API_URL = 'http://localhost:5001/api/tasks';
```

If the frontend tries to call `http://localhost:5000/api/tasks`, the app may show a backend connection error.

## Common Issues

### Could not connect to the backend server

Check that:

- The backend server is running in the `server` folder
- The frontend is using `http://localhost:5001/api/tasks`
- The frontend is running on `http://localhost:5173`
- CORS is configured to allow `http://localhost:5173`

### `cd server` says no such file or directory

If you are currently inside the `client` folder, use:

```bash
cd ../server
```

The `client` and `server` folders are next to each other.

## Author

Created as a full-stack task management project.
