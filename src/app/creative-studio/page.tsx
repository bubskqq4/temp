'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    Search,
    ChevronDown,
    MoreVertical,
    GripVertical,
    ExternalLink,
    Folder,
    Maximize2,
    ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaptureInspirationModal } from '@/components/CaptureInspirationModal'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface Inspiration {
    id: string
    imageUrl: string
    caption: string
    sourceType: string
    projectId?: string
}

export default function CreativeStudioPage() {
    const [isInspirationModalOpen, setIsInspirationModalOpen] = useState(false)
    const [inspirations, setInspirations] = useState<Inspiration[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [selectedProject, setSelectedProject] = useState<string>('All Projects')
    const [showProjectMenu, setShowProjectMenu] = useState(false)
    const isLoaded = useRef(false)
    const projectMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (projectMenuRef.current && !projectMenuRef.current.contains(event.target as Node)) {
                setShowProjectMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem('lifepath_inspirations')
        if (saved) {
            try {
                setInspirations(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse inspirations", e)
            }
        } else {
            // Initial seed data
            setInspirations([
                {
                    id: '1',
                    imageUrl: 'https://i.imgflip.com/1otk.jpg', // Success Kid as seen in image
                    caption: 'Project breakthrough momentum',
                    sourceType: 'url'
                }
            ])
        }

        const savedProjects = localStorage.getItem('lifepath_projects')
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects))
        }

        isLoaded.current = true
    }, [])

    useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem('lifepath_inspirations', JSON.stringify(inspirations))
        }
    }, [inspirations])

    const handleAddInspiration = (newInspiration: any) => {
        setInspirations(prev => [newInspiration, ...prev])
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="creative-studio-main">
                <header className="studio-header">
                    <div className="studio-title-group">
                        <h1 className="font-serif text-white">Creative Studio</h1>
                        <p>Your visual inspiration and mood-boarding space.</p>
                    </div>
                    <button
                        className="submit-task-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        onClick={() => setIsInspirationModalOpen(true)}
                    >
                        <Plus size={18} />
                        <span>Add Inspiration</span>
                    </button>
                </header>

                <div className="studio-controls">
                    <div className="studio-search-container">
                        <Search size={18} className="projects-search-icon" />
                        <input
                            type="text"
                            placeholder="Search inspirations..."
                            className="projects-search-input"
                        />
                    </div>
                    <div
                        ref={projectMenuRef}
                        className="pill-btn relative"
                        style={{ paddingLeft: '1.25rem', paddingRight: '1rem', border: '1px solid white', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => setShowProjectMenu(!showProjectMenu)}
                    >
                        <span>{selectedProject}</span>
                        <ChevronDown size={14} style={{ marginLeft: '1rem' }} />
                        <AnimatePresence>
                            {showProjectMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inbox-dropdown"
                                    style={{ top: '45px', left: '0', width: '200px', zIndex: 100 }}
                                >
                                    <button className="dropdown-item" onClick={() => setSelectedProject('All Projects')}>All Projects</button>
                                    <div className="dropdown-divider" />
                                    {projects.map(p => (
                                        <button key={p.id} className="dropdown-item" onClick={() => setSelectedProject(p.title)}>{p.title}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="studio-grid">
                    <AnimatePresence mode="popLayout">
                        {inspirations
                            .filter(ins => selectedProject === 'All Projects' || ins.projectId === projects.find(p => p.title === selectedProject)?.id)
                            .map((item) => (
                                <InspirationCard key={item.id} item={item} projects={projects} onUpdate={(updated) => {
                                    setInspirations(prev => prev.map(i => i.id === updated.id ? updated : i))
                                }} />
                            ))}
                    </AnimatePresence>
                </div>

                <CaptureInspirationModal
                    isOpen={isInspirationModalOpen}
                    onClose={() => setIsInspirationModalOpen(false)}
                    onAdd={handleAddInspiration}
                />
            </main>
        </div>
    )
}

function InspirationCard({ item, projects, onUpdate }: { item: Inspiration, projects: any[], onUpdate: (item: any) => void }) {
    const [showMore, setShowMore] = useState(false)
    const [showAssignMenu, setShowAssignMenu] = useState(false)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
            className="inspiration-card"
        >
            <img src={item.imageUrl} alt={item.caption} />

            <div className="inspiration-overlay">
                <div className="studio-top-left-actions">
                    <div className="studio-drag-handle">
                        <GripVertical size={16} />
                    </div>
                </div>

                <div className="studio-top-right-actions">
                    <button className="studio-more-btn" onClick={(e) => {
                        e.stopPropagation();
                        setShowMore(!showMore);
                        setShowAssignMenu(false);
                    }}>
                        <MoreVertical size={16} />
                    </button>
                    {showMore && (
                        <div className="inbox-dropdown" style={{ top: '35px', right: '0', width: '160px', zIndex: 110 }}>
                            <button className="dropdown-item" onClick={(e) => {
                                e.stopPropagation();
                                setShowAssignMenu(true);
                                setShowMore(false);
                            }}>
                                <Folder size={14} style={{ marginRight: '8px' }} />
                                Add to Project
                            </button>
                            <button className="dropdown-item">
                                <Plus size={14} style={{ marginRight: '8px' }} />
                                Edit
                            </button>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item delete">Delete</button>
                        </div>
                    )}
                    {showAssignMenu && (
                        <div className="inbox-dropdown" style={{ top: '35px', right: '0', width: '200px', zIndex: 110 }}>
                            <div className="dropdown-header" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#52525b', fontWeight: '700' }}>ASSIGN TO PROJECT</div>
                            {projects.map(p => (
                                <button key={p.id} className="dropdown-item" onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdate({ ...item, projectId: p.id });
                                    setShowAssignMenu(false);
                                }}>
                                    {p.title}
                                </button>
                            ))}
                            <div className="dropdown-divider" />
                            <button className="dropdown-item" onClick={() => setShowAssignMenu(false)}>Cancel</button>
                        </div>
                    )}
                </div>

                <button className="add-to-project-btn" onClick={(e) => {
                    e.stopPropagation();
                    setShowAssignMenu(true);
                }}>
                    Add to project
                </button>

                <div className="inspiration-quick-actions">
                    <button className="quick-action-icon-btn">
                        <ExternalLink size={20} />
                    </button>
                    <button className="quick-action-icon-btn">
                        <Folder size={20} />
                    </button>
                    <button className="quick-action-icon-btn">
                        <Maximize2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
