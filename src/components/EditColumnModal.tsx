'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Palette, Type, Tag } from 'lucide-react'

interface EditColumnModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: { title: string; color?: string }) => void
    columnData?: { title: string; color?: string }
}

const COLUMN_COLORS = [
    { name: 'Blue', value: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { name: 'Purple', value: '#a855f7', bg: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
    { name: 'Pink', value: '#ec4899', bg: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { name: 'Green', value: '#10b981', bg: 'linear-gradient(135deg, #10b981, #059669)' },
    { name: 'Orange', value: '#f97316', bg: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { name: 'Red', value: '#ef4444', bg: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { name: 'Yellow', value: '#eab308', bg: 'linear-gradient(135deg, #eab308, #ca8a04)' },
    { name: 'Teal', value: '#14b8a6', bg: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    { name: 'Indigo', value: '#6366f1', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { name: 'Gray', value: '#6b7280', bg: 'linear-gradient(135deg, #6b7280, #4b5563)' },
]

export const EditColumnModal: React.FC<EditColumnModalProps> = ({ isOpen, onClose, onSave, columnData }) => {
    const [title, setTitle] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    useEffect(() => {
        if (columnData) {
            setTitle(columnData.title || '')
            setSelectedColor(columnData.color || '')
        }
    }, [columnData, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onSave({ title: title.trim(), color: selectedColor })
            onClose()
        }
    }

    const reset = () => {
        setTitle('')
        setSelectedColor('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-content"
                        style={{ maxWidth: '520px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="modal-header">
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                            <div className="modal-title-section">
                                <h2 className="modal-title font-serif text-2xl">Edit Column</h2>
                                <p className="modal-subtitle">Customize your column settings</p>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="edit-column-form">
                            {/* Column Title */}
                            <div className="form-section">
                                <div className="form-label-row">
                                    <Type size={16} />
                                    <span className="form-label-text">COLUMN NAME</span>
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter column name..."
                                    className="column-name-input"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Color Selection */}
                            <div className="form-section">
                                <div className="form-label-row">
                                    <Palette size={16} />
                                    <span className="form-label-text">ACCENT COLOR</span>
                                </div>
                                <div className="color-grid">
                                    {COLUMN_COLORS.map((color) => (
                                        <div
                                            key={color.value}
                                            className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                                            onClick={() => setSelectedColor(color.value)}
                                            title={color.name}
                                        >
                                            <div
                                                className="color-swatch"
                                                style={{ background: color.bg }}
                                            />
                                            {selectedColor === color.value && (
                                                <div className="check-mark">✓</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>

                        <footer className="modal-footer">
                            <button type="button" className="cancel-modal-btn" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-task-btn" onClick={handleSubmit}>
                                Save Changes
                            </button>
                        </footer>
                    </motion.div>

                    <style jsx>{`
                        .edit-column-form {
                            padding: 2rem;
                            display: flex;
                            flex-direction: column;
                            gap: 2rem;
                        }

                        .form-section {
                            display: flex;
                            flex-direction: column;
                            gap: 0.75rem;
                        }

                        .form-label-row {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            color: #71717a;
                            font-size: 0.75rem;
                            font-weight: 700;
                            letter-spacing: 0.05em;
                        }

                        .form-label-text {
                            flex: 1;
                        }

                        .column-name-input {
                            width: 100%;
                            background: rgba(255, 255, 255, 0.03);
                            border: 1px solid rgba(255, 255, 255, 0.08);
                            border-radius: 12px;
                            padding: 1rem 1.25rem;
                            color: white;
                            font-size: 1.1rem;
                            font-weight: 500;
                            outline: none;
                            transition: all 0.2s ease;
                        }

                        .column-name-input:focus {
                            background: rgba(255, 255, 255, 0.05);
                            border-color: rgba(255, 255, 255, 0.15);
                        }

                        .column-name-input::placeholder {
                            color: #52525b;
                        }

                        .color-grid {
                            display: grid;
                            grid-template-columns: repeat(5, 1fr);
                            gap: 0.75rem;
                        }

                        .color-option {
                            position: relative;
                            aspect-ratio: 1;
                            border-radius: 12px;
                            cursor: pointer;
                            padding: 4px;
                            background: rgba(255, 255, 255, 0.03);
                            border: 2px solid transparent;
                            transition: all 0.2s ease;
                        }

                        .color-option:hover {
                            background: rgba(255, 255, 255, 0.06);
                            transform: scale(1.05);
                        }

                        .color-option.selected {
                            border-color: rgba(255, 255, 255, 0.3);
                            background: rgba(255, 255, 255, 0.08);
                        }

                        .color-swatch {
                            width: 100%;
                            height: 100%;
                            border-radius: 8px;
                            transition: all 0.2s ease;
                        }

                        .check-mark {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            color: white;
                            font-size: 1.25rem;
                            font-weight: 700;
                            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                            pointer-events: none;
                        }

                        .modal-title-section {
                            display: flex;
                            flex-direction: column;
                            gap: 0.25rem;
                        }

                        .modal-subtitle {
                            color: #71717a;
                            font-size: 0.9rem;
                        }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    )
}
