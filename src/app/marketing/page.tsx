'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Search,
    Mail,
    MessageSquare,
    Share2,
    TrendingUp,
    Calendar,
    X,
    MoreHorizontal,
    Megaphone,
    Target,
    BarChart3,
    Users,
    DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Campaign {
    id: string
    name: string
    channel: 'Social' | 'Email' | 'Ads' | 'SEO'
    status: 'Planned' | 'Active' | 'Paused' | 'Completed'
    budget: string
    reach: string
    conversion: string
}

export default function MarketingPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    // Form state
    const [newName, setNewName] = useState('')
    const [newChannel, setNewChannel] = useState<Campaign['channel']>('Social')

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_marketing')
        if (saved) {
            setCampaigns(JSON.parse(saved))
        } else {
            const defaults: Campaign[] = [
                { id: '1', name: 'Product Launch Q1', channel: 'Ads', status: 'Active', budget: '$5,000', reach: '120k', conversion: '3.2%' },
                { id: '2', name: 'Newsletter Weekly', channel: 'Email', status: 'Active', budget: '$200', reach: '12k', conversion: '18%' },
                { id: '3', name: 'Twitter Growth', channel: 'Social', status: 'Active', budget: '$0', reach: '45k', conversion: 'N/A' },
                { id: '4', name: 'SEO Content Sprint', channel: 'SEO', status: 'Planned', budget: '$1,200', reach: '0', conversion: '0%' },
            ]
            setCampaigns(defaults)
            localStorage.setItem('lifepath_marketing', JSON.stringify(defaults))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('lifepath_marketing', JSON.stringify(campaigns))
        }
    }, [campaigns, isLoaded])

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        const newEntry: Campaign = {
            id: Date.now().toString(),
            name: newName,
            channel: newChannel,
            status: 'Planned',
            budget: '$0',
            reach: '0',
            conversion: '0%'
        }
        setCampaigns([newEntry, ...campaigns])
        setIsAddModalOpen(false)
        setNewName('')
    }

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'Social': return <Share2 size={16} />
            case 'Email': return <Mail size={16} />
            case 'Ads': return <Megaphone size={16} />
            case 'SEO': return <Search size={16} />
            default: return <Target size={16} />
        }
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Marketing Hub</h1>
                        <p>Centralized command for your growth engines.</p>
                    </div>

                    <div className="projects-top-actions">
                        <button
                            className="submit-task-btn"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus size={18} />
                            <span>Create Campaign</span>
                        </button>
                    </div>
                </header>

                <div className="campaign-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Total Reach', value: '177k', icon: Users },
                        { label: 'Avg Conv.', value: '11.4%', icon: TrendingUp },
                        { label: 'Ad Spend', value: '$6.4k', icon: DollarSign },
                        { label: 'ROI', value: '4.2x', icon: Target },
                    ].map((stat, i) => (
                        <div key={i} className="project-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</span>
                                <stat.icon size={14} />
                            </div>
                            <div className="font-serif" style={{ fontSize: '1.75rem' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className="campaigns-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Active Campaigns</h2>
                    {campaigns.map(campaign => (
                        <motion.div
                            key={campaign.id}
                            className="project-card"
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                                    {getChannelIcon(campaign.channel)}
                                </div>
                                <div style={{ width: '250px' }}>
                                    <h3 className="font-serif" style={{ fontSize: '1.1rem' }}>{campaign.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#52525b' }}>{campaign.channel} Marketing</p>
                                </div>
                                <div style={{ width: '120px' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 700 }}>STATUS</div>
                                    <div style={{ fontSize: '0.85rem', color: campaign.status === 'Active' ? '#10b981' : '#71717a' }}>{campaign.status}</div>
                                </div>
                                <div style={{ width: '120px' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 700 }}>REACH</div>
                                    <div style={{ fontSize: '0.85rem' }}>{campaign.reach}</div>
                                </div>
                                <div style={{ width: '100px' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 700 }}>CONV.</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{campaign.conversion}</div>
                                </div>
                            </div>
                            <button className="icon-btn-small">
                                <BarChart3 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {isAddModalOpen && (
                        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                            <motion.div
                                className="premium-journal-modal"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="premium-modal-header">
                                    <div className="leaf-icon-container">
                                        <Megaphone size={24} color="#f97316" />
                                    </div>
                                    <div className="header-text">
                                        <h2>Start Campaign</h2>
                                        <p>Broadcast your vision to the world.</p>
                                    </div>
                                    <button className="modal-close-x" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
                                </div>

                                <form onSubmit={handleAdd} className="premium-modal-body">
                                    <div className="field-section">
                                        <label>CAMPAIGN NAME</label>
                                        <input
                                            className="premium-title-input"
                                            placeholder="e.g. Winter Sale 2026"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    <div className="field-section">
                                        <label>CHANNEL</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            {(['Social', 'Email', 'Ads', 'SEO'] as const).map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setNewChannel(c)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '10px',
                                                        background: newChannel === c ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: newChannel === c ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                                                        color: newChannel === c ? 'white' : '#71717a',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {getChannelIcon(c)}
                                                    <span>{c}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="premium-modal-footer" style={{ marginTop: '2rem' }}>
                                        <button type="button" className="modal-cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="modal-save-btn">Launch Campaign</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
