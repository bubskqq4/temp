'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Building, Calendar, Edit2, RotateCw } from 'lucide-react'

interface ViewClientModalProps {
    isOpen: boolean
    onClose: () => void
    client: any
    onEdit: () => void
    onLogContact: () => void
}

export const ViewClientModal = ({ isOpen, onClose, client, onEdit, onLogContact }: ViewClientModalProps) => {
    if (!client) return null

    const formatDateForDisplay = (dateString?: string) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        const d = date.getDate()
        const m = monthNames[date.getMonth()]
        const y = date.getFullYear()
        const suffix = (d: number) => {
            if (d > 3 && d < 21) return 'th'
            switch (d % 10) {
                case 1: return "st"
                case 2: return "nd"
                case 3: return "rd"
                default: return "th"
            }
        }
        return `${m} ${d}${suffix(d)}, ${y}`
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="view-client-modal-root">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="modal-overlay"
                        style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.8)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-40%' }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="view-modal-container"
                    >
                        <button onClick={onClose} className="modal-close-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                            <X size={20} />
                        </button>

                        <div className="view-modal-content">
                            {/* Avatar / Initial */}
                            <div className="view-avatar">
                                {client.name.charAt(0)}
                            </div>

                            <h2 className="view-name">{client.name}</h2>
                            <p className="view-company">{client.company}</p>

                            <div className="view-info-list">
                                <div className="view-info-item">
                                    <div style={{ flex: 1 }}>
                                        <span className="view-label">Email Address</span>
                                        <p className="view-value">{client.email}</p>
                                    </div>
                                    <Mail size={18} style={{ color: '#a8a29e', opacity: 0.5 }} />
                                </div>

                                <div className="view-info-item">
                                    <div style={{ flex: 1 }}>
                                        <span className="view-label">Current Status</span>
                                        <p className="view-value">{client.status}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${client.status === 'Lead' ? 'bg-blue-400' : client.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                                </div>

                                <div className="view-info-item">
                                    <div style={{ flex: 1 }}>
                                        <span className="view-label">Last Interaction</span>
                                        <p className="view-value">{formatDateForDisplay(client.lastContact)}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onLogContact(); }}
                                            className="view-log-btn"
                                            title="Log Contact Today"
                                        >
                                            <RotateCw size={16} />
                                        </button>
                                        <div style={{ display: 'flex', alignItems: 'center', opacity: 0.5, color: '#a8a29e', marginLeft: '0.25rem' }}>
                                            <Calendar size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onEdit}
                                className="view-edit-btn"
                            >
                                <Edit2 size={18} />
                                Edit Relationship Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
