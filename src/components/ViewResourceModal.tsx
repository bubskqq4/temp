'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Link as LinkIcon, StickyNote, Globe, Download, Tag, Folder, Calendar, ExternalLink } from 'lucide-react'
import { Resource } from '@/app/knowledge-base/types'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface ViewResourceModalProps {
    isOpen: boolean
    onClose: () => void
    resource: Resource
}

export const ViewResourceModal = ({ isOpen, onClose, resource }: ViewResourceModalProps) => {
    if (!resource) return null

    const getIcon = () => {
        switch (resource.type) {
            case 'Note': return <StickyNote size={32} className="text-orange-400" />
            case 'Link': return <LinkIcon size={32} className="text-blue-400" />
            case 'Document': return <FileText size={32} className="text-purple-400" />
            default: return <FileText size={32} />
        }
    }

    const formatDate = (ts: number) => {
        return new Date(ts).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div key="view-resource-modal-overlay" className="modal-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                        className="modal-content view-resource-modal"
                        // Vinca. use
                        style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={cn("view-hero", resource.type.toLowerCase())}>
                            <button className="close-btn-floating" onClick={onClose}>
                                <X size={20} />
                            </button>
                            <div className="hero-content">
                                <div className="hero-icon-wrapper">
                                    {getIcon()}
                                </div>
                                <h2 className="hero-title font-serif">{resource.title}</h2>
                                <div className="hero-meta">
                                    <span className="meta-item">
                                        <Calendar size={14} />
                                        {formatDate(resource.createdAt)}
                                    </span>
                                    <span className="meta-item">
                                        <Folder size={14} />
                                        {resource.project}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="view-body">
                            <div className="content-section">
                                <h3 className="section-title">
                                    {resource.type === 'Link' ? 'URL' : 'DESCRIPTION'}
                                </h3>
                                {resource.type === 'Link' ? (
                                    <div className="link-display-box">
                                        <Globe size={18} className="text-blue-400" />
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="url-text">
                                            {resource.url}
                                        </a>
                                        <ExternalLink size={16} className="ml-auto opacity-50" />
                                    </div>
                                ) : (
                                    <div className="content-text">
                                        {resource.content || 'No description provided.'}
                                    </div>
                                )}
                            </div>

                            <div className="content-section">
                                <h3 className="section-title">TAGS</h3>
                                <div className="view-tags-row">
                                    {resource.tags.map((tag: string) => (
                                        <span key={tag} className="view-tag-pill">
                                            <Tag size={12} />
                                            {tag}
                                        </span>
                                    ))}
                                    {resource.tags.length === 0 && <span className="text-muted-foreground text-sm">No tags</span>}
                                </div>
                            </div>
                        </div>

                        <footer className="view-footer">
                            {resource.type === 'Document' ? (
                                <button className="primary-action-btn">
                                    <Download size={18} />
                                    <span>Download Document</span>
                                </button>
                            ) : resource.type === 'Link' ? (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="primary-action-btn no-underline">
                                    <ExternalLink size={18} />
                                    <span>Visit Link</span>
                                </a>
                            ) : (
                                <button className="primary-action-btn secondary">
                                    <StickyNote size={18} />
                                    <span>Copy Note</span>
                                </button>
                            )}
                        </footer>
                    </motion.div>
                </div>
            )}
            <style jsx>{`
                .view-resource-modal {
                    background: #121212;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .view-hero {
                    padding: 3rem 2rem;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
                }

                .view-hero.note { border-bottom: 2px solid rgba(251, 146, 60, 0.2); }
                .view-hero.link { border-bottom: 2px solid rgba(59, 130, 246, 0.2); }
                .view-hero.document { border-bottom: 2px solid rgba(168, 85, 247, 0.2); }

                .close-btn-floating {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.2s ease;
                }

                .close-btn-floating:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: rotate(90deg);
                }

                .hero-icon-wrapper {
                    width: 70px;
                    height: 70px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.03);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .hero-title {
                    font-size: 2rem;
                    margin-bottom: 0.8rem;
                }

                .hero-meta {
                    display: flex;
                    gap: 1.5rem;
                    color: var(--muted-foreground);
                    font-size: 0.9rem;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .view-body {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .section-title {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: var(--muted-foreground);
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                }

                .content-text {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.5rem;
                    line-height: 1.6;
                    color: #e4e4e7;
                }

                .link-display-box {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .url-text {
                    color: #3b82f6;
                    font-weight: 500;
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    word-break: break-all;
                }

                .view-tags-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.6rem;
                }

                .view-tag-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 0.4rem 0.8rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: #d4d4d8;
                }

                .view-footer {
                    padding: 1.5rem 2rem 2.5rem;
                    display: flex;
                    justify-content: center;
                }

                .primary-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: white;
                    color: black;
                    padding: 1rem 2.5rem;
                    border-radius: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .primary-action-btn.no-underline {
                    text-decoration: none;
                }

                .primary-action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
                }

                .primary-action-btn.secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </AnimatePresence>
    )
}
