'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Pin,
    X,
    Calendar,
    Leaf,
    Search as SearchIcon,
    ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ContextMenu } from './ContextMenu'
import Link from 'next/link'
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
    bookId: string
    title: string
    content: string
    date: string
    pinned?: boolean
}

const JournalCard = ({ entry, onEdit, onDelete, onTogglePin, onClick, onContextMenu }: {
    entry: JournalEntry,
    onEdit: (e: any) => void,
    onDelete: (id: string) => void,
    onTogglePin: (id: string) => void,
    onClick: (entry: JournalEntry) => void,
    onContextMenu?: (e: React.MouseEvent, entryId: string) => void
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

export const JournalEntries = ({ bookId }: { bookId: string }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [bookTitle, setBookTitle] = useState('My Journal')
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [showEntryModal, setShowEntryModal] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
    const [entryContextMenu, setEntryContextMenu] = useState({ isOpen: false, x: 0, y: 0, entryId: '' })
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const isLoaded = useRef(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const loadData = useCallback(() => {
        console.log('[JournalEntries] Loading entries for bookId:', bookId)
        try {
            const savedBooks = localStorage.getItem('lifepath_journal_books')
            if (savedBooks) {
                const books = JSON.parse(savedBooks)
                const currentBook = books.find((b: any) => b.id === bookId)
                if (currentBook) {
                    console.log('[JournalEntries] Found book:', currentBook.title)
                    setBookTitle(currentBook.title)
                }
            }

            const saved = localStorage.getItem('lifepath_reflections')
            if (saved) {
                const parsed = JSON.parse(saved)
                const bookEntries = parsed.filter((e: any) => e.bookId === bookId || (!e.bookId && bookId === 'default'))
                console.log('[JournalEntries] Loaded entries:', bookEntries.length)
                setEntries(bookEntries.map((e: any) => ({
                    ...e,
                    title: e.title || (e.type === 'big_win' ? 'Big Win' : 'Entry'),
                    content: e.content || '',
                    date: e.date || new Date().toISOString()
                })))
            } else if (bookId === 'default') {
                console.log('[JournalEntries] No saved entries, using defaults for default book')
                const defaultEntries = [
                    { id: '1', bookId: 'default', title: 'Welcome', content: 'Start your journaling journey today!', date: new Date().toISOString() }
                ]
                setEntries(defaultEntries)
                localStorage.setItem('lifepath_reflections', JSON.stringify(defaultEntries))
            }
        } catch (e) {
            console.error('[JournalEntries] Failed to load:', e)
        }
    }, [bookId])

    useEffect(() => {
        loadData()
        isLoaded.current = true

        const handleUpdate = () => {
            console.log('[JournalEntries] Reloading due to external update...')
            loadData()
        }
        window.addEventListener('lifepath-reflection-update', handleUpdate)
        return () => window.removeEventListener('lifepath-reflection-update', handleUpdate)
    }, [loadData])

    useEffect(() => {
        if (isLoaded.current) {
            try {
                const allSaved = localStorage.getItem('lifepath_reflections')
                let otherEntries: any[] = []
                if (allSaved) {
                    const parsed = JSON.parse(allSaved)
                    otherEntries = parsed.filter((e: any) => e.bookId !== bookId && (e.bookId || bookId !== 'default'))
                }
                const combined = [...otherEntries, ...entries]
                console.log('[JournalEntries] Saving to localStorage:', entries.length, 'entries for this book,', combined.length, 'total')
                localStorage.setItem('lifepath_reflections', JSON.stringify(combined))
            } catch (e) {
                console.error('[JournalEntries] Failed to save:', e)
            }
        }
    }, [entries, bookId])

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
            bookId: bookId,
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Link href="/journals" className="back-link">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-serif text-4xl">{bookTitle}</h1>
                    </div>
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
                                onEdit={(e: JournalEntry) => {
                                    setSelectedEntry(e)
                                    setNewTitle(e.title)
                                    setNewContent(e.content)
                                    setIsEditModalOpen(true)
                                }}
                                onDelete={handleDelete}
                                onTogglePin={handleTogglePin}
                                onClick={(entry: JournalEntry) => {
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div className="date-badge">
                                    {new Date(selectedEntry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                                <button onClick={() => setIsViewModalOpen(false)} className="close-btn"><X size={20} /></button>
                            </div>
                            <h2 className="font-serif text-4xl mb-6 text-white">{selectedEntry.title}</h2>
                            <div className="journal-body-text custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {selectedEntry.content.split('\n').map((para, i) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </div>
                            <div className="modal-footer" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button className="edit-btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: 600 }} onClick={() => {
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

            {/* Premium New/Edit Entry Modal (Matching Image) */}
            <AnimatePresence>
                {(isAddModalOpen || isEditModalOpen) && (
                    <div className="modal-overlay" onClick={() => {
                        setIsAddModalOpen(false)
                        setIsEditModalOpen(false)
                    }}>
                        <motion.div
                            className="premium-journal-modal"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="modal-close-x" onClick={() => {
                                setIsAddModalOpen(false)
                                setIsEditModalOpen(false)
                            }}><X size={20} /></button>

                            <div className="premium-modal-header">
                                <div className="leaf-icon-container">
                                    <Leaf size={24} fill="#22c55e" stroke="#22c55e" />
                                </div>
                                <div className="header-text">
                                    <h2>{isEditModalOpen ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
                                    <p>Capture your thoughts and daily wins.</p>
                                </div>
                            </div>

                            <div className="premium-modal-body">
                                <div className="field-section">
                                    <label><Calendar size={14} /> DATE</label>
                                    <div className="date-display">
                                        <Calendar size={18} className="date-icon" />
                                        <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {isEditModalOpen && (
                                    <div className="field-section">
                                        <label>TITLE</label>
                                        <input
                                            className="premium-title-input"
                                            value={newTitle}
                                            onChange={e => setNewTitle(e.target.value)}
                                            placeholder="Give your entry a title..."
                                        />
                                    </div>
                                )}

                                <div className="field-section">
                                    <label>REFLECTION</label>
                                    <textarea
                                        className="premium-textarea"
                                        placeholder="What was your win today? What are you grateful for? What did you learn?"
                                        value={newContent}
                                        onChange={e => setNewContent(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <footer className="premium-modal-footer">
                                <button className="modal-cancel-btn" onClick={() => {
                                    setIsAddModalOpen(false)
                                    setIsEditModalOpen(false)
                                }}>Cancel</button>
                                <button className="modal-save-btn" onClick={isEditModalOpen ? handleUpdateEntry : handleAddEntry}>
                                    Save Entry
                                </button>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}
