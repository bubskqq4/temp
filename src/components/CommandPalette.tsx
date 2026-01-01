'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Command,
    ArrowRight,
    LayoutGrid,
    Inbox,
    FolderKanban,
    Briefcase,
    BookOpen,
    Settings,
    Plus,
    X,
    Clock,
    User,
    Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    title: string
    subtitle?: string
    category: 'Pages' | 'Projects' | 'Clients' | 'Resources' | 'Actions'
    icon: any
    href?: string
    action?: () => void
}

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [os, setOs] = useState<'mac' | 'windows'>('mac')
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        const platform = window.navigator.platform.toLowerCase()
        if (platform.includes('win')) {
            setOs('windows')
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Trigger: Cmd+K (Mac) or Ctrl+K (Windows)
            // Also checking if user specifically wants Cmd+M as requested
            const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
            const isCmdM = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'm'

            if (isCmdK || isCmdM) {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }

            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    useEffect(() => {
        const staticPages: SearchResult[] = [
            { id: 'cockpit', title: 'Cockpit', subtitle: 'Global overview', category: 'Pages', icon: LayoutGrid, href: '/dashboard' },
            { id: 'ai-companion', title: 'AI Companion', subtitle: 'Chat with your workspace', category: 'Pages', icon: Sparkles, href: '/ai-companion' },
            { id: 'inbox', title: 'Inbox', subtitle: 'Capture sparks', category: 'Pages', icon: Inbox, href: '/inbox' },
            { id: 'projects', title: 'Projects', subtitle: 'Manage workspaces', category: 'Pages', icon: FolderKanban, href: '/projects' },
            { id: 'business', title: 'Business Hub', subtitle: 'Client relationships', category: 'Pages', icon: Briefcase, href: '/business' },
            { id: 'knowledge', title: 'Knowledge Base', subtitle: 'Resources & documents', category: 'Pages', icon: BookOpen, href: '/knowledge-base' },
            { id: 'settings', title: 'Settings', subtitle: 'Account preferences', category: 'Pages', icon: Settings, href: '/settings' },
        ]

        const actions: SearchResult[] = [
            { id: 'new-task', title: 'New Task', subtitle: 'Add to dashboard', category: 'Actions', icon: Plus, action: () => { /* Trigger modal */ } },
            { id: 'new-project', title: 'Create Project', subtitle: 'Start new vision', category: 'Actions', icon: FolderKanban, href: '/projects' },
            { id: 'new-client', title: 'Add Client', subtitle: 'Grow your business', category: 'Actions', icon: User, href: '/business' },
        ]

        // Load dynamic data from localStorage
        const dynamicResults: SearchResult[] = []

        try {
            const projects = JSON.parse(localStorage.getItem('lifepath_projects') || '[]')
            projects.forEach((p: any) => {
                dynamicResults.push({
                    id: `project-${p.id}`,
                    title: p.title,
                    subtitle: 'Project Workspace',
                    category: 'Projects',
                    icon: FolderKanban,
                    href: `/projects/${p.id}`
                })
            })

            const clients = JSON.parse(localStorage.getItem('lifepath_clients') || '[]')
            clients.forEach((c: any) => {
                dynamicResults.push({
                    id: `client-${c.id}`,
                    title: c.name,
                    subtitle: c.company,
                    category: 'Clients',
                    icon: Briefcase,
                    href: '/business'
                })
            })

            const resources = JSON.parse(localStorage.getItem('lifepath_resources') || '[]')
            resources.forEach((r: any) => {
                dynamicResults.push({
                    id: `resource-${r.id}`,
                    title: r.title,
                    subtitle: 'Resource Note',
                    category: 'Resources',
                    icon: BookOpen,
                    href: '/knowledge-base'
                })
            })

            const inspirations = JSON.parse(localStorage.getItem('lifepath_inspirations') || '[]')
            inspirations.forEach((i: any) => {
                dynamicResults.push({
                    id: `inspiration-${i.id}`,
                    title: i.caption || 'Untitled Inspiration',
                    subtitle: 'Visual Inspiration',
                    category: 'Resources',
                    icon: BookOpen,
                    href: '/creative-studio'
                })
            })
            const tasksData = JSON.parse(localStorage.getItem('lifepath_tasks') || '[]')
            const allTasks = Array.isArray(tasksData)
                ? tasksData
                : Object.values(tasksData).flat()

            allTasks.forEach((t: any) => {
                dynamicResults.push({
                    id: `task-${t.id}`,
                    title: t.content,
                    subtitle: `Task in ${t.columnId || 'Inbox'}`,
                    category: 'Actions',
                    icon: Plus,
                    href: '/dashboard'
                })
            })

        } catch (e) {
            console.error('Failed to load search data', e)
        }

        const all = [...staticPages, ...dynamicResults, ...actions]

        if (!query) {
            setResults(all.slice(0, 10))
        } else {
            const filtered = all.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase()) ||
                (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
            )
            setResults(filtered)
        }
    }, [query, isOpen])

    const handleSelect = (item: SearchResult) => {
        if (item.href) {
            router.push(item.href)
        } else if (item.action) {
            item.action()
        }
        setIsOpen(false)
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex])
            }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="command-palette-overlay" onClick={() => setIsOpen(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="command-palette-container"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="command-palette-input-wrapper">
                            <Search size={20} className="palette-search-icon" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search everything... (Cmd+K)"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                className="command-palette-input"
                            />
                            <div className="palette-os-badge">
                                {os === 'mac' ? '⌘' : 'Ctrl'} K
                            </div>
                        </div>

                        <div className="command-palette-results custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="results-list">
                                    {results.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={cn("palette-item", index === selectedIndex && "selected")}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <div className="item-icon-box">
                                                <item.icon size={18} />
                                            </div>
                                            <div className="item-info">
                                                <span className="item-title">{item.title}</span>
                                                {item.subtitle && <span className="item-subtitle">{item.subtitle}</span>}
                                            </div>
                                            <div className="item-category">
                                                {item.category}
                                            </div>
                                            <div className="item-action-icon">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="palette-no-results">
                                    <X size={40} className="no-results-icon" />
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}
                        </div>

                        <div className="command-palette-footer">
                            <div className="footer-keys">
                                <div className="key-hint"><span>↑↓</span> to navigate</div>
                                <div className="key-hint"><span>↵</span> to select</div>
                                <div className="key-hint"><span>esc</span> to close</div>
                            </div>
                        </div>
                    </motion.div>

                    <style jsx>{`
                        .command-palette-overlay {
                            position: fixed;
                            inset: 0;
                            background: rgba(0, 0, 0, 0.4);
                            backdrop-filter: blur(8px);
                            z-index: 10000;
                            display: flex;
                            align-items: flex-start;
                            justify-content: center;
                            padding-top: 15vh;
                        }

                        .command-palette-container {
                            width: 100%;
                            max-width: 650px;
                            background: rgba(15, 15, 15, 0.85);
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 16px;
                            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5),
                                        0 0 0 1px rgba(255, 255, 255, 0.05);
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                        }

                        .command-palette-input-wrapper {
                            display: flex;
                            align-items: center;
                            padding: 1rem 1.5rem;
                            gap: 1rem;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        }

                        .palette-search-icon {
                            color: #a1a1aa;
                        }

                        .command-palette-input {
                            flex: 1;
                            background: transparent;
                            border: none;
                            outline: none;
                            color: white;
                            font-size: 1.125rem;
                            font-family: inherit;
                        }

                        .command-palette-input::placeholder {
                            color: #52525b;
                        }

                        .palette-os-badge {
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 6px;
                            padding: 4px 8px;
                            font-size: 0.75rem;
                            font-weight: 500;
                            color: #a1a1aa;
                            text-transform: uppercase;
                        }

                        .command-palette-results {
                            max-height: 400px;
                            overflow-y: auto;
                            padding: 0.5rem;
                        }

                        .results-list {
                            display: flex;
                            flex-direction: column;
                            gap: 2px;
                        }

                        .palette-item {
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                            padding: 0.75rem 1rem;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: all 0.15s ease;
                        }

                        .palette-item.selected {
                            background: rgba(255, 255, 255, 0.08);
                        }

                        .item-icon-box {
                            width: 36px;
                            height: 36px;
                            background: rgba(255, 255, 255, 0.03);
                            border: 1px solid rgba(255, 255, 255, 0.05);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #a1a1aa;
                            flex-shrink: 0;
                        }

                        .palette-item.selected .item-icon-box {
                            color: white;
                            background: rgba(255, 255, 255, 0.1);
                        }

                        .item-info {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            min-width: 0;
                        }

                        .item-title {
                            font-size: 0.9375rem;
                            font-weight: 500;
                            color: #e4e4e7;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .item-subtitle {
                            font-size: 0.75rem;
                            color: #71717a;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .item-category {
                            font-size: 0.75rem;
                            color: #52525b;
                            background: rgba(255, 255, 255, 0.03);
                            padding: 2px 8px;
                            border-radius: 4px;
                            margin-right: 0.5rem;
                        }

                        .item-action-icon {
                            color: #3f3f46;
                            opacity: 0;
                            transition: all 0.2s;
                        }

                        .palette-item.selected .item-action-icon {
                            opacity: 1;
                            color: white;
                            transform: translateX(2px);
                        }

                        .palette-no-results {
                            padding: 3rem 2rem;
                            text-align: center;
                            color: #52525b;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 1rem;
                        }

                        .no-results-icon {
                            opacity: 0.2;
                        }

                        .command-palette-footer {
                            padding: 0.75rem 1.5rem;
                            background: rgba(0, 0, 0, 0.2);
                            border-top: 1px solid rgba(255, 255, 255, 0.05);
                        }

                        .footer-keys {
                            display: flex;
                            gap: 1.5rem;
                        }

                        .key-hint {
                            font-size: 0.75rem;
                            color: #52525b;
                        }

                        .key-hint span {
                            color: #a1a1aa;
                            font-family: monospace;
                            background: rgba(255, 255, 255, 0.05);
                            padding: 1px 4px;
                            border-radius: 3px;
                            margin-right: 4px;
                        }

                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }

                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }

                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 10px;
                        }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
