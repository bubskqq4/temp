'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { RouteGuard } from '@/components/RouteGuard'
import {
    Sparkles,
    Mic,
    Play,
    Pause,
    Download,
    Volume2,
    Loader2,
    Plus,
    X,
    MoreHorizontal,
    Calendar,
    FileAudio,
    Trash2,
    Edit2,
    RotateCcw,
    Pin,
    PinOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Types ---

interface Voice {
    id: string
    name: string
    category: string
    description: string
    gender: 'male' | 'female' | 'neutral'
}

interface Artifact {
    id: string
    title: string
    date: Date
    voice: Voice
    text: string
    audioUrl: string
    duration?: string
    pinned?: boolean
}

// --- Data ---

const INWORLD_VOICES: Voice[] = [
    // Narrators
    { id: 'Adam', name: 'Adam', category: 'Narrator', description: 'Clear, professional male narrator', gender: 'male' },
    { id: 'Emily', name: 'Emily', category: 'Narrator', description: 'Warm, engaging female narrator', gender: 'female' },
    { id: 'Celeste', name: 'Celeste', category: 'Narrator', description: 'Elegant, sophisticated voice', gender: 'female' },
    // Characters
    { id: 'Luna', name: 'Luna', category: 'Character', description: 'Young, energetic adventurer', gender: 'female' },
    { id: 'Marcus', name: 'Marcus', category: 'Character', description: 'Mature, experienced hero', gender: 'male' },
    { id: 'Victor', name: 'Victor', category: 'Character', description: 'Charismatic villain', gender: 'male' },
    // Fantasy & Sci-Fi
    { id: 'Aelindra', name: 'Aelindra', category: 'Fantasy', description: 'Noble elven queen', gender: 'female' },
    { id: 'Thorgrim', name: 'Thorgrim', category: 'Fantasy', description: 'Gruff dwarven warrior', gender: 'male' },
    { id: 'Nova', name: 'Nova', category: 'Sci-Fi', description: 'Advanced AI assistant', gender: 'neutral' },
]

// --- Components ---

const CreateArtifactModal = ({
    isOpen,
    onClose,
    onCreate
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (artifact: Artifact) => void;
}) => {
    const [step, setStep] = useState<'voice' | 'text' | 'generating'>('voice')
    const [selectedVoice, setSelectedVoice] = useState<Voice>(INWORLD_VOICES[0])
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!text.trim() || !title.trim()) return

        setStep('generating')
        setError(null)

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    voiceId: selectedVoice.id,
                    modelId: 'inworld-tts-1'
                })
            })

            const data = await response.json()

            // Construct the artifact
            let audioUrl = ''
            if (data.fallback || !data.success) {
                audioUrl = 'fallback' // Special marker
            } else {
                audioUrl = `data:${data.contentType};base64,${data.audio}`
            }

            const newArtifact: Artifact = {
                id: Date.now().toString(),
                title,
                date: new Date(),
                voice: selectedVoice,
                text,
                audioUrl
            }

            onCreate(newArtifact)
            onClose()
            // Reset state
            setStep('voice')
            setText('')
            setTitle('')
        } catch (err) {
            console.error('Generation failed', err)
            setError('Failed to generate audio. Please try again.')
            setStep('text')
        }
    }

    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
            padding: '1rem'
        }} onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '680px',
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    color: '#d6d3d1'
                }}
            >
                {/* Header */}
                <div style={{ padding: '2.5rem 2.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 500, fontFamily: 'var(--font-serif)', color: '#fff', margin: 0 }}>Create Audio Artifact</h2>
                        <p style={{ color: '#71717a', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
                            {step === 'voice' ? 'Select a voice persona.' : step === 'text' ? 'Write the script.' : 'Forging artifact...'}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#57534e', cursor: 'pointer', transition: 'color 0.2s' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '2.5rem' }}>
                    {step === 'voice' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
                            {INWORLD_VOICES.map(voice => (
                                <button
                                    key={voice.id}
                                    onClick={() => setSelectedVoice(voice)}
                                    style={{
                                        padding: '1.25rem',
                                        background: selectedVoice.id === voice.id ? 'rgba(139, 92, 246, 0.1)' : '#292524',
                                        border: `1px solid ${selectedVoice.id === voice.id ? '#8b5cf6' : 'rgba(255,255,255,0.05)'}`,
                                        borderRadius: '16px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ fontWeight: 600, color: '#e7e5e4', fontSize: '1.1rem' }}>{voice.name}</div>
                                        {selectedVoice.id === voice.id && <Sparkles size={16} color="#8b5cf6" />}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#a8a29e' }}>{voice.category}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'text' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', color: '#a8a29e', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Artifact Title</label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Intro Narration"
                                    style={{
                                        width: '100%', padding: '1rem',
                                        background: '#292524',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        color: '#e7e5e4', outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#a8a29e', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Script Content</label>
                                <textarea
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    placeholder="What should the character say?"
                                    style={{
                                        width: '100%', height: '200px', padding: '1rem',
                                        background: '#292524',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '12px',
                                        color: '#e7e5e4', outline: 'none', resize: 'none',
                                        fontSize: '1rem', lineHeight: '1.6'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '2rem' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        position: 'absolute', inset: 0,
                                        borderRadius: '50%',
                                        border: '3px solid transparent',
                                        borderTopColor: '#8b5cf6',
                                        borderRightColor: '#ec4899'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 4,
                                    background: '#1c1917', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Sparkles size={32} color="#8b5cf6" />
                                </div>
                            </div>
                            <h3 style={{ color: '#e7e5e4', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>Forging Artifact...</h3>
                            <p style={{ color: '#a8a29e', fontSize: '1rem' }}>Synthesizing {selectedVoice.name}&apos;s voice.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step !== 'generating' && (
                    <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'rgba(0,0,0,0.1)' }}>
                        {step === 'text' && (
                            <button
                                onClick={() => setStep('voice')}
                                style={{
                                    padding: '0.9rem 2rem', color: '#a8a29e',
                                    background: '#292524', borderRadius: '50px',
                                    cursor: 'pointer', border: 'none', fontWeight: 600
                                }}
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => step === 'voice' ? setStep('text') : handleGenerate()}
                            disabled={step === 'text' && (!title || !text)}
                            style={{
                                padding: '0.9rem 2rem',
                                background: (step === 'text' && (!title || !text)) ? '#292524' : '#e7e5e4',
                                border: 'none', borderRadius: '50px',
                                color: (step === 'text' && (!title || !text)) ? '#57534e' : '#1c1917',
                                fontWeight: 600, cursor: 'pointer',
                                opacity: (step === 'text' && (!title || !text)) ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {step === 'voice' ? 'Next: Script' : 'Generate Artifact'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

const ArtifactCard = ({
    artifact,
    onClick,
    onDelete,
    onEdit,
    onRegenerate,
    onTogglePin
}: {
    artifact: Artifact;
    onClick: () => void;
    onDelete: (e: any) => void;
    onEdit: (e: any) => void;
    onRegenerate: (e: any) => void;
    onTogglePin: (e: any) => void;
}) => {
    const [showActions, setShowActions] = useState(false)

    return (
        <motion.div
            layout
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}
            style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '1.5rem',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            {/* Pin Indicator */}
            {artifact.pinned && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: '#8b5cf6',
                    zIndex: 1
                }}>
                    <Pin size={16} fill="#8b5cf6" />
                </div>
            )}

            <div onClick={onClick}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FileAudio color="white" size={24} />
                    </div>
                </div>

                <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {artifact.title}
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                        {artifact.voice.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                        {artifact.voice.category}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        <Calendar size={14} />
                        {artifact.date.toLocaleDateString()}
                    </div>
                    <div style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 600 }}>
                        View
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
                {showActions && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <button
                            onClick={onEdit}
                            title="Edit Name"
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#e7e5e4',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <Edit2 size={16} />
                        </button>

                        <button
                            onClick={onRegenerate}
                            title="Regenerate Speech"
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#e7e5e4',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <RotateCcw size={16} />
                        </button>

                        <button
                            onClick={onTogglePin}
                            title={artifact.pinned ? "Unpin" : "Pin"}
                            style={{
                                padding: '0.5rem',
                                background: artifact.pinned ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${artifact.pinned ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '8px',
                                color: artifact.pinned ? '#8b5cf6' : '#e7e5e4',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = artifact.pinned ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = artifact.pinned ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)'
                            }}
                        >
                            {artifact.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                        </button>

                        <button
                            onClick={onDelete}
                            title="Delete"
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        >
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const DeleteConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    artifactTitle
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    artifactTitle: string;
}) => {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
            padding: '1rem'
        }} onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '480px',
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    color: '#d6d3d1'
                }}
            >
                <div style={{ padding: '2.5rem' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <Trash2 size={28} color="#ef4444" />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 500, fontFamily: 'var(--font-serif)', color: '#fff', textAlign: 'center', marginBottom: '0.5rem' }}>Delete Artifact?</h2>
                    <p style={{ color: '#a8a29e', textAlign: 'center', marginBottom: '2rem' }}>
                        Are you sure you want to delete <strong style={{ color: '#e7e5e4' }}>&quot;{artifactTitle}&quot;</strong>? This action cannot be undone.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '1rem',
                                background: '#292524',
                                border: 'none', borderRadius: '50px',
                                color: '#e7e5e4', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            style={{
                                flex: 1, padding: '1rem',
                                background: '#ef4444',
                                border: 'none', borderRadius: '50px',
                                color: 'white', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const ViewArtifactModal = ({
    artifact,
    onClose
}: {
    artifact: Artifact;
    onClose: () => void;
}) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100)
        }

        const handleEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('ended', handleEnded)
        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [])

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            if (artifact.audioUrl === 'fallback') {
                // For fallback cards, use speech synthesis
                const u = new SpeechSynthesisUtterance(artifact.text)
                // try match voice (simple heuristic)
                const voices = speechSynthesis.getVoices()
                const voice = voices.find(v => v.name.includes(artifact.voice.name)) || voices[0]
                if (voice) u.voice = voice

                speechSynthesis.speak(u)
                // NOTE: Implementing full scrubbing for fallback synth is hard, simplifying for demo
                // Just toggle state for visual feedback
            } else {
                audioRef.current.play()
            }
        }
        setIsPlaying(!isPlaying)
    }

    const download = () => {
        if (artifact.audioUrl === 'fallback') return
        const link = document.createElement('a')
        link.href = artifact.audioUrl
        link.download = `${artifact.title.replace(/\s+/g, '_')}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
            padding: '1rem'
        }} onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: '900px', height: '600px',
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    display: 'flex',
                    overflow: 'hidden',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)',
                    position: 'relative',
                    color: '#d6d3d1'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        zIndex: 10, background: 'rgba(0,0,0,0.3)', borderRadius: '50%',
                        width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', color: 'white', cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                {/* Visual Side */}
                <div style={{ flex: '4', background: '#0f0f0f', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                    {/* Animated Visualizer Circle */}
                    <motion.button
                        onClick={togglePlay}
                        animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                            width: '120px', height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 80px rgba(139, 92, 246, 0.3)',
                            border: 'none', cursor: 'pointer',
                            zIndex: 2
                        }}
                    >
                        {isPlaying ? <Pause size={48} color="white" /> : <Play size={48} color="white" />}
                    </motion.button>
                </div>

                {/* Info Side */}
                <div style={{ flex: '5', padding: '3rem', display: 'flex', flexDirection: 'column', background: '#1c1917' }}>

                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {artifact.voice.name} • {artifact.voice.category}
                        </span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'var(--font-serif)', color: '#fff', margin: '0.5rem 0 1rem 0' }}>{artifact.title}</h2>

                        {/* Waveform / Progress */}
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                style={{ width: `${progress}%`, height: '100%', background: '#e7e5e4' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>
                            <span>{Math.floor(audioRef.current?.currentTime || 0)}s</span>
                            <span>Duration</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem' }} className="custom-scrollbar">
                        <p style={{ color: '#a8a29e', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
                            {artifact.text}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={togglePlay}
                            style={{
                                flex: 2, padding: '1rem',
                                background: '#e7e5e4',
                                border: 'none', borderRadius: '50px',
                                color: '#1c1917', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            {isPlaying ? 'Pause' : 'Play Artifact'}
                        </button>
                        <button
                            onClick={download}
                            style={{
                                flex: 1, padding: '1rem',
                                background: '#292524',
                                border: 'none', borderRadius: '50px',
                                color: '#e7e5e4', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            <Download size={18} />
                            Download
                        </button>
                    </div>

                    {artifact.audioUrl !== 'fallback' && (
                        <audio ref={audioRef} src={artifact.audioUrl} style={{ display: 'none' }} />
                    )}
                </div>
            </motion.div>
        </div>
    )
}

// --- Main Page ---

export default function AILibraryPage() {
    // Initial dummy data for visual pop
    const [artifacts, setArtifacts] = useState<Artifact[]>([
        {
            id: '1',
            title: 'Welcome Message',
            date: new Date(),
            voice: INWORLD_VOICES[0],
            text: "Welcome to the Founder's Route AI Library. Here you can generate incredible voice lines for your projects.",
            audioUrl: 'fallback'
        }
    ])
    const [isCreateOpen, setCreateOpen] = useState(false)
    const [viewArtifact, setViewArtifact] = useState<Artifact | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; artifactId: string | null; artifactTitle: string }>({ isOpen: false, artifactId: null, artifactTitle: '' })
    const [editingArtifact, setEditingArtifact] = useState<{ id: string; newTitle: string } | null>(null)

    const handleEdit = (artifact: Artifact, e: any) => {
        e.stopPropagation()
        const newTitle = prompt('Enter new title:', artifact.title)
        if (newTitle && newTitle.trim()) {
            setArtifacts(prev => prev.map(a =>
                a.id === artifact.id ? { ...a, title: newTitle.trim() } : a
            ))
        }
    }

    const handleRegenerate = async (artifact: Artifact, e: any) => {
        e.stopPropagation()
        // Regenerate the speech with the same text and voice
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: artifact.text,
                    voiceId: artifact.voice.id,
                    modelId: 'inworld-tts-1'
                })
            })
            const data = await response.json()

            let audioUrl = ''
            if (data.fallback || !data.success) {
                audioUrl = 'fallback'
            } else {
                audioUrl = `data:${data.contentType};base64,${data.audio}`
            }

            setArtifacts(prev => prev.map(a =>
                a.id === artifact.id ? { ...a, audioUrl, date: new Date() } : a
            ))
        } catch (err) {
            console.error('Regeneration failed', err)
        }
    }

    const handleTogglePin = (artifact: Artifact, e: any) => {
        e.stopPropagation()
        setArtifacts(prev => prev.map(a =>
            a.id === artifact.id ? { ...a, pinned: !a.pinned } : a
        ))
    }

    const handleDeleteClick = (artifact: Artifact, e: any) => {
        e.stopPropagation()
        setDeleteConfirm({ isOpen: true, artifactId: artifact.id, artifactTitle: artifact.title })
    }

    const handleDeleteConfirm = () => {
        if (deleteConfirm.artifactId) {
            setArtifacts(prev => prev.filter(a => a.id !== deleteConfirm.artifactId))
        }
    }

    return (
        <RouteGuard featureName="AI Library">
            <div className="layout-wrapper">
                <Sidebar />
                <main className="creative-studio-main" style={{ padding: '2rem', overflowY: 'auto' }}>

                    {/* Hero / Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h1 className="font-serif text-white" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>AI Library</h1>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>Manage and generate your voice artifacts.</p>
                        </div>
                        <button
                            onClick={() => setCreateOpen(true)}
                            style={{
                                padding: '1rem 2rem',
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
                            }}
                        >
                            <Plus size={20} />
                            Create Artifact
                        </button>
                    </div>

                    {/* Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {artifacts.map(artifact => (
                                <ArtifactCard
                                    key={artifact.id}
                                    artifact={artifact}
                                    onClick={() => setViewArtifact(artifact)}
                                    onDelete={(e) => handleDeleteClick(artifact, e)}
                                    onEdit={(e) => handleEdit(artifact, e)}
                                    onRegenerate={(e) => handleRegenerate(artifact, e)}
                                    onTogglePin={(e) => handleTogglePin(artifact, e)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Modals */}
                    <AnimatePresence>
                        {isCreateOpen && (
                            <CreateArtifactModal
                                isOpen={isCreateOpen}
                                onClose={() => setCreateOpen(false)}
                                onCreate={(newArtifact) => setArtifacts(prev => [newArtifact, ...prev])}
                            />
                        )}
                        {viewArtifact && (
                            <ViewArtifactModal
                                artifact={viewArtifact}
                                onClose={() => setViewArtifact(null)}
                            />
                        )}
                        {deleteConfirm.isOpen && (
                            <DeleteConfirmModal
                                isOpen={deleteConfirm.isOpen}
                                onClose={() => setDeleteConfirm({ isOpen: false, artifactId: null, artifactTitle: '' })}
                                onConfirm={handleDeleteConfirm}
                                artifactTitle={deleteConfirm.artifactTitle}
                            />
                        )}
                    </AnimatePresence>

                </main>
            </div>
        </RouteGuard>
    )
}
