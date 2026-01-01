'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Flag, ChevronDown, Plus, ListTodo, Sparkles, Zap, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarPicker } from './CalendarPicker'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (title: string, category: string, dueDate?: Date) => void
    type?: 'task' | 'spark'
}

export const AddTaskModal = ({ isOpen, onClose, onAdd, type = 'task' }: AddTaskModalProps) => {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(type === 'task' ? 'Personal' : 'High Energy')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isUrgent, setIsUrgent] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showCategoryMenu, setShowCategoryMenu] = useState(false)

    const categoryRef = useRef<HTMLDivElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryMenu(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onAdd(title.trim(), category, selectedDate)
            setTitle('')
            setIsUrgent(false)
            setSelectedDate(new Date())
            onClose()
        }
    }


    const formatDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.getMonth()]} ${date.getDate()}`
    }

    const categories = ['Enterprise', 'Personal', 'Family', 'Business']

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div key="add-task-modal-overlay" className="modal-overlay" onClick={onClose}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            drag
                            dragMomentum={false}
                            whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                            className="modal-content"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowCalendar(false)
                                setShowCategoryMenu(false)
                            }}
                        >
                            <header className="modal-header">
                                <button className="close-btn" onClick={onClose}>
                                    <X size={20} />
                                </button>
                                <h2 className="modal-title font-serif">
                                    {type === 'spark' ? 'Capture a spark.' : 'Create a task.'}
                                </h2>
                                <p className="modal-subtitle">
                                    {type === 'spark'
                                        ? 'Your Inbox is ready for your next breakthrough.'
                                        : 'Your cockpit is ready for your next action.'}
                                </p>
                            </header>

                            <form onSubmit={handleSubmit} className="task-form-body">
                                <div className="form-label">
                                    {type === 'spark' ? <Sparkles size={14} /> : <ListTodo size={14} />}
                                    <span>{type === 'spark' ? 'CAPTURE' : 'TASK'}</span>
                                </div>

                                <textarea
                                    autoFocus
                                    placeholder="What's on your mind?"
                                    className="task-textarea"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.metaKey) {
                                            handleSubmit(e)
                                        }
                                    }}
                                />

                                <div className="form-row">
                                    {type === 'task' ? (
                                        <>
                                            <div className="relative" ref={calendarRef}>
                                                <div className={cn("pill-btn", showCalendar && "active")} onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowCalendar(!showCalendar)
                                                    setShowCategoryMenu(false)
                                                }}>
                                                    <Calendar size={14} />
                                                    <span>{formatDate(selectedDate)}</span>
                                                </div>
                                                <AnimatePresence>
                                                    {showCalendar && (
                                                        <motion.div
                                                            key="calendar-popover"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                        >
                                                            <CalendarPicker
                                                                selectedDate={selectedDate}
                                                                onSelect={(d) => {
                                                                    setSelectedDate(d)
                                                                    setShowCalendar(false)
                                                                }}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <button
                                                type="button"
                                                className={cn("pill-btn", isUrgent && "active urgent-pill")}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setIsUrgent(!isUrgent)
                                                }}
                                            >
                                                <Flag size={14} className={cn(isUrgent && "fill-current text-red-500")} />
                                                {isUrgent && <span style={{ marginLeft: '4px', color: '#ef4444' }}>Urgent</span>}
                                            </button>
                                            <div className="relative" ref={categoryRef}>
                                                <div className={cn("pill-btn", showCategoryMenu && "active")} onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowCategoryMenu(!showCategoryMenu)
                                                    setShowCalendar(false)
                                                }}>
                                                    <span>{category}</span>
                                                    <ChevronDown size={14} />
                                                </div>
                                                <AnimatePresence>
                                                    {showCategoryMenu && (
                                                        <motion.div
                                                            key="category-dropdown"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="inbox-dropdown"
                                                            style={{ top: '45px', left: '0', right: 'auto', width: '180px' }}
                                                        >
                                                            {categories.map(cat => (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    className="dropdown-item"
                                                                    onClick={() => {
                                                                        setCategory(cat)
                                                                        setShowCategoryMenu(false)
                                                                    }}
                                                                >
                                                                    {cat}
                                                                </button>
                                                            ))}
                                                            <div className="dropdown-divider" />
                                                            <button type="button" className="dropdown-item" style={{ color: '#a1a1aa' }}>
                                                                <Plus size={12} style={{ marginRight: '8px' }} />
                                                                Add New...
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className={cn("pill-btn", category === 'High Energy' && "active")}
                                                onClick={() => setCategory('High Energy')}
                                            >
                                                <Zap size={14} />
                                                <span>High Energy</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={cn("pill-btn", category === 'Low Energy' && "active")}
                                                onClick={() => setCategory('Low Energy')}
                                            >
                                                <Moon size={14} />
                                                <span>Low Energy</span>
                                            </button>
                                        </>
                                    )}
                                </div>

                                {type === 'task' && (
                                    <button type="button" className="add-details-btn">
                                        <Plus size={14} />
                                        <span>Add Details</span>
                                    </button>
                                )}
                            </form>

                            <footer className="modal-footer">
                                <div className="shortcut-hint">
                                    ⌘ + Enter
                                </div>
                                <div className="footer-btns">
                                    <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                                    <button type="submit" className="submit-task-btn" onClick={handleSubmit}>
                                        {type === 'spark' ? 'Save to Inbox' : 'Add Task'}
                                    </button>
                                </div>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style jsx>{`
                .urgent-pill.active {
                    background: rgba(239, 68, 68, 0.1) !important;
                    border-color: rgba(239, 68, 68, 0.2) !important;
                }
                .text-red-500 {
                    color: #ef4444;
                }
                .fill-current {
                    fill: currentColor;
                }
            `}</style>
        </>
    )
}
