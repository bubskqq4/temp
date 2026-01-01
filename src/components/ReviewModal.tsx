'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Inbox, Sparkles, CheckCircle2, ChevronRight, ArrowRight, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface Task {
    id: string
    title: string
    dueDate?: string
}

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
}

export const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
    const [step, setStep] = useState(1)
    const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([])
    const [inboxCount, setInboxCount] = useState(0)
    const [reflection, setReflection] = useState('')
    const [previousWins, setPreviousWins] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setStep(1)
            loadData()
        }
    }, [isOpen])

    const loadData = () => {
        console.log('[ReviewModal] Loading data for review...')

        // Load Tasks
        try {
            const savedTasks = localStorage.getItem('lifepath_tasks')
            if (savedTasks) {
                const tasksObj = JSON.parse(savedTasks)
                const todayTasks = tasksObj.schedule || []
                console.log('[ReviewModal] Loaded tasks:', todayTasks.length)
                setIncompleteTasks(todayTasks)
            } else {
                console.log('[ReviewModal] No saved tasks found')
            }
        } catch (e) {
            console.error('[ReviewModal] Failed to parse tasks:', e)
        }

        // Load Inbox
        try {
            const savedSparks = localStorage.getItem('lifepath_sparks')
            if (savedSparks) {
                const sparks = JSON.parse(savedSparks)
                const unconverted = sparks.filter((s: any) => !s.converted).length
                console.log('[ReviewModal] Loaded inbox count:', unconverted)
                setInboxCount(unconverted)
            } else {
                console.log('[ReviewModal] No saved inbox items found')
            }
        } catch (e) {
            console.error('[ReviewModal] Failed to parse sparks:', e)
        }

        // Load Previous Wins
        try {
            const savedReflections = localStorage.getItem('lifepath_reflections')
            if (savedReflections) {
                const refs = JSON.parse(savedReflections)
                const wins = refs.filter((r: any) => r.type === 'big_win').reverse()
                console.log('[ReviewModal] Loaded previous wins:', wins.length)
                setPreviousWins(wins)
            } else {
                console.log('[ReviewModal] No saved reflections found')
            }
        } catch (e) {
            console.error('[ReviewModal] Failed to parse reflections:', e)
        }
    }

    const handleMoveToTomorrow = () => {
        const savedTasks = localStorage.getItem('lifepath_tasks')
        if (savedTasks) {
            try {
                const tasksObj = JSON.parse(savedTasks)
                const todayTasks = tasksObj.schedule || []

                // Update their due dates
                const updatedTasks = todayTasks.map((t: Task) => ({
                    ...t,
                    dueDate: 'Tomorrow'
                }))

                // In a real app we might move them to a different list, 
                // but here we'll just update the due date label and keep them in schedule for now
                // Or maybe move them to the end of the list?
                tasksObj.schedule = updatedTasks
                localStorage.setItem('lifepath_tasks', JSON.stringify(tasksObj))
                window.dispatchEvent(new Event('lifepath-task-update'))
                setIncompleteTasks([]) // Clear local state for this step
            } catch (e) {
                console.error("Failed to update tasks", e)
            }
        }
        setStep(2)
    }

    const handleSaveReflection = () => {
        if (!reflection.trim()) {
            setStep(4)
            return
        }

        setIsSaving(true)
        console.log('[ReviewModal] Saving reflection...')
        try {
            const savedReflections = localStorage.getItem('lifepath_reflections') || '[]'
            const reflections = JSON.parse(savedReflections)
            const newReflection = {
                id: Date.now().toString(),
                bookId: 'default',
                title: 'Big Win',
                content: reflection,
                type: 'big_win',
                date: new Date().toISOString()
            }
            reflections.push(newReflection)
            localStorage.setItem('lifepath_reflections', JSON.stringify(reflections))
            window.dispatchEvent(new Event('lifepath-reflection-update'))
            console.log('[ReviewModal] Saved reflection successfully, total reflections:', reflections.length)
        } catch (e) {
            console.error('[ReviewModal] Failed to save reflection:', e)
        }

        setTimeout(() => {
            setIsSaving(false)
            setStep(4)
        }, 800)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="review-modal-overlay" onClick={onClose} style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="review-modal-content"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: '100%',
                        maxWidth: '680px',
                        background: '#1c1917',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        color: '#d6d3d1'
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '2.5rem 2.5rem 1.5rem', position: 'relative' }}>
                        <button
                            onClick={onClose}
                            style={{ position: 'absolute', top: '2rem', right: '2rem', color: '#57534e', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#d6d3d1'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#57534e'}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'rgba(214, 211, 209, 0.03)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#d6d3d1'
                            }}>
                                {step === 1 && <Calendar size={28} strokeWidth={1.5} />}
                                {step === 2 && <Inbox size={28} strokeWidth={1.5} />}
                                {step === 3 && <Sparkles size={28} strokeWidth={1.5} />}
                                {step === 4 && <CheckCircle2 size={48} color="#22c55e" strokeWidth={1.5} />}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 500, fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '0.25rem' }}>
                                    {step === 1 && "End of day review."}
                                    {step === 2 && "Inbox zero check."}
                                    {step === 3 && "Daily reflection."}
                                    {step === 4 && "All clear! ✨"}
                                </h2>
                                <p style={{ color: '#71717a', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    Step {step} of 4
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '0 2.5rem 2.5rem' }}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <p style={{ fontSize: '1.1rem', color: '#a8a29e', marginBottom: '2rem' }}>Today's Incomplete Tasks</p>

                                    <div style={{
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }} className="custom-scrollbar">
                                        {incompleteTasks.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {incompleteTasks.map((task) => (
                                                    <div key={task.id} style={{
                                                        padding: '1rem 1.25rem',
                                                        background: '#292524',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        fontSize: '1rem',
                                                        color: '#e7e5e4'
                                                    }}>
                                                        {task.title}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#57534e' }}>
                                                No incomplete tasks for today!
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#78716c', fontStyle: 'italic', marginBottom: '2.5rem' }}>Move these tasks to tomorrow?</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <button
                                            onClick={() => setStep(2)}
                                            style={{
                                                padding: '1.1rem',
                                                borderRadius: '50px',
                                                background: '#292524',
                                                color: '#d6d3d1',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#44403c'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#292524'}
                                        >
                                            No, Keep Today
                                        </button>
                                        <button
                                            onClick={handleMoveToTomorrow}
                                            style={{
                                                padding: '1.1rem',
                                                borderRadius: '50px',
                                                background: '#e7e5e4',
                                                color: '#1c1917',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                                            onMouseOut={(e) => e.currentTarget.style.background = '#e7e5e4'}
                                        >
                                            Yes, Move to Tomorrow <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ textAlign: 'center', padding: '1rem 0' }}
                                >
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: 'rgba(120, 113, 108, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 2rem',
                                        border: '4px solid rgba(120, 113, 108, 0.05)'
                                    }}>
                                        <span style={{ fontSize: '3rem', fontWeight: 600, color: '#e7e5e4' }}>{inboxCount}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>{inboxCount} items in your inbox</h3>
                                    <p style={{ color: '#a8a29e', fontStyle: 'italic', marginBottom: '2.5rem' }}>Consider processing these before ending your day.</p>

                                    <div style={{ marginBottom: '3rem' }}>
                                        <Link href="/inbox" onClick={onClose} style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '12px',
                                            background: '#292524',
                                            color: '#e7e5e4',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            transition: 'all 0.2s'
                                        }}>
                                            Go to Inbox to Sort
                                        </Link>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => setStep(1)}
                                            style={{
                                                padding: '0.9rem 2rem',
                                                borderRadius: '12px',
                                                background: '#292524',
                                                color: '#a8a29e',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            style={{
                                                flex: 1,
                                                padding: '1.1rem',
                                                borderRadius: '50px',
                                                background: '#e7e5e4',
                                                color: '#1c1917',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            Continue <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <p style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600, marginBottom: '1.5rem' }}>What was your biggest win today?</p>

                                    <textarea
                                        autoFocus
                                        placeholder="Reflect on your accomplishments, learnings, or moments of gratitude..."
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '160px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            color: '#e7e5e4',
                                            fontSize: '1.1rem',
                                            lineHeight: '1.6',
                                            outline: 'none',
                                            marginBottom: '1rem',
                                            resize: 'none'
                                        }}
                                    />

                                    {previousWins.length > 0 && (
                                        <div style={{ marginBottom: '2rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: '#57534e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Big Wins Gallery</p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                overflowX: 'auto',
                                                paddingBottom: '0.5rem'
                                            }} className="custom-scrollbar">
                                                {previousWins.slice(0, 5).map((win) => (
                                                    <div key={win.id} style={{
                                                        minWidth: '200px',
                                                        maxWidth: '200px',
                                                        padding: '1.25rem',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '16px',
                                                        fontSize: '0.9rem',
                                                        color: '#a8a29e',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        "{win.content.length > 80 ? win.content.substring(0, 80) + '...' : win.content}"
                                                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#57534e', fontStyle: 'normal' }}>
                                                            {new Date(win.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p style={{ fontSize: '0.85rem', color: '#78716c', fontStyle: 'italic', marginBottom: '2rem' }}>This will be saved to your journal for future reflection.</p>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => setStep(2)}
                                            style={{
                                                padding: '0.9rem 1.5rem',
                                                borderRadius: '12px',
                                                background: '#292524',
                                                color: '#a8a29e',
                                                fontWeight: 600,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep(4)}
                                            style={{
                                                padding: '0.9rem 1.5rem',
                                                borderRadius: '12px',
                                                background: '#292524',
                                                color: '#a8a29e',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            Skip
                                        </button>
                                        <button
                                            onClick={handleSaveReflection}
                                            disabled={isSaving}
                                            style={{
                                                flex: 1,
                                                padding: '1.1rem',
                                                borderRadius: '50px',
                                                background: '#e7e5e4',
                                                color: '#1c1917',
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                opacity: isSaving ? 0.7 : 1
                                            }}
                                        >
                                            {isSaving ? "Saving..." : "Save & Continue"} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ textAlign: 'center', padding: '2rem 0 1rem' }}
                                >
                                    <p style={{ fontSize: '1.25rem', color: '#a8a29e', marginBottom: '0.5rem' }}>You've completed your daily shutdown routine.</p>
                                    <p style={{ color: '#57534e', fontStyle: 'italic', marginBottom: '3rem' }}>Time to close the laptop and recharge.</p>

                                    <button
                                        onClick={onClose}
                                        style={{
                                            minWidth: '160px',
                                            padding: '1.1rem',
                                            borderRadius: '50px',
                                            background: '#e7e5e4',
                                            color: '#1c1917',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Done
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
