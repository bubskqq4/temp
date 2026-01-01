'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Search,
    CreditCard,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar as CalendarIcon,
    Tag,
    X,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarPicker } from '@/components/CalendarPicker'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface Transaction {
    id: string
    title: string
    amount: number
    date: string
    category: string
    type: 'Expense' | 'Income'
}

export default function SpendingPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newTitle, setNewTitle] = useState('')
    const [newAmount, setNewAmount] = useState('')
    const [newCategory, setNewCategory] = useState('Software')
    const [newType, setNewType] = useState<'Expense' | 'Income'>('Expense')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCalendar, setShowCalendar] = useState(false)
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

    const calendarRef = useRef<HTMLDivElement>(null)
    const categoryRef = useRef<HTMLDivElement>(null)

    const categories = ['Software', 'Rent', 'Marketing', 'Revenue', 'Personal', 'Hardware', 'Travel']

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_spending')
        if (saved) {
            setTransactions(JSON.parse(saved))
        } else {
            const defaults: Transaction[] = [
                { id: '1', title: 'Supabase Pro', amount: 25, date: '2025-12-28', category: 'Software', type: 'Expense' },
                { id: '2', title: 'Stripe Payout', amount: 4500, date: '2025-12-27', category: 'Revenue', type: 'Income' },
                { id: '3', title: 'Office Rent', amount: 1200, date: '2025-12-25', category: 'Rent', type: 'Expense' },
                { id: '4', title: 'OpenAI API', amount: 84.50, date: '2025-12-24', category: 'Software', type: 'Expense' },
            ]
            setTransactions(defaults)
            localStorage.setItem('lifepath_spending', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_spending', JSON.stringify(transactions))
        }
    }, [transactions, isLoaded])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newEntry: Transaction = {
            id: Date.now().toString(),
            title: newTitle,
            amount: parseFloat(newAmount),
            date: selectedDate.toISOString().split('T')[0],
            category: newCategory,
            type: newType
        }
        setTransactions([newEntry, ...transactions])
        setIsAddModalOpen(false)
        setNewTitle('')
        setNewAmount('')
        setSelectedDate(new Date())
    }

    const formatDate = (date: Date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }

    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
    const balance = totalIncome - totalExpense

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Spending Tracker</h1>
                        <p>Monitor your capital flow and burn rate.</p>
                    </div>

                    <div className="projects-top-actions">
                        <button
                            className="submit-task-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Log Transaction</span>
                        </button>
                    </div>
                </header>

                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                    <div className="project-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Balance</span>
                        <h2 className="font-serif" style={{ fontSize: '2.5rem', color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                    </div>
                    <div className="project-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Income</span>
                            <ArrowUpRight size={16} color="#10b981" />
                        </div>
                        <h2 className="font-serif" style={{ fontSize: '2.5rem' }}>${totalIncome.toLocaleString()}</h2>
                    </div>
                    <div className="project-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Expenses</span>
                            <ArrowDownRight size={16} color="#ef4444" />
                        </div>
                        <h2 className="font-serif" style={{ fontSize: '2.5rem' }}>${totalExpense.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="project-card" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="font-serif" style={{ fontSize: '1.2rem' }}>Recent Transactions</h3>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="pill-btn"><Filter size={14} /> Filter</button>
                        </div>
                    </div>
                    <div className="custom-scrollbar" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '1rem 2rem' }}>Description</th>
                                    <th style={{ padding: '1rem 2rem' }}>Category</th>
                                    <th style={{ padding: '1rem 2rem' }}>Date</th>
                                    <th style={{ padding: '1rem 2rem', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.sort((a, b) => b.date.localeCompare(a.date)).map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: t.type === 'Income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {t.type === 'Income' ? <TrendingUp size={14} color="#10b981" /> : <TrendingDown size={14} color="#ef4444" />}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{t.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem', color: '#71717a' }}>{t.category}</td>
                                        <td style={{ padding: '1.25rem 2rem', color: '#71717a' }}>{t.date}</td>
                                        <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: 600, color: t.type === 'Income' ? '#10b981' : 'white' }}>
                                            {t.type === 'Income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                    setShowCategoryDropdown(false)
                                }}
                            >
                                <div className="premium-modal-header">
                                    <div className="leaf-icon-container">
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="header-text">
                                        <h2>Log Spending</h2>
                                        <p>Maintain your empire's treasury.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                                </div>

                                <form onSubmit={handleAdd} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>DESCRIPTION</label>
                                        <input
                                            className="premium-title-input"
                                            placeholder="e.g. AWS Hosting Bill"
                                            value={newTitle}
                                            onChange={e => setNewTitle(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="field-section">
                                            <label>AMOUNT ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="premium-textarea"
                                                placeholder="0.00"
                                                value={newAmount}
                                                onChange={e => setNewAmount(e.target.value)}
                                                required
                                                style={{ minHeight: '44px' }}
                                            />
                                        </div>

                                        <div className="field-section">
                                            <label>CATEGORY</label>
                                            <div className="relative" ref={categoryRef}>
                                                <button
                                                    type="button"
                                                    className="premium-textarea"
                                                    style={{ minHeight: '44px', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setShowCategoryDropdown(!showCategoryDropdown)
                                                        setShowCalendar(false)
                                                    }}
                                                >
                                                    <span>{newCategory}</span>
                                                    <ChevronDown size={14} className={cn("transition-transform", showCategoryDropdown && "rotate-180")} />
                                                </button>
                                                <AnimatePresence>
                                                    {showCategoryDropdown && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 5 }}
                                                            className="absolute z-50 w-full mt-2 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                                                        >
                                                            {categories.map(cat => (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                                                                    onClick={() => {
                                                                        setNewCategory(cat)
                                                                        setShowCategoryDropdown(false)
                                                                    }}
                                                                >
                                                                    {cat}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="field-section">
                                            <label>DATE</label>
                                            <div className="relative" ref={calendarRef}>
                                                <button
                                                    type="button"
                                                    className="premium-textarea"
                                                    style={{ minHeight: '44px', width: '100%', textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setShowCalendar(!showCalendar)
                                                        setShowCategoryDropdown(false)
                                                    }}
                                                >
                                                    <CalendarIcon size={16} className="text-zinc-500" />
                                                    <span>{formatDate(selectedDate)}</span>
                                                </button>
                                                <AnimatePresence>
                                                    {showCalendar && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 5 }}
                                                            className="absolute z-50 left-0"
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
                                            <label>TYPE</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', height: '44px' }}>
                                                {(['Expense', 'Income'] as const).map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setNewType(type)}
                                                        className={cn(
                                                            "flex-1 rounded-lg text-xs font-bold transition-all border",
                                                            newType === type
                                                                ? (type === 'Income' ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-red-500/20 border-red-500/50 text-red-400")
                                                                : "bg-white/5 border-transparent text-zinc-500 hover:bg-white/10"
                                                        )}
                                                    >
                                                        {type.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="premium-modal-footer" style={{ marginTop: '2rem' }}>
                                        <button type="button" className="modal-cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="modal-save-btn">Record Transaction</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
            <style jsx>{`
                .relative { position: relative; }
                .absolute { position: absolute; }
                .z-50 { z-index: 50; }
                .w-full { width: 100%; }
                .mt-2 { margin-top: 0.5rem; }
                .bg-emerald-500\/20 { background-color: rgba(16, 185, 129, 0.2); }
                .border-emerald-500\/50 { border-color: rgba(16, 185, 129, 0.5); }
                .text-emerald-400 { color: #34d399; }
                .bg-red-500\/20 { background-color: rgba(239, 68, 68, 0.2); }
                .border-red-500\/50 { border-color: rgba(239, 68, 68, 0.5); }
                .text-red-400 { color: #f87171; }
                .bg-white\/5 { background-color: rgba(255, 255, 255, 0.05); }
                .bg-white\/10 { background-color: rgba(255, 255, 255, 0.1); }
                .text-zinc-500 { color: #71717a; }
                .hover\:bg-white\/10:hover { background-color: rgba(255, 255, 255, 0.1); }
                .rounded-xl { border-radius: 0.75rem; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            `}</style>
        </div>
    )
}
