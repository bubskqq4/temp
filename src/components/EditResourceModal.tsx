'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Link as LinkIcon, StickyNote, ChevronDown, Tag, Folder, AlertCircle } from 'lucide-react'
import { Resource, ResourceType } from '@/app/knowledge-base/types'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface EditResourceModalProps {
    isOpen: boolean
    onClose: () => void
    resource: Resource
    onSave: (resource: Resource) => void
}

export const EditResourceModal = ({ isOpen, onClose, resource, onSave }: EditResourceModalProps) => {
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

    const [showProjectMenu, setShowProjectMenu] = useState(false)
    const projectRef = useRef<HTMLDivElement>(null)

    const projects = dynamicProjects

    useEffect(() => {
        if (resource) {
            setTitle(resource.title)
            setContent(resource.content || '')
            setUrl(resource.url || '')
            setType(resource.type)
            setProject(resource.project)
            setTags(resource.tags.join(', '))
        }
    }, [resource, isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (projectRef.current && !projectRef.current.contains(event.target as Node)) setShowProjectMenu(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onSave({
                ...resource,
                title: title.trim(),
                content: type !== 'Link' ? content : undefined,
                url: type === 'Link' ? url : undefined,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                project
            })
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="edit-resource-modal-overlay" className="modal-overlay" onClick={onClose}>
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
                            <h2 className="modal-title font-serif text-2xl">Edit resource.</h2>
                        </header>

                        <form onSubmit={handleSubmit} className="task-form-body">
                            <input
                                autoFocus
                                type="text"
                                className="edit-task-input"
                                style={{ fontSize: '1.2rem', padding: '1rem' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="edit-modal-grid">
                                <div className="span-full">
                                    <div className="form-label">
                                        {type === 'Link' ? <LinkIcon size={14} /> : (type === 'Document' ? <FileText size={14} /> : <StickyNote size={14} />)}
                                        <span>{type === 'Link' ? 'URL' : 'CONTENT'}</span>
                                    </div>
                                    {type === 'Link' ? (
                                        <input
                                            type="text"
                                            className="edit-task-input"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    ) : type === 'Document' ? (
                                        <div className="locked-content-box">
                                            <AlertCircle size={18} />
                                            <span>Document file cannot be edited</span>
                                        </div>
                                    ) : (
                                        <textarea
                                            className="task-textarea"
                                            style={{ minHeight: '120px' }}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    )}
                                </div>

                                <div className="status-pills-row">
                                    <div className="form-label">
                                        <ChevronDown size={14} />
                                        <span>TYPE</span>
                                    </div>
                                    <div className="pill-btn disabled">
                                        <span>{type}</span>
                                    </div>
                                </div>

                                <div className="status-pills-row" ref={projectRef}>
                                    <div className="form-label">
                                        <Folder size={14} />
                                        <span>PROJECT</span>
                                    </div>
                                    <div className="pill-btn" onClick={() => setShowProjectMenu(!showProjectMenu)}>
                                        <span>{project}</span>
                                        <ChevronDown size={14} />
                                    </div>
                                    <AnimatePresence>
                                        {showProjectMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="inbox-dropdown"
                                                style={{ top: '65px', left: '0', width: '100%', zIndex: 100 }}
                                            >
                                                {projects.map(p => (
                                                    <button key={p} type="button" className="dropdown-item" onClick={() => { setProject(p); setShowProjectMenu(false); }}>{p}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="span-full">
                                    <div className="form-label">
                                        <Tag size={14} />
                                        <span>TAGS</span>
                                    </div>
                                    <input
                                        className="tags-field"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>

                        <footer className="modal-footer">
                            <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="submit-task-btn" onClick={handleSubmit}>
                                Save Changes
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
            <style jsx>{`
                .span-full {
                    grid-column: 1 / -1;
                }
                .edit-modal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                }
                .status-pills-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    position: relative;
                }
                .locked-content-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    color: var(--muted-foreground);
                    font-style: italic;
                    min-height: 120px;
                }
                .pill-btn.disabled {
                    background: rgba(255, 255, 255, 0.02);
                    color: var(--muted-foreground);
                    cursor: not-allowed;
                }
            `}</style>
        </AnimatePresence>
    )
}
