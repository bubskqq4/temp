'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Layout, Plus, Type,
    Target, Zap, Sparkles, TrendingUp, Clock,
    Briefcase, Calendar, Camera, Coffee, Compass,
    Cpu, CreditCard, Database, Earth, Eye,
    Flag, Folder, Gift, Globe, HardDrive,
    Heart, Home, Image, Info, Key,
    Layers, Link, Lock, Mail, Map,
    MessageCircle, Mic, Moon, Music, Navigation,
    Package, Paperclip, PenTool, Phone, PieChart,
    Play, Rocket, Save, Search, Send,
    Settings, Shield, ShoppingBag, Smile, Speaker,
    Star, Sun, Tag, Terminal, Trash,
    Truck, Tv, Umbrella, User, Video
} from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

// Icon components mapping for rendering
const ICON_MAP: Record<string, any> = {
    Target, Zap, Sparkles, TrendingUp, Clock,
    Briefcase, Calendar, Camera, Coffee, Compass,
    Cpu, CreditCard, Database, Earth, Eye,
    Flag, Folder, Gift, Globe, HardDrive,
    Heart, Home, Image, Info, Key,
    Layers, Link, Lock, Mail, Map,
    MessageCircle, Mic, Moon, Music, Navigation,
    Package, Paperclip, PenTool, Phone, PieChart,
    Play, Rocket, Save, Search, Send,
    Settings, Shield, ShoppingBag, Smile, Speaker,
    Star, Sun, Tag, Terminal, Trash,
    Truck, Tv, Umbrella, User, Video
}

const AVAILABLE_ICONS = Object.keys(ICON_MAP)

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (title: string, id: string, icon: string) => void
}

export const AddCategoryModal = ({ isOpen, onClose, onAdd }: AddCategoryModalProps) => {
    const [title, setTitle] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('Target')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            onAdd(title.trim(), id, selectedIcon || 'Target')
            setTitle('')
            setSelectedIcon('Target')
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="add-category-modal-overlay" className="modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-content"
                        style={{ maxWidth: '440px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="modal-header">
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                            <h2 className="modal-title font-serif">
                                Add New Lane
                            </h2>
                            <p className="modal-subtitle">
                                Create a new category for your cockpit.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="task-form-body">
                            <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                                <Layout size={14} />
                                <span>CATEGORY NAME</span>
                            </div>

                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g. Health, Q4 Goals, Moonshots"
                                className="task-textarea"
                                style={{ minHeight: 'auto', height: '44px', marginBottom: '1.5rem' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="form-label" style={{ marginBottom: '1rem' }}>
                                <Target size={14} />
                                <span>SELECT ICON</span>
                            </div>

                            <div className="icon-grid-picker">
                                {AVAILABLE_ICONS.map((iconName) => {
                                    const IconComp = ICON_MAP[iconName];
                                    return (
                                        <button
                                            key={iconName}
                                            type="button"
                                            className={cn("icon-pick-btn", selectedIcon === iconName && "active")}
                                            onClick={() => setSelectedIcon(iconName)}
                                            title={iconName}
                                        >
                                            <IconComp size={18} />
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="form-row" style={{ marginTop: '1.5rem' }}>
                                <div className="pill-btn active">
                                    <Type size={14} />
                                    <span>Task Column</span>
                                </div>
                            </div>
                        </form>

                        <footer className="modal-footer">
                            <div className="shortcut-hint">
                                Enter to save
                            </div>
                            <div className="footer-btns">
                                <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                                <button type="submit" className="submit-task-btn" onClick={handleSubmit}>
                                    Create Column
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                .icon-grid-picker {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 0.5rem;
                    max-height: 200px;
                    overflow-y: auto;
                    padding: 0.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                }
                
                .icon-pick-btn {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background: transparent;
                    color: var(--muted-foreground);
                    transition: all 0.2s ease;
                }
                
                .icon-pick-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                
                .icon-pick-btn.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </AnimatePresence>
    )
}
