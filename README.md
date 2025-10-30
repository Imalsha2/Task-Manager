# Task Manager (Fullstack)

This workspace contains a minimal Task Manager web app with:

- Frontend: React + TypeScript (Vite)
- Backend: Node + Express + TypeScript, Sequelize ORM with SQLite

Folders:
- `backend` - Express API (port 4000)
- `frontend` - Vite React app (port 5173)

Quick start (Windows PowerShell):

1) Backend

```powershell
cd "e:\MY PROJECTS\Task Manager\backend"
npm install
npm run dev
```

The backend will create `database.sqlite` in the backend folder and listen on port 4000.

2) Frontend (in a new terminal)

```powershell
cd "e:\MY PROJECTS\Task Manager\frontend"
npm install
npm run dev
```

Open http://localhost:5173 (Vite will show the exact URL). The frontend talks to the backend at http://localhost:4000 by default.

Notes and next steps:
- This scaffold implements the requested features: list, add, edit, delete tasks; assign to users (assignee string); mark completed; filter by completion (backend supports query param `?completed=true`).
- The backend uses Sequelize with SQLite for simplicity. Swap to Postgres by updating Sequelize config.
- No authentication is included; add JWT or sessions if needed.

If you want, I can:
- Add simple unit tests for backend endpoints.
- Add Dockerfiles for both services.
- Add CORS or environment configuration improvements.
