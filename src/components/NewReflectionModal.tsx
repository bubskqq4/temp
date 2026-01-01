'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, PenTool } from 'lucide-react'

interface NewReflectionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (reflection: any) => void
}

export const NewReflectionModal = ({ isOpen, onClose, onAdd }: NewReflectionModalProps) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            title,
            content,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })

        // Reset
        setTitle('')
        setContent('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '640px', padding: '2.5rem' }}
                >
                    <header className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                            <PenTool size={24} />
                        </div>
                        <div>
                            <h2 className="modal-title font-serif" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>New Reflection</h2>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Capture your thoughts, ideas, and insights about this project.</p>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="task-form-body">
                        <div className="status-pills-row" style={{ marginBottom: '2rem' }}>
                            <div className="form-label">
                                <span>TITLE</span>
                            </div>
                            <input
                                autoFocus
                                className="project-main-input"
                                placeholder="Give your reflection a title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px' }}
                            />
                        </div>

                        <div className="status-pills-row">
                            <div className="form-label">
                                <span>REFLECTION</span>
                            </div>
                            <textarea
                                className="project-textarea"
                                placeholder="Write your thoughts here... What did you learn? What challenges did you face? What are you proud of?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ height: '280px', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', fontSize: '1.05rem', lineHeight: '1.6', fontStyle: 'italic' }}
                            />
                        </div>
                    </form>

                    <footer className="modal-footer" style={{ borderTop: 'none', paddingTop: '3rem' }}>
                        <div />
                        <div className="footer-btns">
                            <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                            <button
                                type="submit"
                                className="submit-task-btn"
                                onClick={handleSubmit}
                                style={{
                                    minWidth: '180px',
                                    height: '50px',
                                    background: '#71717a',
                                    color: 'white',
                                    fontWeight: '600',
                                    borderRadius: '10px'
                                }}
                            >
                                Save Reflection
                            </button>
                        </div>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
