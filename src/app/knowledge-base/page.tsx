'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
    Search, Plus, LayoutGrid, List, ChevronDown,
    FileText, Link as LinkIcon, StickyNote,
    Pin, Trash2, Pencil, MoreVertical, ExternalLink, Download,
    Filter, ArrowUpDown, X, Globe, File, Link2, Sparkles, Calendar
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/Sidebar'
import { AddResourceModal } from '@/components/AddResourceModal'
import { EditResourceModal } from '@/components/EditResourceModal'
import { ViewResourceModal } from '@/components/ViewResourceModal'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

import { Resource, ResourceType } from './types'

const KnowledgeBase = () => {
    const [resources, setResources] = useState<Resource[]>([])
    const [dynamicProjects, setDynamicProjects] = useState<string[]>(['All Projects', 'No Project'])
    const isLoaded = useRef(false)

    // Load from localStorage
    useEffect(() => {
        const savedResources = localStorage.getItem('lifepath_resources')
        if (savedResources) {
            try {
                setResources(JSON.parse(savedResources))
            } catch (e) {
                console.error("Failed to parse resources", e)
            }
        } else {
            // Initial dummy data
            setResources([
                {
                    id: '1',
                    title: 'Q4 Strategy Document',
                    type: 'Document',
                    content: 'Strategic plan for Q4 2025 growth.',
                    tags: ['strategy', 'q4', 'growth'],
                    project: 'Business Expansion',
                    isPinned: true,
                    createdAt: Date.now() - 86400000 * 2
                },
                {
                    id: '2',
                    title: 'Design System Inspiration',
                    type: 'Link',
                    url: 'https://linear.app/readme',
                    tags: ['design', 'ui', 'ux'],
                    project: 'App Redesign',
                    isPinned: false,
                    createdAt: Date.now() - 86400000
                }
            ])
        }

        // Load project names
        const savedProjects = localStorage.getItem('lifepath_projects')
        if (savedProjects) {
            try {
                const parsed = JSON.parse(savedProjects)
                const names = parsed.map((p: any) => p.title)
                setDynamicProjects(['All Projects', 'No Project', ...names])
            } catch (e) {
                console.error("Failed to parse projects", e)
            }
        }

        isLoaded.current = true
    }, [])

    // Save to localStorage
    useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem('lifepath_resources', JSON.stringify(resources))
        }
    }, [resources])

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState<string>('All Types')
    const [sortBy, setSortBy] = useState('Newest First')
    const [selectedProject, setSelectedProject] = useState('All Projects')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [activeResource, setActiveResource] = useState<Resource | null>(null)

    const [showSortMenu, setShowSortMenu] = useState(false)
    const [showProjectMenu, setShowProjectMenu] = useState(false)
    const sortRef = useRef<HTMLDivElement>(null)
    const projectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) setShowSortMenu(false)
            if (projectRef.current && !projectRef.current.contains(event.target as Node)) setShowProjectMenu(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handlers
    const handleAddResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'isPinned'>) => {
        const newResource: Resource = {
            ...resource,
            id: Math.random().toString(36).substr(2, 9),
            isPinned: false,
            createdAt: Date.now()
        }
        setResources(prev => [newResource, ...prev])
    }

    const handleUpdateResource = (updatedResource: Resource) => {
        setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r))
    }

    const handleDeleteResource = (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id))
    }

    const togglePin = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setResources(prev => prev.map(r => r.id === id ? { ...r, isPinned: !r.isPinned } : r))
    }

    // Filtered and Sorted Resources
    const filteredResources = useMemo(() => {
        return resources.filter(r => {
            const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesType = selectedType === 'All Types' || (selectedType.startsWith(r.type) || (selectedType === 'Notes' && r.type === 'Note') || (selectedType === 'Links' && r.type === 'Link') || (selectedType === 'Documents' && r.type === 'Document'))
            const matchesProject = selectedProject === 'All Projects' || r.project === selectedProject

            return matchesSearch && matchesType && matchesProject
        }).sort((a, b) => {
            if (sortBy === 'Newest First') return b.createdAt - a.createdAt
            if (sortBy === 'Oldest First') return a.createdAt - b.createdAt
            if (sortBy === 'A-Z') return a.title.localeCompare(b.title)
            return 0
        })
    }, [resources, searchQuery, selectedType, sortBy, selectedProject])

    const types = ['All Types', 'Notes', 'Links', 'Documents']
    const sortOptions = ['Newest First', 'Oldest First', 'A-Z']
    const projects = dynamicProjects

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="dashboard-main overflow-y-auto">
                <header className="kb-header">
                    <div className="header-left">
                        <div className="title-section">
                            <h1 className="text-4xl font-serif text-white mb-2">Knowledge Base</h1>
                            <p className="text-muted-foreground text-sm">Your curated library of ideas, links, and documents</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="add-resource-btn" onClick={() => setIsAddModalOpen(true)}>
                            <Plus size={16} />
                            <span>Add Resource</span>
                        </button>
                        <div className="header-status-pill">
                            <span className="pill-avatar">N</span>
                            <span className="pill-text">1 Issue</span>
                            <X size={14} className="ml-1 opacity-50" />
                        </div>
                    </div>
                </header>

                <div className="kb-controls-row">
                    <div className="search-brain-container">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search your brain..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="kb-filters-toolbar">
                    <div className="filter-group-left">
                        <div className="filter-tabs">
                            {types.map(t => (
                                <button
                                    key={t}
                                    className={cn("filter-tab", selectedType === t && "active")}
                                    onClick={() => setSelectedType(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="toolbar-actions">
                        <div className="view-toggle">
                            <button className={cn("view-btn", viewMode === 'grid' && "active")} onClick={() => setViewMode('grid')}>
                                <LayoutGrid size={16} />
                            </button>
                            <button className={cn("view-btn", viewMode === 'list' && "active")} onClick={() => setViewMode('list')}>
                                <List size={16} />
                            </button>
                        </div>

                        <div className="relative" ref={sortRef}>
                            <button className={cn("icon-btn", showSortMenu && "active")} onClick={() => setShowSortMenu(!showSortMenu)}>
                                <ArrowUpDown size={14} className="icon" />
                                <span>{sortBy}</span>
                                <ChevronDown size={14} className={cn("chevron", showSortMenu && "up")} />
                            </button>
                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="inbox-dropdown"
                                        style={{ top: '40px', right: '0', width: '180px', zIndex: 110 }}
                                    >
                                        {sortOptions.map(o => (
                                            <button key={o} className="dropdown-item" onClick={() => { setSortBy(o); setShowSortMenu(false); }}>
                                                {o}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative" ref={projectRef}>
                            <button className={cn("icon-btn", showProjectMenu && "active")} onClick={() => setShowProjectMenu(!showProjectMenu)}>
                                <FileText size={14} className="icon" />
                                <span>{selectedProject}</span>
                                <ChevronDown size={14} className={cn("chevron", showProjectMenu && "up")} />
                            </button>
                            <AnimatePresence>
                                {showProjectMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="inbox-dropdown"
                                        style={{ top: '40px', right: '0', width: '200px', zIndex: 110 }}
                                    >
                                        {projects.map(p => (
                                            <button key={p} className="dropdown-item" onClick={() => { setSelectedProject(p); setShowProjectMenu(false); }}>
                                                {p}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className={cn("resources-container", viewMode)}>
                    {filteredResources.length > 0 ? (
                        filteredResources.map(resource => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                onView={() => { setActiveResource(resource); setIsViewModalOpen(true); }}
                                onEdit={() => { setActiveResource(resource); setIsEditModalOpen(true); }}
                                onDelete={() => handleDeleteResource(resource.id)}
                                onTogglePin={(e) => togglePin(resource.id, e)}
                            />
                        ))
                    ) : (
                        <div className="empty-state-card card glass col-span-full">
                            <Sparkles size={48} className="text-muted-foreground opacity-20 mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No resources found</h3>
                            <p className="text-muted-foreground text-center max-w-xs">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <AddResourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddResource}
            />

            {activeResource && (
                <>
                    <EditResourceModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        resource={activeResource}
                        onSave={handleUpdateResource}
                    />
                    <ViewResourceModal
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                        resource={activeResource}
                    />
                </>
            )}

            <style jsx>{`
                .kb-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 4rem;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .header-status-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #c2410c;
                    color: white;
                    padding: 0.35rem 0.6rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .pill-avatar {
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                }

                .add-resource-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: white;
                    color: black;
                    padding: 0.5rem 1.2rem;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    transition: all 0.2s ease;
                }

                .kb-controls-row {
                    margin-top: 2rem;
                }

                .search-brain-container {
                    position: relative;
                    max-width: 450px;
                }

                .search-brain-container .search-icon {
                    position: absolute;
                    left: 1.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #52525b;
                }

                .search-brain-container .search-input {
                    width: 100%;
                    background: #09090b;
                    border: 1px solid #18181b;
                    border-radius: 10px;
                    padding: 0.75rem 1rem 0.75rem 2.8rem;
                    color: white;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .search-brain-container .search-input:focus {
                    background: #121214;
                    border-color: #27272a;
                    outline: none;
                }

                .resources-container.grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .resources-container.list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .kb-filters-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 3rem;
                    margin-bottom: 2rem;
                }

                .filter-tabs {
                    display: flex;
                    gap: 0.3rem;
                    background: rgba(255, 255, 255, 0.02);
                    padding: 0.25rem;
                    border-radius: 999px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .filter-tab {
                    padding: 0.4rem 1.25rem;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #71717a;
                    transition: all 0.2s ease;
                }

                .filter-tab.active {
                    background: white;
                    color: black;
                }

                .toolbar-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .view-toggle {
                    display: flex;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                    padding: 0.25rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .view-btn {
                    padding: 0.4rem;
                    border-radius: 8px;
                    color: #52525b;
                    transition: all 0.2s ease;
                }

                .view-btn.active {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .icon-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a1a1aa;
                    font-size: 0.85rem;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                }

                .icon-btn:hover, .icon-btn.active {
                    color: white;
                    background: rgba(255, 255, 255, 0.03);
                }

                .chevron {
                    color: #3f3f46;
                    transition: transform 0.2s ease;
                }

                .chevron.up {
                    transform: rotate(180deg);
                }

                .inbox-dropdown {
                    position: absolute;
                    background: #1c1917;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
                    padding: 0.4rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }

                .dropdown-item {
                    width: 100%;
                    padding: 0.6rem 0.8rem;
                    text-align: left;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #a1a1aa;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .empty-state-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 6rem 2rem;
                    border-radius: 20px;
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.01);
                    margin-top: 2rem;
                }
            `}</style>
        </div>
    )
}

const ResourceCard = ({ resource, onView, onEdit, onDelete, onTogglePin }: {
    resource: Resource,
    onView: () => void,
    onEdit: () => void,
    onDelete: () => void,
    onTogglePin: (e: React.MouseEvent) => void
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [userName, setUserName] = useState('Founder')
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const savedName = localStorage.getItem('lifepath_user_name')
        if (savedName) setUserName(savedName)

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getIcon = () => {
        switch (resource.type) {
            case 'Note': return <StickyNote size={14} />
            case 'Link': return <Link2 size={14} />
            case 'Document': return <FileText size={14} />
            default: return <File size={14} />
        }
    }

    const userAvatar = userName.substring(0, 2).toUpperCase()
    const timeAgo = resource.createdAt ? new Date(resource.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 100, cursor: 'grabbing' }}
            className="resource-card card glass group"
            onClick={onView}
        >
            <div className="task-main">
                <div className="task-checkbox no-interact">
                    {getIcon()}
                </div>
                <div className="task-content">
                    <div className="task-title-row">
                        <span className="task-title">{resource.title}</span>
                        <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
                            <button
                                className={cn("task-more-btn", isMenuOpen && "active")}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsMenuOpen(!isMenuOpen)
                                }}
                            >
                                <MoreVertical size={14} />
                            </button>
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="inbox-dropdown"
                                        style={{ top: '30px', right: '0', width: '160px', zIndex: 100 }}
                                    >
                                        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); onTogglePin(e); setIsMenuOpen(false); }}>
                                            <Pin size={14} className="mr-2" fill={resource.isPinned ? "currentColor" : "none"} />
                                            {resource.isPinned ? 'Unpin' : 'Pin'}
                                        </button>
                                        <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); onEdit(); setIsMenuOpen(false); }}>
                                            <Pencil size={14} className="mr-2" />
                                            Edit
                                        </button>
                                        <button className="dropdown-item delete-item" onClick={(e) => { e.stopPropagation(); onDelete(); setIsMenuOpen(false); }}>
                                            <Trash2 size={14} className="mr-2" />
                                            Delete
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="task-due" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                        <Calendar size={12} />
                        <span>{timeAgo}</span>
                    </div>

                    <div className="task-tags">
                        {resource.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="tag-pill-rounded">#{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="task-footer">
                <div className="project-badge-small">
                    {resource.project !== 'No Project' && resource.project.toUpperCase()}
                </div>
                <div className="task-user-tag active">
                    {userAvatar}
                </div>
            </div>

            <style jsx>{`
                .resource-card {
                    padding: 1.25rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: rgba(23, 23, 23, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .task-main {
                    display: flex;
                    gap: 1rem;
                }

                .task-checkbox.no-interact {
                    cursor: default;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #52525b;
                }

                .task-content {
                    flex: 1;
                    min-width: 0;
                }

                .task-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                .task-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: white;
                }

                .task-due {
                    color: #52525b;
                    font-size: 0.85rem;
                }

                .task-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }

                .tag-pill-rounded {
                    font-size: 0.7rem;
                    color: #a1a1aa;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.1rem 0.6rem;
                    border-radius: 999px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .task-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.5rem;
                }

                .project-badge-small {
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #3f3f46;
                    letter-spacing: 0.05em;
                }

                .task-user-tag {
                    width: 24px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: #a1a1aa;
                }

                .task-user-tag.active {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
            `}</style>
        </motion.div>
    )
}

export default KnowledgeBase;
