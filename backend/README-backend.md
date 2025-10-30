# Task Manager — Backend

This is a minimal Express + TypeScript backend for the Task Manager assignment.
It uses Sequelize with SQLite for simplicity.

Quick start (Windows PowerShell):

1. Install dependencies

```powershell
cd "e:\MY PROJECTS\Task Manager\backend"
npm install
```

2. Run in development (auto-restarts on change)

```powershell
npm run dev
```

3. Build and run production build

```powershell
npm run build; npm start
```

API endpoints (base: http://localhost:4000/api):

- GET /api/tasks - list tasks (optional query: ?completed=true)
- POST /api/tasks - create task { title, description?, assignee? }
- GET /api/tasks/:id - get single task
- PUT /api/tasks/:id - update task
- PATCH /api/tasks/:id/toggle - toggle completed
- DELETE /api/tasks/:id - delete task

Notes:
- By default the SQLite file `database.sqlite` is created in the backend folder.
- For simplicity there is no auth; add if needed.
