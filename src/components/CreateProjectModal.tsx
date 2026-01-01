'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, ChevronDown, ListTodo, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

const COVER_COLORS = [
    '#f5f5f4', // Beige
    '#dcfce7', // Light green
    '#dbeafe', // Light blue
    '#fef2f2', // Light red
    '#7c2d12', // Dark orange/brown
    '#44403c', // Dark gray
    '#d1d5db', // Silver
    '#27272a', // Zinc
]

const CalendarPicker = ({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (date: Date) => void }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))

    const days = []
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth())
    const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth())

    // Prev month padding
    const prevMonthDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1)
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, current: false })
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, current: true })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, current: false })
    }

    return (
        <div className="calendar-popover" onClick={e => e.stopPropagation()} style={{ left: '0', top: '50px' }}>
            <div className="calendar-header-picker">
                <button type="button" className="nav-arrow" onClick={prevMonth}>
                    <ChevronLeft size={16} />
                </button>
                <span className="calendar-month">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                <button type="button" className="nav-arrow" onClick={nextMonth}>
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="calendar-grid">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="day-name">{d}</div>
                ))}
                {days.map((d, i) => {
                    const isSelected = d.current &&
                        d.day === selectedDate.getDate() &&
                        viewDate.getMonth() === selectedDate.getMonth() &&
                        viewDate.getFullYear() === selectedDate.getFullYear()

                    return (
                        <div
                            key={i}
                            className={cn(
                                "calendar-day",
                                !d.current && "muted",
                                isSelected && "active"
                            )}
                            onClick={() => d.current && onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), d.day))}
                        >
                            {d.day}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const CreateProjectModal = ({ isOpen, onClose, onCreate }: CreateProjectModalProps) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('Planning')
    const [client, setClient] = useState('No Client')
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showStatusMenu, setShowStatusMenu] = useState(false)
    const [showClientMenu, setShowClientMenu] = useState(false)
    const [coverColor, setCoverColor] = useState(COVER_COLORS[0])

    const statusRef = useRef<HTMLDivElement>(null)
    const clientRef = useRef<HTMLDivElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setShowStatusMenu(false)
            }
            if (clientRef.current && !clientRef.current.contains(event.target as Node)) {
                setShowClientMenu(false)
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

    // Client options state and localStorage loading
    const [clientOptions, setClientOptions] = useState<string[]>(['No Client', 'Enterprise', 'Self', 'Internal'])

    // Load clients from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('lifepath_clients')
        if (saved) {
            try {
                const clients = JSON.parse(saved)
                const clientNames = clients.map((c: any) => c.name)
                setClientOptions(['No Client', 'Enterprise', 'Self', 'Internal', ...clientNames])
            } catch (e) {
                console.error('Failed to load clients', e)
            }
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        const formatDate = (date: Date | null) => {
            if (!date) return ''
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        }

        onCreate({
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            status,
            client,
            dueDate: formatDate(selectedDate),
            coverColor,
            progress: 0,
        })

        // Reset and close
        setTitle('')
        setDescription('')
        setStatus('Planning')
        setClient('No Client')
        setSelectedDate(null)
        setCoverColor(COVER_COLORS[0])
        onClose()
    }

    if (!isOpen) return null

    const formatDateShort = (date: Date | null) => {
        if (!date) return 'Pick a date'
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }


    const statusOptions = ['Planning', 'Active', 'On Hold', 'Completed']


    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
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
                        setShowStatusMenu(false)
                        setShowClientMenu(false)
                    }}
                    style={{ maxWidth: '640px' }} // Increased width for better grid layout
                >
                    <header className="modal-header" style={{ paddingBottom: '1rem' }}>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <h2 className="modal-title font-serif" style={{ fontSize: '2.5rem' }}>Start something new.</h2>
                    </header>

                    <form onSubmit={handleSubmit} className="task-form-body">
                        <div className="project-title-input-container">
                            <input
                                autoFocus
                                className="project-main-input"
                                placeholder="Enter project title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="edit-modal-grid" style={{ marginTop: '2rem' }}>
                            <div className="status-pills-row">
                                <div className="form-label">
                                    <FileText size={14} />
                                    <span>DESCRIPTION</span>
                                </div>
                                <textarea
                                    className="project-textarea"
                                    placeholder="Add a brief description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <div className="right-col-fields" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="status-pills-row relative" ref={statusRef}>
                                    <div className="form-label">
                                        <ListTodo size={14} />
                                        <span>STATUS</span>
                                    </div>
                                    <div
                                        className={cn("pill-btn", showStatusMenu && "active")}
                                        style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowStatusMenu(!showStatusMenu)
                                            setShowClientMenu(false)
                                            setShowCalendar(false)
                                        }}
                                    >
                                        <span>{status}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <AnimatePresence>
                                        {showStatusMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="inbox-dropdown"
                                                style={{ top: '85px', left: '0', width: '100%', zIndex: 100 }}
                                            >
                                                {statusOptions.map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setStatus(opt)
                                                            setShowStatusMenu(false)
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="status-pills-row relative" ref={clientRef}>
                                    <div className="form-label">
                                        <User size={14} />
                                        <span>CLIENT</span>
                                    </div>
                                    <div
                                        className={cn("pill-btn", showClientMenu && "active")}
                                        style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowClientMenu(!showClientMenu)
                                            setShowStatusMenu(false)
                                            setShowCalendar(false)
                                        }}
                                    >
                                        <span>{client}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <AnimatePresence>
                                        {showClientMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="inbox-dropdown"
                                                style={{ top: '85px', left: '0', width: '100%', zIndex: 100 }}
                                            >
                                                {clientOptions.map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setClient(opt)
                                                            setShowClientMenu(false)
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div className="edit-modal-grid" style={{ marginTop: '2rem' }}>
                            <div className="status-pills-row relative" ref={calendarRef}>
                                <div className="form-label">
                                    <Calendar size={14} />
                                    <span>DUE DATE</span>
                                </div>
                                <div
                                    className={cn("pill-btn", showCalendar && "active")}
                                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '12px' }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowCalendar(!showCalendar)
                                        setShowStatusMenu(false)
                                        setShowClientMenu(false)
                                    }}
                                >
                                    <Calendar size={14} className="text-muted" />
                                    <span style={{ color: selectedDate ? 'white' : 'var(--muted)', fontWeight: '600' }}>
                                        {formatDateShort(selectedDate)}
                                    </span>
                                </div>
                                <AnimatePresence>
                                    {showCalendar && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                        >
                                            <CalendarPicker
                                                selectedDate={selectedDate || new Date()}
                                                onSelect={(d) => {
                                                    setSelectedDate(d)
                                                    setShowCalendar(false)
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="status-pills-row">
                                <div className="form-label">
                                    <span>COVER COLOR</span>
                                </div>
                                <div className="color-picker-grid" style={{ marginTop: '0.25rem' }}>
                                    {COVER_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={cn("color-circle", coverColor === color && "active")}
                                            style={{ backgroundColor: color, width: '30px', height: '30px' }}
                                            onClick={() => setCoverColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>

                    <footer className="modal-footer" style={{ borderTop: 'none', paddingTop: '3rem', paddingBottom: '2.5rem' }}>
                        <div />
                        <div className="footer-btns">
                            <button type="button" className="cancel-modal-btn" style={{ fontSize: '1rem' }} onClick={onClose}>Cancel</button>
                            <button
                                type="submit"
                                className="submit-task-btn"
                                onClick={handleSubmit}
                                style={{
                                    minWidth: '200px',
                                    height: '54px',
                                    background: 'white',
                                    color: 'black',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    borderRadius: '12px'
                                }}
                            >
                                Create Project
                            </button>
                        </div>
                    </footer>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (project: any) => void
}
