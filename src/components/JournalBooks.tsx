'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Book,
    X,
    FolderKanban,
    Sparkles,
    Search as SearchIcon,
    Briefcase,
    Lightbulb,
    Heart,
    Star,
    Coffee,
    Music,
    PenTool
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

interface JournalBook {
    id: string
    title: string
    description: string
    color: string
    icon: string
    entryCount: number
}

const AVAILABLE_ICONS = [
    { id: 'book', icon: Book },
    { id: 'briefcase', icon: Briefcase },
    { id: 'lightbulb', icon: Lightbulb },
    { id: 'heart', icon: Heart },
    { id: 'star', icon: Star },
    { id: 'coffee', icon: Coffee },
    { id: 'music', icon: Music },
    { id: 'pen', icon: PenTool },
]

const BookCard = ({ book, onEdit, onDelete, onContextMenu }: {
    book: JournalBook,
    onEdit: (b: JournalBook) => void,
    onDelete: (id: string) => void,
    onContextMenu?: (e: React.MouseEvent, bookId: string) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: book.id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="book-card group"
            onContextMenu={(e) => {
                if (onContextMenu) {
                    onContextMenu(e, book.id)
                }
            }}
        >
            <Link href={`/journals/book?id=${book.id}`} className="book-link">
                <div className="book-visual" style={{ background: book.color }}>
                    {(() => {
                        const IconComponent = AVAILABLE_ICONS.find(i => i.id === book.icon)?.icon || Book
                        return <IconComponent size={48} className="book-icon" />
                    })()}
                    <div className="book-spine"></div>
                </div>
                <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-description">{book.description}</p>
                    <div className="book-stats">
                        <span className="entry-count">{book.entryCount} Entries</span>
                    </div>
                </div>
            </Link>

            <div className="book-actions" onClick={e => e.stopPropagation()}>
                <button onClick={(e) => { e.preventDefault(); onEdit(book); }}>
                    <Edit2 size={14} />
                </button>
                <button onClick={(e) => { e.preventDefault(); onDelete(book.id); }} className="delete">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}

export const JournalBooks = () => {
    const [books, setBooks] = useState<JournalBook[]>([])
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
    const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<JournalBook | null>(null)
    const [newBookTitle, setNewBookTitle] = useState('')
    const [newBookDesc, setNewBookDesc] = useState('')
    const [newBookColor, setNewBookColor] = useState('#2dd4bf')
    const [newBookIcon, setNewBookIcon] = useState('book')
    const isLoaded = useRef(false)
    const [bookContextMenu, setBookContextMenu] = useState({ isOpen: false, x: 0, y: 0, bookId: '' })

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const loadBooks = useCallback(() => {
        console.log('[JournalBooks] Loading from localStorage...')
        try {
            const savedReflections = localStorage.getItem('lifepath_reflections')
            let counts: Record<string, number> = {}
            if (savedReflections) {
                const refs = JSON.parse(savedReflections)
                refs.forEach((r: any) => {
                    const bid = r.bookId || 'default'
                    counts[bid] = (counts[bid] || 0) + 1
                })
            }

            const saved = localStorage.getItem('lifepath_journal_books')
            if (saved) {
                const parsed = JSON.parse(saved)
                const updated = parsed.map((b: any) => ({
                    ...b,
                    entryCount: counts[b.id] || 0
                }))
                console.log('[JournalBooks] Loaded books:', updated.length)
                setBooks(updated)
            } else {
                console.log('[JournalBooks] No saved books found, using defaults')
                const defaultBooks = [
                    { id: 'default', title: 'My Journal', description: 'Personal reflections and daily wins', color: '#14b8a6', icon: 'book', entryCount: counts['default'] || 0 },
                    { id: '2', title: 'Business Strategy', description: 'Founder insights and market analysis', color: '#6366f1', icon: 'briefcase', entryCount: counts['2'] || 0 },
                    { id: '3', title: 'Creative Ideas', description: 'Brainstorming and visual concepts', color: '#ec4899', icon: 'lightbulb', entryCount: counts['3'] || 0 }
                ]
                setBooks(defaultBooks)
                localStorage.setItem('lifepath_journal_books', JSON.stringify(defaultBooks))
            }
        } catch (e) {
            console.error('[JournalBooks] Failed to load:', e)
        }
    }, [])

    useEffect(() => {
        loadBooks()
        isLoaded.current = true

        const handleUpdate = () => loadBooks()
        window.addEventListener('lifepath-reflection-update', handleUpdate)
        return () => window.removeEventListener('lifepath-reflection-update', handleUpdate)
    }, [loadBooks])

    useEffect(() => {
        if (isLoaded.current && books.length > 0) {
            console.log('[JournalBooks] Saving to localStorage:', books.length, 'books')
            localStorage.setItem('lifepath_journal_books', JSON.stringify(books))
        }
    }, [books])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setBooks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleAddBook = () => {
        const newBook: JournalBook = {
            id: Date.now().toString(),
            title: newBookTitle || 'Untitled Journal',
            description: newBookDesc || 'A new collection of reflections',
            color: newBookColor,
            icon: newBookIcon,
            entryCount: 0
        }
        setBooks([...books, newBook])
        setIsAddBookModalOpen(false)
        setNewBookTitle('')
        setNewBookDesc('')
    }

    const handleUpdateBook = () => {
        if (!selectedBook) return
        setBooks(prev => prev.map(b => b.id === selectedBook.id ? {
            ...b,
            title: newBookTitle,
            description: newBookDesc,
            color: newBookColor,
            icon: newBookIcon
        } : b))
        setIsEditBookModalOpen(false)
        setSelectedBook(null)
    }

    const handleDeleteBook = (id: string) => {
        setBooks(prev => prev.filter(b => b.id !== id))
    }

    const handleEditClick = (b: JournalBook) => {
        setSelectedBook(b)
        setNewBookTitle(b.title)
        setNewBookDesc(b.description)
        setNewBookColor(b.color)
        setNewBookIcon(b.icon || 'book')
        setIsEditBookModalOpen(true)
    }

    return (
        <main className="books-main">
            <header className="journal-header">
                <div className="header-title-section">
                    <h1 className="font-serif text-5xl mb-4">Journal Books</h1>
                    <p className="subtitle text-xl text-zinc-500">Organize your thoughts into collections</p>
                </div>
                <button className="new-entry-btn" onClick={() => setIsAddBookModalOpen(true)}>
                    <Plus size={18} />
                    <span>Create Book</span>
                </button>
            </header>

            <div className="books-grid">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={books.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        {books.map(book => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteBook}
                                onContextMenu={(e, bookId) => {
                                    e.preventDefault()
                                    setBookContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, bookId })
                                }}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Book Modals */}
            <AnimatePresence>
                {(isAddBookModalOpen || isEditBookModalOpen) && (
                    <div className="modal-overlay" onClick={() => {
                        setIsAddBookModalOpen(false)
                        setIsEditBookModalOpen(false)
                    }}>
                        <motion.div
                            className="premium-journal-modal"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: '600px' }}
                        >
                            <button className="modal-close-x" onClick={() => {
                                setIsAddBookModalOpen(false)
                                setIsEditBookModalOpen(false)
                            }}><X size={20} /></button>

                            <div className="premium-modal-header">
                                <div className="leaf-icon-container" style={{ background: newBookColor + '20' }}>
                                    {(() => {
                                        const IconComponent = AVAILABLE_ICONS.find(i => i.id === newBookIcon)?.icon || Book
                                        return <IconComponent size={24} color={newBookColor} />
                                    })()}
                                </div>
                                <div className="header-text">
                                    <h2>{isEditBookModalOpen ? 'Edit Book' : 'Create New Book'}</h2>
                                    <p>Design your new collection.</p>
                                </div>
                            </div>

                            <div className="premium-modal-body">
                                <div className="field-section">
                                    <label>BOOK TITLE</label>
                                    <input
                                        className="premium-title-input"
                                        placeholder="e.g. Dream Journal"
                                        value={newBookTitle}
                                        onChange={e => setNewBookTitle(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="field-section">
                                    <label>DESCRIPTION</label>
                                    <textarea
                                        className="premium-textarea"
                                        style={{ minHeight: '100px' }}
                                        placeholder="What is this collection for?"
                                        value={newBookDesc}
                                        onChange={e => setNewBookDesc(e.target.value)}
                                    />
                                </div>

                                <div className="field-section">
                                    <label>COVER ICON</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem' }}>
                                        {AVAILABLE_ICONS.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => setNewBookIcon(item.id)}
                                                style={{
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    background: newBookIcon === item.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                                    border: newBookIcon === item.id ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: newBookIcon === item.id ? 'white' : '#71717a',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <item.icon size={18} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="field-section">
                                    <label>COVER COLOR</label>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {['#14b8a6', '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setNewBookColor(c)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: c,
                                                    border: newBookColor === c ? '2px solid white' : 'none',
                                                    boxShadow: newBookColor === c ? '0 0 10px ' + c : 'none',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <footer className="premium-modal-footer">
                                <button className="modal-cancel-btn" onClick={() => {
                                    setIsAddBookModalOpen(false)
                                    setIsEditBookModalOpen(false)
                                }}>Cancel</button>
                                <button className="modal-save-btn" onClick={isEditBookModalOpen ? handleUpdateBook : handleAddBook}>
                                    {isEditBookModalOpen ? 'Save Changes' : 'Create Book'}
                                </button>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Journal Book Context Menu */}
            <ContextMenu
                isOpen={bookContextMenu.isOpen}
                onClose={() => setBookContextMenu({ ...bookContextMenu, isOpen: false })}
                position={{ x: bookContextMenu.x, y: bookContextMenu.y }}
                type="journal-book"
                item={books.find(b => b.id === bookContextMenu.bookId) || {}}
                onEdit={() => {
                    const book = books.find(b => b.id === bookContextMenu.bookId)
                    if (book) handleEditClick(book)
                }}
                onDelete={() => handleDeleteBook(bookContextMenu.bookId)}
            />
        </main>
    )
}
