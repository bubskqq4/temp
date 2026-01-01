'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { RouteGuard } from '@/components/RouteGuard'
import {
    Plus,
    Check,
    Zap,
    Flame,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    MoreHorizontal,
    Trophy,
    RotateCcw,
    Trash2,
    Edit2,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Habit {
    id: string
    title: string
    streak: number
    bestStreak: number
    completedDates: string[] // ISO dates YYYY-MM-DD
    color: string
}

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newTitle, setNewTitle] = useState('')
    const [newColor, setNewColor] = useState('#6366f1')

    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_habits')
        if (saved) {
            setHabits(JSON.parse(saved))
        } else {
            const defaults: Habit[] = [
                { id: '1', title: 'Deep Work (4hrs)', streak: 12, bestStreak: 24, completedDates: [today], color: '#8b5cf6' },
                { id: '2', title: 'Evening Reflection', streak: 5, bestStreak: 5, completedDates: [], color: '#10b981' },
                { id: '3', title: 'Physical Training', streak: 3, bestStreak: 15, completedDates: [today], color: '#ec4899' },
            ]
            setHabits(defaults)
            localStorage.setItem('lifepath_habits', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [today])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_habits', JSON.stringify(habits))
        }
    }, [habits, isLoaded])

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const isCompletedToday = h.completedDates.includes(today)
                let newDates = [...h.completedDates]
                let newStreak = h.streak

                if (isCompletedToday) {
                    newDates = newDates.filter(d => d !== today)
                    newStreak = Math.max(0, newStreak - 1)
                } else {
                    newDates.push(today)
                    newStreak += 1
                }

                return {
                    ...h,
                    completedDates: newDates,
                    streak: newStreak,
                    bestStreak: Math.max(newStreak, h.bestStreak)
                }
            }
            return h
        }))
    }

    const handleDelete = (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id))
    }

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newHabit: Habit = {
            id: Date.now().toString(),
            title: newTitle,
            streak: 0,
            bestStreak: 0,
            completedDates: [],
            color: newColor
        }
        setHabits([newHabit, ...habits])
        setIsAddModalOpen(false)
        setNewTitle('')
    }

    return (
        <RouteGuard featureName="Habit Systems">
            <div className="layout-wrapper">
                <Sidebar />
                <main className="projects-main" style={{ padding: '2rem', overflowY: 'auto' }}>
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                                    <Check size={24} color="#10b981" />
                                </div>
                                <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white' }}>
                                    Habit Systems
                                </h1>
                            </div>
                            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                                Architect your identity through consistent action.
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
                            Forge New Habit
                        </button>
                    </div>

                    <div className="habits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        <AnimatePresence mode="popLayout">
                            {habits.map(habit => {
                                const isDoneToday = habit.completedDates.includes(today)
                                return (
                                    <motion.div
                                        key={habit.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="project-card"
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            padding: '1.5rem',
                                            borderRadius: '24px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        whileHover={{ y: -4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '14px',
                                                    background: habit.color + '15',
                                                    color: habit.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <Zap size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-serif" style={{ fontSize: '1.35rem', color: isDoneToday ? '#71717a' : 'white', transition: 'all 0.3s' }}>
                                                        {habit.title}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <Flame size={14} color="#f97316" /> {habit.streak} day streak
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                            <Trophy size={14} color="#eab308" /> Best: {habit.bestStreak}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleHabit(habit.id)}
                                                style={{
                                                    width: '56px',
                                                    height: '56px',
                                                    borderRadius: '50%',
                                                    background: isDoneToday ? habit.color : 'rgba(255,255,255,0.03)',
                                                    border: `2px solid ${isDoneToday ? habit.color : 'rgba(255,255,255,0.05)'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: isDoneToday ? 'black' : habit.color,
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    cursor: 'pointer',
                                                    boxShadow: isDoneToday ? `0 0 30px ${habit.color}40` : 'none'
                                                }}
                                            >
                                                <Check size={28} strokeWidth={3} style={{ opacity: isDoneToday ? 1 : 0.2, transform: isDoneToday ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.4s' }} />
                                            </button>
                                        </div>

                                        {/* 7-Day Heatmap */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                            {Array.from({ length: 7 }).map((_, i) => {
                                                const d = new Date()
                                                d.setDate(d.getDate() - (6 - i))
                                                const dateStr = d.toISOString().split('T')[0]
                                                const completed = habit.completedDates.includes(dateStr)
                                                const isToday = dateStr === today

                                                return (
                                                    <div key={i} style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.7rem', color: isToday ? 'white' : '#52525b', marginBottom: '0.5rem', fontWeight: isToday ? 800 : 400 }}>
                                                            {d.toLocaleDateString(undefined, { weekday: 'short' })[0]}
                                                        </div>
                                                        <div style={{
                                                            aspectRatio: '1',
                                                            borderRadius: '8px',
                                                            background: completed ? habit.color : 'rgba(255,255,255,0.03)',
                                                            border: isToday ? `1px solid ${habit.color}40` : '1px solid transparent',
                                                            transition: 'all 0.3s',
                                                            boxShadow: (completed && isToday) ? `0 0 10px ${habit.color}40` : 'none'
                                                        }} />
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', opacity: 0.3 }} className="habit-actions-footer">
                                            <button onClick={() => handleDelete(habit.id)} className="icon-btn-mini"><Trash2 size={14} /></button>
                                            <button className="icon-btn-mini"><Edit2 size={14} /></button>
                                            <button className="icon-btn-mini"><MoreHorizontal size={14} /></button>
                                        </div>

                                        {/* Achievement Progress Bar (Example) */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ width: `${Math.min(100, (habit.streak / (habit.bestStreak || 1)) * 100)}%`, height: '100%', background: habit.color, opacity: 0.5 }} />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Add Habit Modal */}
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
                                        maxWidth: '550px',
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
                                                background: 'rgba(249, 115, 22, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Flame size={28} color="#f97316" />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Forge Habit</h2>
                                                <p style={{ color: '#71717a' }}>Standardize excellence daily.</p>
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
                                        <div className="field-section" style={{ marginBottom: '2.5rem' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>HABIT NAME</label>
                                            <input
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
                                                placeholder="e.g. 5 AM Wake up"
                                                value={newTitle}
                                                onChange={e => setNewTitle(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <div className="field-section" style={{ marginBottom: '3rem' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'block' }}>VISUAL IDENTITY</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
                                                {['#8b5cf6', '#10b981', '#ec4899', '#f59e0b', '#3b82f6', '#ef4444'].map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => setNewColor(c)}
                                                        style={{
                                                            width: '100%',
                                                            aspectRatio: '1',
                                                            borderRadius: '16px',
                                                            background: c,
                                                            border: newColor === c ? '4px solid white' : 'none',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            transform: newColor === c ? 'scale(1.1)' : 'scale(1)'
                                                        }}
                                                    />
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
                                                    background: 'white',
                                                    border: 'none',
                                                    color: 'black',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                Forge Habit
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <style jsx global>{`
                        .project-card:hover .habit-actions-footer {
                            opacity: 1 !important;
                        }

                        .icon-btn-mini {
                            background: none;
                            border: none;
                            color: #52525b;
                            cursor: pointer;
                            padding: 0.25rem;
                            transition: all 0.2s;
                        }

                        .icon-btn-mini:hover {
                            color: white;
                        }
                    `}</style>
                </main>
            </div>
        </RouteGuard>
    )
}
