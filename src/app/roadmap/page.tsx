'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { RouteGuard } from '@/components/RouteGuard'
import {
    Plus,
    Calendar,
    Timer,
    Flag,
    CheckCircle2,
    Circle,
    ChevronRight,
    X,
    MoreHorizontal,
    Rocket,
    Clock,
    Sparkles,
    Trash2,
    Edit2,
    ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Milestone {
    id: string
    title: string
    date: string
    status: 'Upcoming' | 'In Progress' | 'Completed'
    priority: 'Low' | 'Medium' | 'High'
    quarter: string
}

export default function RoadmapPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newTitle, setNewTitle] = useState('')
    const [newDate, setNewDate] = useState('')
    const [newQuarter, setNewQuarter] = useState('Q1 2026')
    const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_roadmap')
        if (saved) {
            setMilestones(JSON.parse(saved))
        } else {
            const defaults: Milestone[] = [
                { id: '1', title: 'Beta Launch', date: 'Jan 15, 2026', status: 'Upcoming', priority: 'High', quarter: 'Q1 2026' },
                { id: '2', title: 'iOS App Submission', date: 'Feb 10, 2026', status: 'In Progress', priority: 'High', quarter: 'Q1 2026' },
                { id: '3', title: 'Seed Round Closed', date: 'Dec 20, 2025', status: 'Completed', priority: 'High', quarter: 'Q4 2025' },
                { id: '4', title: 'Series A Prep', date: 'Jun 30, 2026', status: 'Upcoming', priority: 'Medium', quarter: 'Q2 2026' },
            ]
            setMilestones(defaults)
            localStorage.setItem('lifepath_roadmap', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_roadmap', JSON.stringify(milestones))
        }
    }, [milestones, isLoaded])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newEntry: Milestone = {
            id: Date.now().toString(),
            title: newTitle,
            date: newDate || 'TBD',
            status: 'Upcoming',
            priority: newPriority,
            quarter: newQuarter
        }
        setMilestones([newEntry, ...milestones])
        setIsAddModalOpen(false)
        setNewTitle('')
        setNewDate('')
        setNewPriority('Medium')
    }

    const handleDelete = (id: string) => {
        setMilestones(prev => prev.filter(m => m.id !== id))
    }

    const toggleStatus = (id: string) => {
        setMilestones(prev => prev.map(m => {
            if (m.id === id) {
                const statuses: Milestone['status'][] = ['Upcoming', 'In Progress', 'Completed']
                const nextIndex = (statuses.indexOf(m.status) + 1) % statuses.length
                return { ...m, status: statuses[nextIndex] }
            }
            return m
        }))
    }

    const quarters = Array.from(new Set(milestones.map(m => m.quarter))).sort()

    return (
        <RouteGuard featureName="Roadmap">
            <div className="layout-wrapper">
                <Sidebar />
                <main className="projects-main" style={{ padding: '2rem', overflowY: 'auto' }}>
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                                    <Timer size={24} color="#8b5cf6" />
                                </div>
                                <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white' }}>
                                    Identity Roadmap
                                </h1>
                            </div>
                            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                                Phase-based execution of your long-term vision.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="submit-task-btn"
                            style={{
                                background: 'white',
                                color: 'black',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Plus size={18} />
                            Add Milestone
                        </button>
                    </div>

                    {/* Roadmap Timeline */}
                    <div className="roadmap-timeline" style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                        {quarters.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem', color: '#52525b' }}>
                                <Rocket size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                                <p>No milestones yet. Start charting your course.</p>
                            </div>
                        ) : quarters.map((q, idx) => (
                            <section key={q} style={{ marginBottom: '4rem' }}>
                                {/* Quarter Header */}
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '-2.5rem',
                                        width: '1rem',
                                        height: '1px',
                                        background: 'rgba(255,255,255,0.2)'
                                    }} />
                                    <h2 style={{
                                        fontSize: '0.8rem',
                                        fontWeight: 800,
                                        color: '#3b82f6',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px'
                                    }}>
                                        {q}
                                    </h2>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <AnimatePresence mode="popLayout">
                                        {milestones.filter(m => m.quarter === q).map(m => (
                                            <motion.div
                                                key={m.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="project-card"
                                                style={{
                                                    background: 'rgba(255,255,255,0.02)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    padding: '1.5rem 2rem',
                                                    borderRadius: '20px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                                whileHover={{ y: -2, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                    {/* Status Toggle Icon */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleStatus(m.id); }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        {m.status === 'Completed' ? (
                                                            <CheckCircle2 size={24} color="#10b981" />
                                                        ) : m.status === 'In Progress' ? (
                                                            <Clock size={24} color="#3b82f6" className="animate-pulse" />
                                                        ) : (
                                                            <Circle size={24} color="#3f3f46" />
                                                        )}
                                                    </button>

                                                    <div>
                                                        <h3 className="font-serif" style={{
                                                            fontSize: '1.25rem',
                                                            color: m.status === 'Completed' ? '#52525b' : 'white',
                                                            textDecoration: m.status === 'Completed' ? 'line-through' : 'none',
                                                            marginBottom: '0.25rem'
                                                        }}>
                                                            {m.title}
                                                        </h3>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                            <span style={{ fontSize: '0.8rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                <Calendar size={14} /> {m.date}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '0.7rem',
                                                                fontWeight: 700,
                                                                color: m.priority === 'High' ? '#ef4444' : (m.priority === 'Medium' ? '#f59e0b' : '#10b981'),
                                                                background: m.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : (m.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                                                padding: '0.15rem 0.6rem',
                                                                borderRadius: '6px',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em'
                                                            }}>
                                                                {m.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                                                        className="icon-btn-small"
                                                        style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button className="icon-btn-small">
                                                        <Edit2 size={16} />
                                                    </button>
                                                </div>

                                                {/* Left Status Bar */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: '4px',
                                                    background: m.status === 'Completed' ? '#10b981' : (m.status === 'In Progress' ? '#3b82f6' : 'transparent')
                                                }} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Add Milestone Modal */}
                    <AnimatePresence>
                        {isAddModalOpen && (
                            <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                                <motion.div
                                    className="premium-journal-modal"
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        maxWidth: '600px',
                                        background: '#1c1917',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <div className="premium-modal-header" style={{
                                        padding: '2.5rem',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '16px',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Rocket size={28} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Add Milestone</h2>
                                                <p style={{ color: '#71717a' }}>Chart the course for 2026.</p>
                                            </div>
                                        </div>
                                        <button
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                padding: '0.75rem',
                                                borderRadius: '50%',
                                                color: '#71717a',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setIsAddModalOpen(false)}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleAdd} style={{ padding: '2.5rem' }}>
                                        <div className="field-section" style={{ marginBottom: '2rem' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>MILESTONE TITLE</label>
                                            <input
                                                className="premium-title-input"
                                                style={{
                                                    width: '100%',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    fontSize: '2rem',
                                                    color: 'white',
                                                    padding: 0,
                                                    fontFamily: 'inherit',
                                                    outline: 'none'
                                                }}
                                                placeholder="What's next?"
                                                value={newTitle}
                                                onChange={e => setNewTitle(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>TARGET DATE</label>
                                                <input
                                                    style={{
                                                        width: '100%',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '12px',
                                                        padding: '1rem',
                                                        color: 'white',
                                                        outline: 'none'
                                                    }}
                                                    placeholder="e.g. March 12"
                                                    value={newDate}
                                                    onChange={e => setNewDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>QUARTER / YEAR</label>
                                                <input
                                                    style={{
                                                        width: '100%',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '12px',
                                                        padding: '1rem',
                                                        color: 'white',
                                                        outline: 'none'
                                                    }}
                                                    placeholder="e.g. Q2 2026"
                                                    value={newQuarter}
                                                    onChange={e => setNewQuarter(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="field-section" style={{ marginBottom: '3rem' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>PRIORITY LEVEL</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                                {['Low', 'Medium', 'High'].map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setNewPriority(p as any)}
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '12px',
                                                            background: newPriority === p ? (p === 'High' ? '#ef4444' : (p === 'Medium' ? '#f59e0b' : '#10b981')) : 'rgba(255,255,255,0.03)',
                                                            color: newPriority === p ? 'black' : '#71717a',
                                                            border: 'none',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                style={{
                                                    padding: '1rem 2rem',
                                                    borderRadius: '50px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: 'none',
                                                    color: '#d6d3d1',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                style={{
                                                    padding: '1rem 2.5rem',
                                                    borderRadius: '50px',
                                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                                    border: 'none',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                Pin to Roadmap
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <style jsx global>{`
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 0.8; }
                            50% { transform: scale(1.1); opacity: 1; }
                            100% { transform: scale(1); opacity: 0.8; }
                        }
                        .animate-pulse {
                            animation: pulse 2s infinite;
                        }
                        
                        .project-card:hover {
                            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                        }

                        .icon-btn-small {
                            width: 36px;
                            height: 36px;
                            border-radius: 10px;
                            background: rgba(255,255,255,0.03);
                            border: 1px solid rgba(255,255,255,0.05);
                            color: #71717a;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: all 0.2s;
                        }

                        .icon-btn-small:hover {
                            background: rgba(255,255,255,0.08);
                            color: white;
                            transform: translateY(-1px);
                        }
                    `}</style>
                </main>
            </div>
        </RouteGuard>
    )
}
