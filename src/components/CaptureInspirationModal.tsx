'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface CaptureInspirationModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (inspiration: any) => void
}

export const CaptureInspirationModal = ({ isOpen, onClose, onAdd }: CaptureInspirationModalProps) => {
    const [source, setSource] = useState<'upload' | 'url'>('upload')
    const [caption, setCaption] = useState('')
    const [url, setUrl] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const finalImageUrl = source === 'url' ? url : previewUrl

        if (!finalImageUrl) return

        onAdd({
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: finalImageUrl,
            caption,
            sourceType: source
        })

        // Reset
        setCaption('')
        setUrl('')
        setPreviewUrl(null)
        setSource('upload')
        onClose()
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div key="capture-inspiration-modal-overlay" className="modal-overlay" onClick={onClose}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            drag
                            dragMomentum={false}
                            whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            style={{ maxWidth: '520px' }}
                        >
                            <header className="modal-header">
                                <button className="close-btn" onClick={onClose}>
                                    <X size={20} />
                                </button>
                                <h2 className="modal-title font-serif" style={{ fontSize: '2.5rem' }}>Capture inspiration.</h2>
                                <p className="modal-subtitle">Save what sparks your creativity.</p>
                            </header>

                            <form onSubmit={handleSubmit} className="task-form-body" style={{ marginTop: '1.5rem' }}>
                                <div className="form-label">
                                    <ImageIcon size={14} />
                                    <span>SOURCE</span>
                                </div>

                                <div className="source-toggle">
                                    <button
                                        type="button"
                                        className={cn("source-toggle-btn", source === 'upload' && "active")}
                                        onClick={() => setSource('upload')}
                                    >
                                        <Upload size={16} />
                                        <span>Upload</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={cn("source-toggle-btn", source === 'url' && "active")}
                                        onClick={() => setSource('url')}
                                    >
                                        <LinkIcon size={16} />
                                        <span>URL</span>
                                    </button>
                                </div>

                                {source === 'upload' ? (
                                    <div
                                        className={cn("upload-dropzone", isDragging && "dragging")}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                                                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                        <Check size={24} style={{ margin: 'auto' }} />
                                                    </div>
                                                    <p style={{ color: 'white', fontWeight: '600' }}>Image Ready</p>
                                                    <p className="sub">Click to change</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={32} style={{ color: isDragging ? 'white' : '#52525b' }} />
                                                <p style={{ color: isDragging ? 'white' : '#a1a1aa' }}>Click to upload or drag and drop</p>
                                                <p className="sub">PNG, JPG, GIF up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        className="url-input-field"
                                        placeholder="https://example.com/image.jpg"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                )}

                                <div className="form-label" style={{ marginTop: '2rem' }}>
                                    <ImageIcon size={14} style={{ opacity: 0 }} /> {/* Spacer */}
                                    <span>CAPTION (OPTIONAL)</span>
                                </div>
                                <textarea
                                    className="task-textarea"
                                    placeholder="Add a caption or note..."
                                    style={{ height: '80px' }}
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </form>

                            <footer className="modal-footer" style={{ borderTop: 'none', paddingTop: '2rem' }}>
                                <div />
                                <div className="footer-btns">
                                    <button type="button" className="cancel-modal-btn" onClick={onClose}>Cancel</button>
                                    <button
                                        type="submit"
                                        className="submit-task-btn"
                                        disabled={source === 'url' ? !url : !previewUrl}
                                        onClick={handleSubmit}
                                        style={{
                                            minWidth: '160px',
                                            borderRadius: '20px',
                                            opacity: (source === 'url' ? !url : !previewUrl) ? 0.5 : 1,
                                            cursor: (source === 'url' ? !url : !previewUrl) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Add to Studio
                                    </button>
                                </div>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style jsx>{`
                .upload-dropzone.dragging {
                    border-color: white;
                    background: rgba(255, 255, 255, 0.08);
                }
            `}</style>
        </>
    )
}
