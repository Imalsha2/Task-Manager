import React, { useState } from 'react'
import { Task } from '../types'

export default function TaskForm({ onCreate, onUpdate, users, initialTask }: { onCreate?: (payload: Partial<Task>) => Promise<void>, onUpdate?: (id: number, payload: Partial<Task>) => Promise<void>, users?: string[], initialTask?: Task }) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [assignee, setAssignee] = useState(initialTask?.assignee || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Please enter a title')
      return
    }
    
    if (!initialTask && !assignee) {
      setError('Please select a user to assign this task')
      return
    }
    setLoading(true)
    try {
      const payload: Partial<Task> = { title: title.trim(), description: description.trim() || undefined, assignee: assignee || undefined }
      if (initialTask && onUpdate) {
        await onUpdate(initialTask.id, payload)
      } else if (onCreate) {
        await onCreate(payload)
      }
      // clear only when creating
      if (!initialTask) {
        setTitle('')
        setDescription('')
        setAssignee('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="task-form modal-form" onSubmit={submit}>
      <label className="label">Title *</label>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title" />

      <label className="label">Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter task description" />

      <label className="label">Assign To</label>
      {users && users.length > 0 ? (
        <select value={assignee} onChange={e => setAssignee(e.target.value)} aria-label="Assign to">
          <option value="">Select a user</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      ) : (
        <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Assignee (optional)" />
      )}

      {error && <div className="error" style={{marginTop:8}}>{error}</div>}

      <div style={{display:'flex', gap:8, marginTop:8, alignItems:'center'}}>
        {initialTask ? (
          <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
        ) : (
          // always show Create button but disable until required fields are filled
          <button
            className="btn primary"
            type="submit"
            disabled={loading || !(title.trim() && assignee)}
            title={!(title.trim() && assignee) ? 'Fill title and select a user to create' : 'Create'}
            aria-disabled={!(title.trim() && assignee) ? 'true' : 'false'}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        )}
      </div>
    </form>
  )
}
