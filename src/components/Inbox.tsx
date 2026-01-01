'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
    Plus,
    Search,
    MoreVertical,
    Calendar,
    Tag as TagIcon,
    Flag,
    Filter,
    SortAsc,
    Folder,
    CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddTaskModal } from './AddTaskModal'
import { EditTaskModal } from './EditTaskModal'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

const InboxDropdown = ({
    isOpen,
    onClose,
    onDelete,
    onEdit,
    onDuplicate,
    onUrgent
}: {
    isOpen: boolean,
    onClose: () => void,
    onDelete: () => void,
    onEdit: () => void,
    onDuplicate: () => void,
    onUrgent: () => void
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="inbox-dropdown"
        >
            <button className="dropdown-item" onClick={onEdit}>Edit</button>
            <button className="dropdown-item" onClick={onUrgent}>Mark as Urgent</button>
            <button className="dropdown-item" onClick={onDuplicate}>Duplicate</button>
            <button className="dropdown-item">Move to...</button>
            <div className="dropdown-divider" />
            <button className="dropdown-item delete" onClick={onDelete}>Delete</button>
        </motion.div>
    )
}

const InboxItem = ({ item, onDelete, onEdit, onDuplicate, onUrgent }: { item: any, onDelete: (id: string) => void, onEdit: (item: any) => void, onDuplicate: (id: string) => void, onUrgent: (id: string) => void }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="inbox-item-card card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="item-main-content">
                <span className="item-title">{item.title}</span>
                <span className="item-meta">{item.capturedAt}</span>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="hover-actions-overlay"
                    >
                        <div className="hover-action-btn-wrapper">
                            <button className="hover-action-btn folder">
                                <Folder size={16} />
                            </button>
                            <span className="hover-tooltip">Move to Project</span>
                        </div>
                        <div className="hover-action-btn-wrapper">
                            <button className="hover-action-btn check" onClick={() => onDelete(item.id)}>
                                <CheckCircle2 size={16} />
                            </button>
                            <span className="hover-tooltip">Mark as Done</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="item-actions-group">
                <button
                    className={cn("more-btn", isMenuOpen && "active")}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(!isMenuOpen)
                    }}
                >
                    <MoreVertical size={14} />
                </button>
                <InboxDropdown
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    onDelete={() => onDelete(item.id)}
                    onEdit={() => {
                        setIsMenuOpen(false)
                        onEdit(item)
                    }}
                    onDuplicate={() => {
                        setIsMenuOpen(false)
                        onDuplicate(item.id)
                    }}
                    onUrgent={() => {
                        setIsMenuOpen(false)
                        onUrgent(item.id)
                    }}
                />
            </div>
        </motion.div>
    )
}

interface InboxItemType {
    id: string
    title: string
    capturedAt: string
}

export const Inbox = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<InboxItemType | null>(null)
    const [items, setItems] = useState<InboxItemType[]>([])
    const isLoaded = useRef(false)

    // Load items from localStorage on mount
    useEffect(() => {
        const savedItems = localStorage.getItem('lifepath_sparks')
        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems))
            } catch (e) {
                console.error("Failed to parse saved inbox items", e)
            }
        } else {
            // Initial dummy data if nothing is saved
            setItems([
                { id: '1', title: 'Finalize Homepage Copy', capturedAt: 'Captured 22 minutes ago' },
                { id: '2', title: 'Research competitors in the AI Space', capturedAt: 'Yesterday' },
                { id: '3', title: 'Draft partnership proposal for TechStart', capturedAt: 'Yesterday' },
            ])
        }
        isLoaded.current = true
    }, [])

    // Save items to localStorage whenever they change
    useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem('lifepath_sparks', JSON.stringify(items))
        }
    }, [items])

    const handleAddItem = (title: string, category: string, dueDate?: Date) => {
        setItems([{
            id: Date.now().toString(),
            title,
            capturedAt: 'Captured just now'
        }, ...items])
        setIsAddModalOpen(false)
    }

    const handleSaveItem = (updatedItem: any) => {
        setItems(prev => prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
        setIsEditModalOpen(false)
        setEditingItem(null)
    }

    const handleDuplicate = (id: string) => {
        const item = items.find(i => i.id === id)
        if (item) {
            const newItem = { ...item, id: Date.now().toString(), title: `${item.title} (Copy)`, capturedAt: 'Captured just now' }
            setItems([newItem, ...items])
        }
    }

    const handleUrgent = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, title: `⚠️ [URGENT] ${item.title}` } : item))
    }

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    const openEditModal = (item: any) => {
        setEditingItem(item)
        setIsEditModalOpen(true)
    }

    return (
        <main className="inbox-main">
            <header className="top-bar">
                <div className="search-container">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Search inbox..." className="search-input" />
                </div>
                <div className="top-actions">
                    <button className="icon-btn"><SortAsc size={16} /> Sort</button>
                    <button className="icon-btn"><Filter size={16} /> Filters</button>
                    <button className="quick-capture-pill" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={14} />
                        <span>Quick Capture</span>
                    </button>
                </div>
            </header>

            <section className="inbox-content">
                <div className="inbox-header-row">
                    <div className="title-group-main">
                        <div className="title-with-count">
                            <h1 className="inbox-title font-serif">Inbox</h1>
                            <span className="inbox-badge">{items.length}</span>
                        </div>
                        <p className="inbox-subtitle">Process your captured thoughts and move them forward.</p>
                    </div>
                </div>

                <div className="inbox-list">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <InboxItem
                                key={item.id}
                                item={item}
                                onDelete={handleDelete}
                                onEdit={openEditModal}
                                onDuplicate={handleDuplicate}
                                onUrgent={handleUrgent}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddItem}
                type="spark"
            />

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingItem(null)
                }}
                onSave={handleSaveItem}
                taskData={editingItem}
            />
        </main>
    )
}
