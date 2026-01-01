'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Pin,
    X,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface JournalEntry {
    id: string
    title: string
    content: string
    date: string
    pinned?: boolean
}

const JournalCard = ({ entry, onEdit, onDelete, onTogglePin, onClick }: {
    entry: JournalEntry,
    onEdit: (e: any) => void,
    onDelete: (id: string) => void,
    onTogglePin: (id: string) => void,
    onClick: (entry: JournalEntry) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: entry.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const date = new Date(entry.date)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase()
    const year = date.getFullYear()

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="journal-card card group"
            onClick={() => onClick(entry)}
        >
            <div className="journal-card-left">
                <span className="day">{day}</span>
                <div className="month-year">
                    <span>{month}</span>
                    <span>{year}</span>
                </div>
            </div>
            <div className="journal-card-right">
                <div className="title-row">
                    <h3 className="journal-entry-title">{entry.title || 'Untitled Entry'}</h3>
                    {entry.pinned && <Pin size={12} className="pinned-icon" fill="currentColor" />}
                </div>
                <p className="journal-excerpt">{entry.content}</p>
            </div>

            <div className="journal-actions" onClick={e => e.stopPropagation()}>
                <button onClick={() => onTogglePin(entry.id)} className={entry.pinned ? 'active' : ''}>
                    <Pin size={14} />
                </button>
                <button onClick={() => onEdit(entry)}>
                    <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(entry.id)} className="delete">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}

export const Journals = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const isLoaded = useRef(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        console.log('[Journals] Loading entries from localStorage...')
        try {
            const saved = localStorage.getItem('lifepath_reflections')
            if (saved) {
                const parsed = JSON.parse(saved)
                console.log('[Journals] Loaded entries:', parsed.length)
                setEntries(parsed.map((e: any) => ({
                    ...e,
                    title: e.title || (e.type === 'big_win' ? 'Big Win' : 'Entry'),
                    content: e.content || '',
                    date: e.date || new Date().toISOString()
                })))
            } else {
                console.log('[Journals] No saved entries found, using defaults')
                const defaultEntries = [
                    { id: '1', title: 'Welcome', content: 'Start your journaling journey today!', date: new Date().toISOString() }
                ]
                setEntries(defaultEntries)
                localStorage.setItem('lifepath_reflections', JSON.stringify(defaultEntries))
            }
        } catch (e) {
            console.error('[Journals] Failed to load:', e)
        }
        isLoaded.current = true
    }, [])

    useEffect(() => {
        if (isLoaded.current && entries.length > 0) {
            console.log('[Journals] Saving to localStorage:', entries.length, 'entries')
            localStorage.setItem('lifepath_reflections', JSON.stringify(entries))
        }
    }, [entries])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setEntries((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleDelete = (id: string) => {
        setEntries(prev => prev.filter(e => e.id !== id))
    }

    const handleTogglePin = (id: string) => {
        setEntries(prev => prev.map(e => e.id === id ? { ...e, pinned: !e.pinned } : e))
    }

    const handleAddEntry = () => {
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            title: newTitle || 'Untitled Entry',
            content: newContent,
            date: new Date().toISOString()
        }
        setEntries([newEntry, ...entries])
        setIsAddModalOpen(false)
        setNewTitle('')
        setNewContent('')
    }

    const handleUpdateEntry = () => {
        if (!selectedEntry) return
        setEntries(prev => prev.map(e => e.id === selectedEntry.id ? { ...e, title: newTitle, content: newContent } : e))
        setIsEditModalOpen(false)
        setSelectedEntry(null)
    }

    const filteredEntries = entries.filter(e =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <main className="journals-main">
            <header className="journal-header">
                <div className="header-title-section">
                    <h1 className="font-serif text-4xl">My Journal</h1>
                    <p className="subtitle">Your daily reflections and wins</p>
                </div>
                <button className="new-entry-btn" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    <span>New Entry</span>
                </button>
            </header>

            <div className="search-bar-container">
                <div className="search-wrapper">
                    <SearchIcon size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search journal entries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="entries-grid">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={filteredEntries.map(e => e.id)} strategy={verticalListSortingStrategy}>
                        {filteredEntries.map(entry => (
                            <JournalCard
                                key={entry.id}
                                entry={entry}
                                onEdit={(e) => {
                                    setSelectedEntry(e)
                                    setNewTitle(e.title)
                                    setNewContent(e.content)
                                    setIsEditModalOpen(true)
                                }}
                                onDelete={handleDelete}
                                onTogglePin={handleTogglePin}
                                onClick={(entry) => {
                                    setSelectedEntry(entry)
                                    setIsViewModalOpen(true)
                                }}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
                {filteredEntries.length === 0 && (
                    <div className="empty-state">
                        <p>No entries found. Start writing your journey today.</p>
                    </div>
                )}
            </div>

            {/* View Modal */}
            <AnimatePresence>
                {isViewModalOpen && selectedEntry && (
                    <div className="modal-overlay" onClick={() => setIsViewModalOpen(false)}>
                        <motion.div
                            className="journal-modal-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div className="date-badge">
                                    {new Date(selectedEntry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="close-btn"><X /></button>
                            </div>
                            <h2 className="font-serif text-3xl mb-4">{selectedEntry.title}</h2>
                            <div className="journal-body-text">
                                {selectedEntry.content.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="edit-btn" onClick={() => {
                                    setNewTitle(selectedEntry.title)
                                    setNewContent(selectedEntry.content)
                                    setIsEditModalOpen(true)
                                    setIsViewModalOpen(false)
                                }}>Edit Entry</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="modal-overlay" onClick={() => {
                        setIsAddModalOpen(false)
                        setIsEditModalOpen(false)
                    }}>
                        <motion.div
                            className="journal-edit-modal-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <header className="modal-header">
                                <h3 className="text-xl font-medium">{isEditModalOpen ? 'Edit Entry' : 'New Journal Entry'}</h3>
                                <button onClick={() => {
                                    setIsAddModalOpen(false)
                                    setIsEditModalOpen(false)
                                }}><X /></button>
                            </header>
                            <div className="edit-form">
                                <input
                                    className="title-input"
                                    placeholder="Give it a title..."
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    autoFocus
                                />
                                <textarea
                                    className="content-textarea"
                                    placeholder="Write your thoughts..."
                                    value={newContent}
                                    onChange={e => setNewContent(e.target.value)}
                                />
                            </div>
                            <footer className="edit-footer">
                                <button className="cancel-btn" onClick={() => {
                                    setIsAddModalOpen(false)
                                    setIsEditModalOpen(false)
                                }}>Cancel</button>
                                <button className="save-btn" onClick={isEditModalOpen ? handleUpdateEntry : handleAddEntry}>
                                    {isEditModalOpen ? 'Save Changes' : 'Create Entry'}
                                </button>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}
