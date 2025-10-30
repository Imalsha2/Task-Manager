import React from 'react'

export default function ConfirmDialog({ open, title = 'Confirm', message = 'Are you sure?', onConfirm, onCancel }: {
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} aria-modal="true" role="dialog">
        <h3 style={{marginTop:0}}>{title}</h3>
        <p style={{color:'#334155'}}>{message}</p>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button className="btn" onClick={onCancel}>No</button>
          <button className="btn primary" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  )
}
