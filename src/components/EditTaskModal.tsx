'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ListTodo, Calendar, Folder, Zap, Minus, Moon, RotateCcw, Plus, ChevronDown } from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface EditTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (task: any) => void
    taskData: any
}

export const EditTaskModal = ({ isOpen, onClose, onSave, taskData }: EditTaskModalProps) => {
    const [title, setTitle] = useState('')
    const [project, setProject] = useState('Website Redesign')
    const [dueDate, setDueDate] = useState('Dec 29, 2025')
    const [status, setStatus] = useState('Today')
    const [energyLevel, setEnergyLevel] = useState('H')
    const [isRecurring, setIsRecurring] = useState(false)
    const [tags, setTags] = useState('')

    const [showProjectMenu, setShowProjectMenu] = useState(false)
    const [showStatusMenu, setShowStatusMenu] = useState(false)

    const projectRef = useRef<HTMLDivElement>(null)
    const statusRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
                setShowProjectMenu(false)
            }
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setShowStatusMenu(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const projects = ['Website Redesign', 'Marketing', 'App Dev', 'Branding']
    const statuses = ['Today', 'Upcoming', 'Later', 'Completed']

    useEffect(() => {
        if (taskData) {
            setTitle(taskData.title || '')
            // Defaulting others for now as they might not be in taskData
        }
    }, [taskData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...taskData,
            title,
            project,
            dueDate,
            status,
            energyLevel,
            isRecurring,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        })
        onClose()
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <div key="edit-task-modal-overlay" className="modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '480px' }}
                    >
                        <header className="modal-header">
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                            <h2 className="modal-title font-serif">Edit task.</h2>
                            <p className="modal-subtitle">Update task details and context.</p>
                        </header>

                        <form onSubmit={handleSubmit} className="task-form-body">
                            {/* TASK Section */}
                            <div className="form-label">
                                <ListTodo size={14} />
                                <span>TASK</span>
                            </div>
                            <input
                                autoFocus
                                className="edit-task-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            {/* PROJECT and STATUS Grid */}
                            <div className="edit-modal-grid">
                                <div className="status-pills-row relative" ref={projectRef}>
                                    <div className="form-label">
                                        <Folder size={14} />
                                        <span>PROJECT</span>
                                    </div>
                                    <div className="pill-btn" style={{ width: '100%', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowProjectMenu(!showProjectMenu)}>
                                        <span>{project}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <AnimatePresence>
                                        {showProjectMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="inbox-dropdown"
                                                style={{ top: '85px', left: '0', width: '100%', zIndex: 100 }}
                                            >
                                                {projects.map(p => (
                                                    <button key={p} type="button" className="dropdown-item" onClick={() => { setProject(p); setShowProjectMenu(false); }}>{p}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="status-pills-row">
                                    <div className="form-label">
                                        <span>STATUS</span>
                                    </div>
                                    <div className="status-pills">
                                        {['Inbox', 'Today', 'Active', 'Done'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                className={cn("status-pill", status === s && "active")}
                                                onClick={() => setStatus(s)}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* DUE DATE and ENERGY LEVEL Grid */}
                            <div className="edit-modal-grid">
                                <div className="status-pills-row">
                                    <div className="form-label">
                                        <Calendar size={14} />
                                        <span>DUE DATE</span>
                                    </div>
                                    <div className="pill-btn" style={{ width: '100%', borderRadius: '12px' }}>
                                        <span>{dueDate}</span>
                                    </div>
                                </div>

                                <div className="status-pills-row">
                                    <div className="form-label">
                                        <span>ENERGY LEVEL</span>
                                    </div>
                                    <div className="energy-group">
                                        <button
                                            type="button"
                                            className={cn("energy-btn", energyLevel === 'H' && "active high")}
                                            onClick={() => setEnergyLevel('H')}
                                        >
                                            <Zap size={14} fill={energyLevel === 'H' ? 'currentColor' : 'none'} />
                                            <span>H</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={cn("energy-btn", energyLevel === 'N' && "active normal")}
                                            onClick={() => setEnergyLevel('N')}
                                        >
                                            <Minus size={14} />
                                            <span>N</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={cn("energy-btn", energyLevel === 'L' && "active low")}
                                            onClick={() => setEnergyLevel('L')}
                                        >
                                            <Moon size={14} />
                                            <span>L</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* RECURRING Section */}
                            <div className="recurring-row">
                                <div className="recurring-info">
                                    <RotateCcw size={16} />
                                    <span>Recurring</span>
                                </div>
                                <div
                                    className={cn("toggle-switch", isRecurring && "active")}
                                    onClick={() => setIsRecurring(!isRecurring)}
                                >
                                    <div className="toggle-thumb" />
                                </div>
                            </div>

                            {/* TAGS Section */}
                            <div className="tags-input-container">
                                <div className="form-label">
                                    <Plus size={14} />
                                    <span>TAGS</span>
                                </div>
                                <input
                                    className="tags-field"
                                    placeholder="Type a tag and press Enter"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </form>

                        <footer className="modal-footer">
                            <div />
                            <div className="footer-btns">
                                <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                                <button type="submit" className="submit-task-btn" onClick={handleSubmit} style={{ minWidth: '140px' }}>
                                    Save Changes
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
