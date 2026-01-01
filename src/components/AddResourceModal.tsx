'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Link as LinkIcon, StickyNote, Plus, ChevronDown, ListIcon, Tag, Folder } from 'lucide-react'
import { ResourceType } from '@/app/knowledge-base/types'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface AddResourceModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (resource: any) => void
    projectName?: string
}

export const AddResourceModal = ({ isOpen, onClose, onAdd, projectName }: AddResourceModalProps) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [url, setUrl] = useState('')
    const [type, setType] = useState<ResourceType>('Note')
    const [project, setProject] = useState('No Project')
    const [tags, setTags] = useState('')
    const [dynamicProjects, setDynamicProjects] = useState<string[]>(['No Project'])

    useEffect(() => {
        const savedProjects = localStorage.getItem('lifepath_projects')
        if (savedProjects) {
            try {
                const parsed = JSON.parse(savedProjects)
                const names = parsed.map((p: any) => p.title)
                setDynamicProjects(['No Project', ...names])
            } catch (e) {
                console.error("Failed to parse projects", e)
            }
        }
    }, [isOpen])

    useEffect(() => {
        if (projectName) setProject(projectName)
    }, [projectName, isOpen])

    const [showTypeMenu, setShowTypeMenu] = useState(false)
    const [showProjectMenu, setShowProjectMenu] = useState(false)

    const typeRef = useRef<HTMLDivElement>(null)
    const projectRef = useRef<HTMLDivElement>(null)

    const resourceTypes: ResourceType[] = ['Note', 'Link', 'Document']
    const projects = dynamicProjects

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeRef.current && !typeRef.current.contains(event.target as Node)) setShowTypeMenu(false)
            if (projectRef.current && !projectRef.current.contains(event.target as Node)) setShowProjectMenu(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onAdd({
                title: title.trim(),
                type,
                content: type !== 'Link' ? content : undefined,
                url: type === 'Link' ? url : undefined,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                project
            })
            reset()
            onClose()
        }
    }

    const reset = () => {
        setTitle('')
        setContent('')
        setUrl('')
        setType('Note')
        setProject('No Project')
        setTags('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="add-resource-modal-overlay" className="modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-content"
                        style={{ maxWidth: '480px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="modal-header">
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                            <h2 className="modal-title font-serif text-2xl">Add a resource.</h2>
                        </header>

                        <form onSubmit={handleSubmit} className="task-form-body">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Enter resource title..."
                                className="resource-title-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="resource-form-grid">
                                <div className="span-left">
                                    <div className="form-label">
                                        <StickyNote size={14} />
                                        <span>CONTENT</span>
                                    </div>
                                    <textarea
                                        placeholder="Add notes or content..."
                                        className="resource-textarea"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>

                                <div className="span-right">
                                    <div className="form-group" ref={typeRef}>
                                        <div className="form-label">
                                            <FileText size={14} />
                                            <span>TYPE</span>
                                        </div>
                                        <div className="select-box" onClick={() => setShowTypeMenu(!showTypeMenu)}>
                                            <span>{type}</span>
                                            <ChevronDown size={14} />
                                        </div>
                                        <AnimatePresence>
                                            {showTypeMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="resource-dropdown"
                                                >
                                                    {resourceTypes.map(t => (
                                                        <button key={t} type="button" className="dropdown-item" onClick={() => { setType(t); setShowTypeMenu(false); }}>{t}</button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="form-group" ref={projectRef}>
                                        <div className="form-label">
                                            <Folder size={14} />
                                            <span>PROJECT</span>
                                        </div>
                                        <div className="select-box" onClick={() => setShowProjectMenu(!showProjectMenu)}>
                                            <span>{project}</span>
                                            <ChevronDown size={14} />
                                        </div>
                                        <AnimatePresence>
                                            {showProjectMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="resource-dropdown"
                                                >
                                                    {projects.map(p => (
                                                        <button key={p} type="button" className="dropdown-item" onClick={() => { setProject(p); setShowProjectMenu(false); }}>{p}</button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="span-full">
                                    <div className="form-label">
                                        <Tag size={14} />
                                        <span>TAGS</span>
                                    </div>
                                    <input
                                        placeholder="Type a tag and press Enter"
                                        className="resource-tag-input"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>

                        <footer className="modal-footer">
                            <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="submit-task-btn" onClick={handleSubmit}>
                                Add Resource
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
            <style jsx>{`
                .resource-title-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    color: white;
                    font-size: 1.1rem;
                    outline: none;
                    margin-bottom: 2rem;
                }

                .resource-form-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 1.5rem;
                }

                .span-left { grid-column: 1; }
                .span-right { grid-column: 2; display: flex; flex-direction: column; gap: 1.5rem; }
                .span-full { grid-column: 1 / -1; margin-top: 1rem; }

                .resource-textarea {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    color: white;
                    font-size: 0.95rem;
                    min-height: 140px;
                    outline: none;
                    resize: none;
                }

                .form-group {
                    position: relative;
                }

                .select-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 0.8rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .resource-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 0.4rem;
                    margin-top: 0.4rem;
                    z-index: 50;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                }

                .resource-tag-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 0.8rem 1rem;
                    color: white;
                    outline: none;
                }
            `}</style>
        </AnimatePresence>
    )
}
