'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

const CalendarPicker = ({ selectedDate, onSelect }: { selectedDate: Date | null, onSelect: (date: Date) => void }) => {
    const baseDate = selectedDate || new Date()
    const [viewDate, setViewDate] = useState(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1))

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

    const prevMonthDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1)
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, current: false })
    }

    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, current: true })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, current: false })
    }

    const formatDateForDisplay = (date: Date) => {
        const d = date.getDate()
        const m = monthNames[date.getMonth()]
        const y = date.getFullYear()
        const suffix = (d: number) => {
            if (d > 3 && d < 21) return 'th'
            switch (d % 10) {
                case 1: return "st"
                case 2: return "nd"
                case 3: return "rd"
                default: return "th"
            }
        }
        return `${m} ${d}${suffix(d)}, ${y}`
    }

    return (
        <div className="calendar-popover" onClick={e => e.stopPropagation()} style={{ left: '0', top: '50px', zIndex: 100 }}>
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
                    const isSelected = d.current && selectedDate &&
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

interface AddClientModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (client: any) => void
}

export const AddClientModal = ({ isOpen, onClose, onAdd }: AddClientModalProps) => {
    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('Lead')
    const [lastContact, setLastContact] = useState<Date | null>(null)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const statusRef = useRef<HTMLDivElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleSubmit = () => {
        if (!name) return
        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            name,
            company,
            email,
            status,
            lastContact: lastContact ? lastContact.toISOString() : new Date().toISOString()
        })
        // Reset
        setName('')
        setCompany('')
        setEmail('')
        setStatus('Lead')
        setLastContact(null)
    }

    const statuses = ['Lead', 'Active', 'Churned', 'Partner']

    const formatDateForDisplay = (date: Date) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        const d = date.getDate()
        const m = monthNames[date.getMonth()]
        const y = date.getFullYear()
        const suffix = (d: number) => {
            if (d > 3 && d < 21) return 'th'
            switch (d % 10) {
                case 1: return "st"
                case 2: return "nd"
                case 3: return "rd"
                default: return "th"
            }
        }
        return `${m} ${d}${suffix(d)}, ${y}`
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="add-client-modal-root">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-overlay"
                        style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.8)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-client-container"
                    >
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={20} />
                        </button>

                        <div className="modal-client-header">
                            <h2 className="modal-client-title">Add a new client.</h2>
                            <p className="modal-client-subtitle">Build your network, one connection at a time.</p>
                        </div>

                        <div className="modal-body">
                            <div className="modal-form-group">
                                <label className="modal-label">Client Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="modal-input"
                                />
                            </div>

                            <div className="modal-form-group">
                                <label className="modal-label">Company</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Acme Corp"
                                    className="modal-input"
                                />
                            </div>

                            <div className="modal-form-group">
                                <label className="modal-label">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="modal-input"
                                />
                            </div>

                            <div className="modal-form-group" ref={statusRef}>
                                <label className="modal-label">Status</label>
                                <button
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    className="modal-select-btn"
                                >
                                    <span>{status}</span>
                                    <ChevronDown size={18} style={{ opacity: 0.5 }} />
                                </button>
                                {isStatusOpen && (
                                    <div className="modal-dropdown-menu">
                                        {statuses.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    setStatus(s)
                                                    setIsStatusOpen(false)
                                                }}
                                                className="modal-dropdown-item"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="modal-form-group" ref={calendarRef}>
                                <label className="modal-label">Last Contact Date</label>
                                <button
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className="modal-select-btn"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Calendar size={18} style={{ opacity: 0.5 }} />
                                        <span>
                                            {lastContact ? formatDateForDisplay(lastContact) : 'Pick a date'}
                                        </span>
                                    </div>
                                </button>
                                {isCalendarOpen && (
                                    <CalendarPicker
                                        selectedDate={lastContact}
                                        onSelect={(date) => {
                                            setLastContact(date)
                                            setIsCalendarOpen(false)
                                        }}
                                    />
                                )}
                            </div>

                            <div className="modal-footer-btns">
                                <button
                                    onClick={onClose}
                                    className="modal-btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="modal-btn-primary"
                                >
                                    Add Client
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
