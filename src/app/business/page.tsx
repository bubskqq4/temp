'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Plus,
    Filter,
    SortAsc,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Folder,
    MessageSquare,
    Edit2,
    Trash2,
    Check,
    ChevronDown,
    Sparkles,
    User,
    AlertCircle,
    Bell,
    X
} from 'lucide-react'
import Link from 'next/link'
import { AddClientModal } from '@/components/AddClientModal'

import { EditClientModal } from '@/components/EditClientModal'
import { ViewClientModal } from '@/components/ViewClientModal'
import { Sidebar } from '@/components/Sidebar'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

export default function BusinessHub() {
    const [clients, setClients] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All Statuses')
    const [sortBy, setSortBy] = useState('Name (A-Z)')

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedClient, setSelectedClient] = useState<any>(null)

    // UI States
    const [userName, setUserName] = useState('Founder')
    const [issues, setIssues] = useState<any[]>([])
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
    const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false })

    const statusRef = useRef<HTMLDivElement>(null)
    const sortRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                setStatusDropdownOpen(false)
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Load Clients and User Name
    useEffect(() => {
        const savedClients = localStorage.getItem('lifepath_clients')
        if (savedClients) {
            try {
                setClients(JSON.parse(savedClients))
            } catch (e) {
                console.error("Failed to parse clients", e)
            }
        } else {
            // Seed Data
            setClients([
                {
                    id: '1',
                    name: 'John Doe',
                    company: 'Acme Corp',
                    email: 'john@example.com',
                    status: 'Lead',
                    lastContact: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() // 16 hours ago
                },
                {
                    id: '2',
                    name: 'Sarah Smith',
                    company: 'TechStart',
                    email: 'sarah@techstart.io',
                    status: 'Active',
                    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
                }
            ])
        }

        const savedUserName = localStorage.getItem('lifepath_user_name')
        if (savedUserName) {
            setUserName(savedUserName)
        }
    }, [])

    // Save Clients
    useEffect(() => {
        if (clients.length > 0) {
            localStorage.setItem('lifepath_clients', JSON.stringify(clients))
        }
    }, [clients])

    const showToast = (message: string) => {
        setToast({ message, visible: true })
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
    }

    const handleAddClient = (newClient: any) => {
        setClients(prev => [...prev, newClient])
        setIsAddModalOpen(false)
        showToast('Client added successfully')
    }

    const handleUpdateClient = (updatedClient: any) => {
        setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c))
        setIsEditModalOpen(false)
        setSelectedClient(null)
        showToast('Client updated details')
    }

    const handleLogContact = (client: any) => {
        const updated = { ...client, lastContact: new Date().toISOString() }
        setClients(prev => prev.map(c => c.id === client.id ? updated : c))
        showToast('Contact logged')
        if (selectedClient && selectedClient.id === client.id) {
            setSelectedClient(updated)
        }
    }

    const handleDeleteClient = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this client?')) {
            setClients(prev => prev.filter(c => c.id !== id))
            showToast('Client deleted')
        }
    }

    // Filtering & Sorting
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'All Statuses' || client.status === statusFilter

        return matchesSearch && matchesStatus
    }).sort((a, b) => {
        if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name)
        if (sortBy === 'Name (Z-A)') return b.name.localeCompare(a.name)
        if (sortBy === 'Recently Contacted') return new Date(b.lastContact || 0).getTime() - new Date(a.lastContact || 0).getTime()
        return 0
    })

    const formatTimeAgo = (dateString?: string) => {
        if (!dateString) return 'Never contacted'
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return `${Math.floor(diffInSeconds / 86400)} days ago`
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="business-hub-main">
                <header className="top-bar">
                    <div className="search-container">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="top-actions">
                        <button className="icon-btn" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={16} />
                            Add Client
                        </button>
                        <button className="icon-btn" onClick={() => showToast('Lead Generation Initiated...')}>
                            <Sparkles size={16} />
                            Generate Leads
                        </button>

                        <div className="relative" ref={statusRef}>
                            <button className={cn("icon-btn", statusDropdownOpen && "active")} onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}>
                                <Filter size={16} />
                                <span>{statusFilter}</span>
                            </button>
                            <AnimatePresence>
                                {statusDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="inbox-dropdown"
                                        style={{ top: '35px', left: '0', width: '160px', zIndex: 110 }}
                                    >
                                        {['All Statuses', 'Lead', 'Active', 'Churned', 'Partner'].map(s => (
                                            <button key={s} className="dropdown-item" onClick={() => { setStatusFilter(s); setStatusDropdownOpen(false); }}>{s}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative" ref={sortRef}>
                            <button className={cn("icon-btn", sortDropdownOpen && "active")} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                <SortAsc size={16} />
                                <span>{sortBy}</span>
                            </button>
                            <AnimatePresence>
                                {sortDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="inbox-dropdown"
                                        style={{ top: '35px', left: '0', width: '160px', zIndex: 110 }}
                                    >
                                        {['Name (A-Z)', 'Name (Z-A)', 'Recently Contacted'].map(s => (
                                            <button key={s} className="dropdown-item" onClick={() => { setSortBy(s); setSortDropdownOpen(false); }}>{s}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="user-profile">
                            <div className="header-badge notifications">
                                <Bell size={16} />
                                <span className="badge-dot" />
                            </div>
                            {issues.length > 0 && (
                                <div className="header-badge issue-pill">
                                    <AlertCircle size={14} />
                                    <span>{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
                                    <X size={12} className="close-mini" onClick={() => setIssues([])} />
                                </div>
                            )}
                            <div className="user-name-group" onClick={() => {
                                const newName = prompt("Enter your name:", userName)
                                if (newName) {
                                    setUserName(newName)
                                    localStorage.setItem('lifepath_user_name', newName)
                                }
                            }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <User size={14} style={{ opacity: 0.6 }} />
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{userName}</span>
                            </div>
                            <div className="profile-circle-avatar">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="hub-content-header" style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
                    <h1 className="font-serif text-white" style={{ fontSize: '1.75rem' }}>Business Hub</h1>
                    <p className="text-muted-foreground">Manage your clients, leads, and relationships.</p>
                </div>

                {/* Grid */}
                <div className="hub-grid">
                    <AnimatePresence>
                        {filteredClients.map(client => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                drag
                                dragMomentum={false}
                                whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
                                key={client.id}
                                onClick={() => {
                                    setSelectedClient(client)
                                    setIsViewModalOpen(true)
                                }}
                                className="hub-card group"
                            >
                                {/* Card Header */}
                                <div className="hub-card-header">
                                    <div>
                                        <h3 className="hub-client-name">{client.name}</h3>
                                        <p className="hub-client-company">{client.company}</p>
                                    </div>
                                    <span className={cn(
                                        "hub-status-badge",
                                        client.status === 'Lead' ? "status-lead" :
                                            client.status === 'Active' ? "status-active" :
                                                "status-default"
                                    )}>
                                        {client.status}
                                    </span>
                                </div>

                                {/* Contact Info */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div className="hub-info-row">
                                        <Calendar size={14} />
                                        <span>Contacted {formatTimeAgo(client.lastContact)}</span>
                                    </div>
                                    <div className="hub-info-row">
                                        <Mail size={14} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="hub-actions-bar">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsEditModalOpen(true); }}
                                        className="hub-action-btn"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); /* TODO: Open Project */ }}
                                        className="hub-action-btn"
                                        title="View Projects"
                                    >
                                        <Folder size={16} />
                                    </button>
                                    <a
                                        href={`mailto:${client.email}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hub-action-btn"
                                        title="Send Email"
                                    >
                                        <Mail size={16} />
                                    </a>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleLogContact(client); }}
                                        className="hub-action-btn"
                                        title="Log Contact Today"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClient(client.id, e)}
                                        className="hub-action-btn delete"
                                        style={{ marginLeft: 'auto' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredClients.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center', color: 'var(--muted)' }}>
                            <p style={{ fontSize: '1.125rem' }}>No clients found matching your filters.</p>
                            <button onClick={() => { setSearchQuery(''); setStatusFilter('All Statuses') }} style={{ marginTop: '1rem', color: 'white', textDecoration: 'underline' }}>Clear Filters</button>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AddClientModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddClient}
                />

                <EditClientModal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedClient(null) }}
                    client={selectedClient}
                    onSave={handleUpdateClient}
                />

                <ViewClientModal
                    isOpen={isViewModalOpen}
                    client={selectedClient}
                    onClose={() => { setIsViewModalOpen(false); setSelectedClient(null) }}
                    onEdit={() => {
                        setIsViewModalOpen(false)
                        setIsEditModalOpen(true)
                    }}
                    onLogContact={() => handleLogContact(selectedClient)}
                />

                {/* Toast */}
                <AnimatePresence>
                    {toast.visible && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="hub-toast"
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                            <div>
                                <h4 style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.125rem' }}>Notification</h4>
                                <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{toast.message}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
