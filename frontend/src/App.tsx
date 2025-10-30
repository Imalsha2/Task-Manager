import React, { useEffect, useMemo, useState } from 'react'
import { Task } from './types'
import { listTasks, createTask, toggleTask, updateTask, deleteTask } from './services/api'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'

type Filter = 'all' | 'active' | 'completed'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listTasks()
      setTasks(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(payload: Partial<Task>) {
    const created = await createTask(payload)
    setTasks(prev => [created, ...prev])
    setShowCreate(false)
  }

  async function handleToggle(id: number) {
    const updated = await toggleTask(id)
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function handleUpdate(id: number, payload: Partial<Task>) {
    const updated = await updateTask(id, payload)
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function handleDelete(id: number) {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const active = total - completed
    return { total, completed, active }
  }, [tasks])

  const users = useMemo(() => {
    const fromTasks = Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean))) as string[]
    const defaults = [
      'Nimal Perera',
      'Kumari Fernando',
      'Saman Silva',
      'Amali Piris',
      'Kavindi Jayawardena'
    ]
    return Array.from(new Set([...fromTasks, ...defaults]))
  }, [tasks])

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true
    if (filter === 'active') return !t.completed
    return t.completed
  })

  return (
    <div className="container app-root">
      <div className="top-card">
        <header className="app-header">
          <div>
            <h1>Task Manager</h1>
            <p className="subtitle">Organize and track your tasks efficiently</p>
          </div>
          <button className="btn primary" onClick={() => setShowCreate(true)}>+ New Task</button>
        </header>

        <section className="stats-row">
          <div className="stat card">
            <div className="label">Total Tasks</div>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat card green">
            <div className="label">Completed</div>
            <div className="value">{stats.completed}</div>
          </div>
          <div className="stat card orange">
            <div className="label">Active</div>
            <div className="value">{stats.active}</div>
          </div>
        </section>
      </div>

      <div className="top-card" style={{marginTop:18}}>
        <section className="controls">
          <div className="filter">
            <span className="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Filter:
            </span>
            <button className={`chip ${filter==='all'?'active':''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`chip ${filter==='active'?'active':''}`} onClick={() => setFilter('active')}>Active</button>
            <button className={`chip ${filter==='completed'?'active':''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
        </section>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

  <TaskList tasks={filtered} onToggle={handleToggle} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={t => setEditTask(t)} />

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <TaskForm onCreate={handleCreate} users={users} />
            <div style={{textAlign:'right', marginTop:8}}>
              <button className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editTask && (
        <div className="modal-overlay" onClick={() => setEditTask(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <TaskForm initialTask={editTask} onUpdate={async (id, payload) => {
              await handleUpdate(id, payload)
              setEditTask(null)
            }} users={users} />
            <div style={{textAlign:'right', marginTop:8}}>
              <button className="btn" onClick={() => setEditTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
