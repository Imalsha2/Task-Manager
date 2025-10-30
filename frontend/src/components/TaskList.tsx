import React, { useState } from 'react'
import { Task } from '../types'
import ConfirmDialog from './ConfirmDialog'

export default function TaskList({ tasks, onToggle, onUpdate, onDelete, onEdit }: {
  tasks: Task[]
  onToggle: (id: number) => Promise<void>
  onUpdate: (id: number, payload: Partial<Task>) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onEdit?: (t: Task) => void
}) {
  
  async function handleEditFallback(t: Task) {
    const title = window.prompt('Edit title', t.title)
    if (title == null) return
    const description = window.prompt('Edit description', t.description || '')
    if (description == null) return
    const assignee = window.prompt('Edit assignee', t.assignee || '')
    if (assignee == null) return
    await onUpdate(t.id, { title: title.trim(), description: description.trim() || undefined, assignee: assignee.trim() || undefined })
  }

  const [pendingDelete, setPendingDelete] = useState<Task | null>(null)

  return (
    <div className="task-list">
      {tasks.length === 0 && <p>No tasks yet</p>}
      {tasks.map(t => (
        <div key={t.id} className={`task ${t.completed ? 'done' : ''}`}>
          <div className="left">
            <label className="circle-checkbox">
              <input type="checkbox" checked={t.completed} onChange={() => onToggle(t.id)} />
              <span className="checkmark" aria-hidden="true">{t.completed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : null}</span>
            </label>

            <div className="content">
              <div className="title-row">
                <strong>{t.title}</strong>
                <div className="small-actions">
                  <button aria-label="edit" className="icon-btn edit" onClick={() => (onEdit ? onEdit(t) : handleEditFallback(t))}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21l3-1 11-11 2 2L8 22 3 21z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button aria-label="delete" className="icon-btn del" onClick={() => setPendingDelete(t)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
              {t.description && <div className="desc">{t.description}</div>}
              {t.assignee && <div className="assignee"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> {t.assignee}</div>}
            </div>
          </div>
        </div>
      ))}

      <ConfirmDialog open={!!pendingDelete} title="Delete task" message={pendingDelete ? `Delete "${pendingDelete.title}"?` : 'Delete this task?'} onConfirm={async () => {
        if (!pendingDelete) return
        await onDelete(pendingDelete.id)
        setPendingDelete(null)
      }} onCancel={() => setPendingDelete(null)} />
    </div>
  )
}
