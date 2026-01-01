'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { MessageSquare, Star, Send, X, CheckCircle2 } from 'lucide-react'

export default function FeedbackPage() {
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this to a backend or Supabase
        console.log({ rating, feedback })
        setIsSubmitted(true)
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Feedback</h1>
                        <p>Help us refine the route to greatness.</p>
                    </div>
                </header>

                <div className="max-w-2xl mx-auto mt-12">
                    {!isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="project-card"
                            style={{ padding: '3rem' }}
                        >
                            <div className="leaf-icon-container" style={{ margin: '0 auto 2rem', width: '64px', height: '64px' }}>
                                <MessageSquare size={32} color="#f97316" />
                            </div>

                            <h2 className="font-serif text-center" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Vision Matters</h2>
                            <p className="text-zinc-400 text-center mb-12">Every detail counts. Tell us how we can make Founder's Route more powerful for you.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="field-section">
                                    <label>EXPERIENCE RATING</label>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0 2.5rem' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                style={{
                                                    color: star <= rating ? '#eab308' : '#3f3f46',
                                                    transition: 'all 0.2s transform'
                                                }}
                                                className="hover:scale-110"
                                            >
                                                <Star size={32} fill={star <= rating ? '#eab308' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="field-section">
                                    <label>DETAILED THOUGHTS</label>
                                    <textarea
                                        className="premium-textarea"
                                        placeholder="What's working? What's missing? Be unfiltered."
                                        rows={6}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                        style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem' }}
                                    />
                                </div>

                                <button type="submit" className="submit-task-btn w-full justify-center mt-8" style={{ height: '56px', fontSize: '1rem' }}>
                                    <Send size={18} />
                                    <span>Transmit Feedback</span>
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="project-card text-center"
                            style={{ padding: '5rem 3rem' }}
                        >
                            <div className="flex justify-center mb-6">
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                    <CheckCircle2 size={48} />
                                </div>
                            </div>
                            <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Feedback Received</h2>
                            <p className="text-zinc-500 mb-8">Your insights have been logged. We build for founders, by listening to founders.</p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-zinc-300 hover:text-white transition-colors"
                            >
                                Submit another response
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .max-w-2xl { max-width: 42rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .mt-12 { margin-top: 3rem; }
                .mt-8 { margin-top: 2rem; }
                .mb-12 { margin-bottom: 3rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .text-center { text-align: center; }
                .w-full { width: 100%; }
                .justify-center { justify-content: center; }
            `}</style>
        </div>
    )
}
