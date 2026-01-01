'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Search,
    Zap,
    DollarSign,
    Briefcase,
    TrendingUp,
    Layers,
    ChevronRight,
    X,
    Filter,
    Shield,
    Users,
    Calendar as CalendarIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarPicker } from '@/components/CalendarPicker'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface Investor {
    id: string
    name: string
    firm: string
    stage: 'Ideation' | 'Outreach' | 'Meeting' | 'Due Diligence' | 'Term Sheet' | 'Closed'
    amount: string
    lastUpdate: string
    sentiment: 'Positive' | 'Neutral' | 'Mixed'
}

export default function VenturePage() {
    const [investors, setInvestors] = useState<Investor[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newName, setNewName] = useState('')
    const [newFirm, setNewFirm] = useState('')
    const [newStage, setNewStage] = useState<Investor['stage']>('Outreach')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCalendar, setShowCalendar] = useState(false)

    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_venture')
        if (saved) {
            setInvestors(JSON.parse(saved))
        } else {
            const defaults: Investor[] = [
                { id: '1', name: 'Alex Rivera', firm: 'Northstar VC', stage: 'Term Sheet', amount: '$1.5M', lastUpdate: '2025-12-28', sentiment: 'Positive' },
                { id: '2', name: 'Leila Smith', firm: 'Founders Fund', stage: 'Meeting', amount: 'TBD', lastUpdate: '2025-12-30', sentiment: 'Mixed' },
                { id: '3', name: 'David Cho', firm: 'Y Combinator', stage: 'Closed', amount: '$500k', lastUpdate: '2025-12-15', sentiment: 'Positive' },
                { id: '4', name: 'Maria Garcia', firm: 'Andreessen Horowitz', stage: 'Due Diligence', amount: '$2M', lastUpdate: '2025-12-29', sentiment: 'Positive' },
            ]
            setInvestors(defaults)
            localStorage.setItem('lifepath_venture', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_venture', JSON.stringify(investors))
        }
    }, [investors, isLoaded])

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
        const newEntry: Investor = {
            id: Date.now().toString(),
            name: newName,
            firm: newFirm,
            stage: newStage,
            amount: 'TBD',
            lastUpdate: selectedDate.toISOString().split('T')[0],
            sentiment: 'Neutral'
        }
        setInvestors([newEntry, ...investors])
        setIsAddModalOpen(false)
        setNewName('')
        setNewFirm('')
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

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Closed': return '#10b981'
            case 'Term Sheet': return '#8b5cf6'
            case 'Due Diligence': return '#f59e0b'
            case 'Meeting': return '#3b82f6'
            default: return '#71717a'
        }
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Venture Command</h1>
                        <p>Track your funding rounds and investor relations.</p>
                    </div>

                    <div className="projects-top-actions">
                        <button
                            className="submit-task-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Add Investor</span>
                        </button>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
                    {['Ideation', 'Outreach', 'Meeting', 'Due Diligence', 'Term Sheet', 'Closed'].map(stage => {
                        const count = investors.filter(i => i.stage === stage).length
                        return (
                            <div key={stage} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.65rem', color: '#52525b', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{stage}</div>
                                <div className="font-serif" style={{ fontSize: '1.5rem' }}>{count}</div>
                            </div>
                        )
                    })}
                </div>

                <div className="investors-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {investors.sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate)).map(investor => (
                        <motion.div
                            key={investor.id}
                            className="project-card"
                            style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Briefcase size={20} className="text-zinc-400" />
                                </div>
                                <div style={{ width: '250px' }}>
                                    <h3 className="font-serif" style={{ fontSize: '1.1rem' }}>{investor.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#71717a' }}>{investor.firm}</p>
                                </div>
                                <div style={{ width: '150px' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        background: getStageColor(investor.stage) + '15',
                                        color: getStageColor(investor.stage),
                                        border: `1px solid ${getStageColor(investor.stage)}20`
                                    }}>
                                        {investor.stage}
                                    </div>
                                </div>
                                <div style={{ width: '150px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#52525b' }}>PROPOSED</div>
                                    <div style={{ fontWeight: 600 }}>{investor.amount}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#52525b' }}>LAST UPDATE</div>
                                    <div style={{ fontSize: '0.85rem' }}>{formatDate(investor.lastUpdate)}</div>
                                </div>
                                <button className="icon-btn-small">
                                    <ChevronRight size={18} />
                                </button>
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
                                        <Zap size={24} color="#8b5cf6" />
                                    </div>
                                    <div className="header-text">
                                        <h2>Track Fundraiser</h2>
                                        <p>Fuel your empire's vision.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                                </div>

                                <form onSubmit={handleAdd} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>INVESTOR NAME</label>
                                        <input
                                            className="premium-title-input"
                                            placeholder="e.g. Marc Andreessen"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="field-section">
                                            <label>FIRM / VENTURE ARMS</label>
                                            <input
                                                className="premium-textarea"
                                                placeholder="e.g. a16z"
                                                value={newFirm}
                                                onChange={e => setNewFirm(e.target.value)}
                                                required
                                                style={{ minHeight: '44px' }}
                                            />
                                        </div>
                                        <div className="field-section">
                                            <label>DATE OF UPDATE</label>
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
                                    </div>
                                    <div className="field-section">
                                        <label>ROUND STAGE</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                            {(['Ideation', 'Outreach', 'Meeting', 'Due Diligence', 'Term Sheet', 'Closed'] as const).map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setNewStage(s)}
                                                    style={{
                                                        padding: '0.75rem 0.5rem',
                                                        borderRadius: '8px',
                                                        background: newStage === s ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: newStage === s ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                                        color: newStage === s ? 'white' : '#71717a',
                                                        fontSize: '0.75rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="premium-modal-footer" style={{ marginTop: '2rem' }}>
                                        <button type="button" className="modal-cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="modal-save-btn">Add to Pipeline</button>
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
