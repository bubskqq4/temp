// All widget implementations for Focus Room
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Play, Pause, SkipForward, Check, X } from 'lucide-react'

interface WidgetProps {
    widget: any
    onUpdate?: (data: any) => void
}

// Generic List Widget (used by many widgets)
export function GenericListWidget({ widget, onUpdate, itemName = 'item' }: WidgetProps & { itemName?: string }) {
    const [items, setItems] = useState<Array<{ id: string; text: string; done?: boolean }>>(widget.data?.items || widget.data?.habits || widget.data?.goals || widget.data?.tasks || [])
    const [input, setInput] = useState('')

    const addItem = () => {
        if (!input.trim()) return
        const newItems = [...items, { id: Date.now().toString(), text: input, done: false }]
        setItems(newItems)
        onUpdate?.({ ...widget.data, items: newItems, habits: newItems, goals: newItems, tasks: newItems })
        setInput('')
    }

    const toggleItem = (id: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, done: !item.done } : item)
        setItems(newItems)
        onUpdate?.({ ...widget.data, items: newItems })
    }

    const deleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id)
        setItems(newItems)
        onUpdate?.({ ...widget.data, items: newItems })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                    type="text"
                    placeholder={`Add ${itemName}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    className="search-input"
                    style={{ flex: 1 }}
                />
                <button onClick={addItem} style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} />
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                        <input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        <span style={{ flex: 1, fontSize: '0.9rem', textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
                        <button onClick={() => deleteItem(item.id)} style={{ color: '#71717a' }}><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Generic Stats Widget
export function GenericStatsWidget({ widget, stats }: WidgetProps & { stats: Array<{ label: string; value: string | number }> }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            {stats.map((stat, i) => (
                <div key={i} style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>{stat.label}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</div>
                </div>
            ))}
        </div>
    )
}

// Generic Timer Widget
export function GenericTimerWidget({ widget, onUpdate, label = 'Timer' }: WidgetProps & { label?: string }) {
    const [time, setTime] = useState(widget.data?.time || 0)
    const [running, setRunning] = useState(false)
    const [input, setInput] = useState('')

    useEffect(() => {
        let interval: any
        if (running && time > 0) {
            interval = setInterval(() => {
                setTime((prev: number) => {
                    const newTime = prev - 1
                    if (newTime === 0) setRunning(false)
                    return newTime
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [running, time])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatTime(time)}</div>
            {time === 0 ? (
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <input type="number" placeholder="Minutes" value={input} onChange={(e) => setInput(e.target.value)} className="search-input" style={{ flex: 1, textAlign: 'center' }} />
                    <button onClick={() => { if (input) { setTime(parseInt(input) * 60); setRunning(true) } }} style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', fontWeight: 600 }}>Start</button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setRunning(!running)} style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {running ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => { setTime(0); setRunning(false) }} style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px' }}>Reset</button>
                </div>
            )}
        </div>
    )
}

// Generic Text Widget
export function GenericTextWidget({ widget, onUpdate, placeholder = 'Start typing...' }: WidgetProps & { placeholder?: string }) {
    const [content, setContent] = useState(widget.data?.content || widget.data?.brief || widget.data?.text || '')

    return (
        <textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => { setContent(e.target.value); onUpdate?.({ ...widget.data, content: e.target.value, brief: e.target.value, text: e.target.value }) }}
            style={{ width: '100%', height: '100%', minHeight: '200px', background: 'transparent', border: 'none', color: 'white', fontSize: '0.95rem', lineHeight: '1.6', resize: 'none', outline: 'none', fontFamily: 'inherit' }}
        />
    )
}

// Generic Display Widget
export function GenericDisplayWidget({ icon, title, subtitle, value }: { icon?: string; title: string; subtitle?: string; value?: string | number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100%', textAlign: 'center' }}>
            {icon && <div style={{ fontSize: '4rem' }}>{icon}</div>}
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{value || title}</div>
            {subtitle && <div style={{ fontSize: '1rem', color: '#a1a1aa' }}>{subtitle}</div>}
        </div>
    )
}
