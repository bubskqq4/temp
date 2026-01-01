'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { RouteGuard } from '@/components/RouteGuard'
import {
    Plus,
    Zap,
    TrendingUp,
    Target,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    X,
    MoreHorizontal,
    Trophy,
    ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface KPI {
    id: string
    title: string
    value: string
    change: number // percentage
    target: string
    category: string
    trend: 'up' | 'down' | 'neutral'
}

export default function PerformancePage() {
    const [kpis, setKpis] = useState<KPI[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newTitle, setNewTitle] = useState('')
    const [newValue, setNewValue] = useState('')
    const [newChange, setNewChange] = useState('0')
    const [newTarget, setNewTarget] = useState('')
    const [newCategory, setNewCategory] = useState('Growth')

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_performance')
        if (saved) {
            setKpis(JSON.parse(saved))
        } else {
            const defaults: KPI[] = [
                { id: '1', title: 'Monthly Recurring Revenue', value: '$12,450', change: 12.5, target: '$15k', category: 'Financial', trend: 'up' },
                { id: '2', title: 'User Acquisition Cost', value: '$4.20', change: -8.1, target: '$3.50', category: 'Marketing', trend: 'down' },
                { id: '3', title: 'Active Daily Users', value: '1,284', change: 5.2, target: '2k', category: 'Engagement', trend: 'up' },
                { id: '4', title: 'NPS Score', value: '74', change: 2.0, target: '80', category: 'Product', trend: 'neutral' },
            ]
            setKpis(defaults)
            localStorage.setItem('lifepath_performance', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_performance', JSON.stringify(kpis))
        }
    }, [kpis, isLoaded])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newKpi: KPI = {
            id: Date.now().toString(),
            title: newTitle,
            value: newValue,
            change: parseFloat(newChange),
            target: newTarget,
            category: newCategory,
            trend: parseFloat(newChange) > 0 ? 'up' : (parseFloat(newChange) < 0 ? 'down' : 'neutral')
        }
        setKpis([newKpi, ...kpis])
        setIsAddModalOpen(false)
        setNewTitle('')
        setNewValue('')
        setNewTarget('')
    }

    return (
        <RouteGuard featureName="Performance Analytics">
            <div className="layout-wrapper">
                <Sidebar />
                <main className="projects-main" style={{ padding: '2rem', overflowY: 'auto' }}>
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                                    <BarChart3 size={24} color="#3b82f6" />
                                </div>
                                <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white' }}>
                                    Empire Analytics
                                </h1>
                            </div>
                            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                                Real-time visibility into your empire's vital signs.
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
                                transition: 'all 0.2s',
                                boxShadow: '0 10px 20px -5px rgba(255,255,255,0.1)'
                            }}
                        >
                            <Plus size={18} />
                            Track Metric
                        </button>
                    </div>

                    <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence mode="popLayout">
                            {kpis.map((kpi, i) => (
                                <motion.div
                                    key={kpi.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="project-card"
                                    style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        padding: '2rem',
                                        borderRadius: '28px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{ y: -6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            color: '#52525b',
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                        }}>
                                            {kpi.category}
                                        </div>
                                        <button className="icon-btn-small" style={{ opacity: 0.5 }}><MoreHorizontal size={14} /></button>
                                    </div>

                                    <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#a1a1aa', marginBottom: '1rem' }}>{kpi.title}</h3>

                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                        <h2 className="font-serif" style={{ fontSize: '3rem', color: 'white' }}>{kpi.value}</h2>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            color: kpi.change > 0 ? '#10b981' : (kpi.change < 0 ? '#ef4444' : '#71717a'),
                                            background: kpi.change > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '8px'
                                        }}>
                                            {kpi.change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            {Math.abs(kpi.change)}%
                                        </div>
                                    </div>

                                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#52525b' }}>
                                            <Target size={14} />
                                            <span>Target: <span style={{ color: '#a1a1aa' }}>{kpi.target}</span></span>
                                        </div>
                                        <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: '75%',
                                                height: '100%',
                                                background: kpi.change > 0 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'rgba(255,255,255,0.1)',
                                                borderRadius: '10px'
                                            }} />
                                        </div>
                                    </div>

                                    {/* Decorator */}
                                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: kpi.change > 0 ? 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)' : 'none', pointerEvents: 'none' }} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Add Metric Modal */}
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
                                                <Activity size={28} color="#3b82f6" />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Add Metric</h2>
                                                <p style={{ color: '#71717a' }}>Define what success looks like.</p>
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
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>METRIC NAME</label>
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
                                                placeholder="e.g. Conversion Rate"
                                                value={newTitle}
                                                onChange={e => setNewTitle(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>CURRENT VALUE</label>
                                                <input
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none' }}
                                                    placeholder="e.g. $12k"
                                                    value={newValue}
                                                    onChange={e => setNewValue(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>TARGET VALUE</label>
                                                <input
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none' }}
                                                    placeholder="e.g. $20k"
                                                    value={newTarget}
                                                    onChange={e => setNewTarget(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>CHANGE (%)</label>
                                                <input
                                                    type="number"
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none' }}
                                                    placeholder="0"
                                                    value={newChange}
                                                    onChange={e => setNewChange(e.target.value)}
                                                />
                                            </div>
                                            <div className="field-section">
                                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block' }}>CATEGORY</label>
                                                <select
                                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none', appearance: 'none' }}
                                                    value={newCategory}
                                                    onChange={e => setNewCategory(e.target.value)}
                                                >
                                                    <option value="Growth">Growth</option>
                                                    <option value="Financial">Financial</option>
                                                    <option value="Marketing">Marketing</option>
                                                    <option value="Product">Product</option>
                                                    <option value="Engagement">Engagement</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                style={{ padding: '1rem 2rem', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#d6d3d1', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                style={{ padding: '1rem 2.5rem', borderRadius: '50px', background: 'white', border: 'none', color: 'black', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                Track Metric
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <style jsx global>{`
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
                        }
                    `}</style>
                </main>
            </div>
        </RouteGuard>
    )
}
