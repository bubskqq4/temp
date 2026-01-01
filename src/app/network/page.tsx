'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Search,
    MoreHorizontal,
    User,
    Mail,
    Phone,
    Globe,
    Linkedin,
    Calendar as CalendarIcon,
    MessageSquare,
    ChevronRight,
    Filter,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarPicker } from '@/components/CalendarPicker'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface Connection {
    id: string
    name: string
    role: string
    company: string
    status: 'Cold' | 'Warm' | 'Hot' | 'Follow Up'
    lastContact: string
    nextAction: string
    email: string
    tags: string[]
}

export default function NetworkPage() {
    const [connections, setConnections] = useState<Connection[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newName, setNewName] = useState('')
    const [newRole, setNewRole] = useState('')
    const [newCompany, setNewCompany] = useState('')
    const [newStatus, setNewStatus] = useState<'Cold' | 'Warm' | 'Hot' | 'Follow Up'>('Warm')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCalendar, setShowCalendar] = useState(false)

    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_network')
        if (saved) {
            setConnections(JSON.parse(saved))
        } else {
            const defaults: Connection[] = [
                { id: '1', name: 'James Wilson', role: 'Partner', company: 'Sequoia Capital', status: 'Hot', lastContact: '2025-12-28', nextAction: 'Lunch meeting Friday', email: 'james@sequoia.com', tags: ['Investor', 'Tech'] },
                { id: '2', name: 'Sarah Chen', role: 'CTO', company: 'Nova Systems', status: 'Warm', lastContact: '2025-12-24', nextAction: 'Send technical specs', email: 'sarah@nova.io', tags: ['Tech', 'Hiring'] },
                { id: '3', name: 'Michael Ross', role: 'CEO', company: 'Aether Flow', status: 'Follow Up', lastContact: '2025-12-30', nextAction: 'Confirm demo date', email: 'm@aether.com', tags: ['Client', 'Potential'] },
            ]
            setConnections(defaults)
            localStorage.setItem('lifepath_network', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_network', JSON.stringify(connections))
        }
    }, [connections, isLoaded])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newEntry: Connection = {
            id: Date.now().toString(),
            name: newName,
            role: newRole,
            company: newCompany,
            status: newStatus,
            lastContact: selectedDate.toISOString().split('T')[0],
            nextAction: 'Initial outreach',
            email: '',
            tags: []
        }
        setConnections([newEntry, ...connections])
        setIsAddModalOpen(false)
        setNewName('')
        setNewRole('')
        setNewCompany('')
        setSelectedDate(new Date())
    }

    const formatDate = (dateString: string) => {
        if (dateString.includes('ago') || dateString.includes('now') || dateString.includes('Yesterday')) return dateString
        try {
            const date = new Date(dateString)
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
        } catch {
            return dateString
        }
    }

    const filtered = connections.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Hot': return '#ef4444'
            case 'Warm': return '#f59e0b'
            case 'Cold': return '#3b82f6'
            case 'Follow Up': return '#10b981'
            default: return '#71717a'
        }
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Network Hub</h1>
                        <p>Manage your high-stakes connections and ecosystem.</p>

                        <div className="projects-search-bar">
                            <Search size={18} className="projects-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or company..."
                                className="projects-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="projects-top-actions">
                        <button
                            className="submit-task-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add New Contact</span>
                        </button>
                    </div>
                </header>

                <div className="network-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                    {filtered.sort((a, b) => b.lastContact.localeCompare(a.lastContact)).map(contact => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="project-card"
                            style={{ padding: '1.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>{contact.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#71717a' }}>{contact.role} @ {contact.company}</p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    background: getStatusColor(contact.status) + '15',
                                    color: getStatusColor(contact.status),
                                    border: `1px solid ${getStatusColor(contact.status)}20`,
                                    height: 'fit-content'
                                }}>
                                    {contact.status}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <CalendarIcon size={14} className="text-zinc-500" />
                                    <span style={{ color: '#71717a' }}>Last Contact:</span>
                                    <span>{formatDate(contact.lastContact)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <MessageSquare size={14} className="text-zinc-500" />
                                    <span style={{ color: '#71717a' }}>Next Step:</span>
                                    <span>{contact.nextAction}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {contact.tags.map(tag => (
                                    <span key={tag} style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', fontSize: '0.7rem', color: '#a1a1aa' }}>#{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {isAddModalOpen && (
                        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                            <motion.div
                                className="premium-journal-modal"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={e => {
                                    e.stopPropagation()
                                    setShowCalendar(false)
                                }}
                            >
                                <div className="premium-modal-header">
                                    <div className="leaf-icon-container">
                                        <Plus size={24} />
                                    </div>
                                    <div className="header-text">
                                        <h2>Add Connection</h2>
                                        <p>Expand your empire's reach.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                                </div>

                                <form onSubmit={handleAdd} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>FULL NAME</label>
                                        <input
                                            className="premium-title-input"
                                            placeholder="e.g. Elena Vance"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="field-section">
                                            <label>ROLE</label>
                                            <input
                                                className="premium-textarea"
                                                placeholder="e.g. Managing Director"
                                                value={newRole}
                                                onChange={e => setNewRole(e.target.value)}
                                                style={{ minHeight: '44px' }}
                                            />
                                        </div>
                                        <div className="field-section">
                                            <label>COMPANY</label>
                                            <input
                                                className="premium-textarea"
                                                placeholder="e.g. Citadel Ventures"
                                                value={newCompany}
                                                onChange={e => setNewCompany(e.target.value)}
                                                style={{ minHeight: '44px' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="field-section">
                                            <label>LAST CONTACT</label>
                                            <div className="relative" ref={calendarRef} style={{ position: 'relative' }}>
                                                <button
                                                    type="button"
                                                    className="premium-textarea"
                                                    style={{ minHeight: '44px', width: '100%', textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setShowCalendar(!showCalendar)
                                                    }}
                                                >
                                                    <CalendarIcon size={16} className="text-zinc-500" />
                                                    <span>{selectedDate.toLocaleDateString()}</span>
                                                </button>
                                                <AnimatePresence>
                                                    {showCalendar && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 5 }}
                                                            style={{ position: 'absolute', zIndex: 50, left: 0 }}
                                                        >
                                                            <CalendarPicker
                                                                selectedDate={selectedDate}
                                                                onSelect={(date) => {
                                                                    setSelectedDate(date)
                                                                    setShowCalendar(false)
                                                                }}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="field-section">
                                            <label>RELATIONSHIP STATUS</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', height: '44px' }}>
                                                {(['Cold', 'Warm', 'Hot', 'Follow Up'] as const).map(s => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setNewStatus(s)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0 0.5rem',
                                                            borderRadius: '8px',
                                                            background: newStatus === s ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                                            border: newStatus === s ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                                            color: newStatus === s ? 'white' : '#71717a',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 600,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {s.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="premium-modal-footer">
                                        <button type="button" className="modal-cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="modal-save-btn">Create Connection</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
