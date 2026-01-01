'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { Mail, Globe, MessageCircle, ArrowUpRight, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main">
                <header className="projects-header">
                    <div className="projects-title-group">
                        <h1 className="font-serif">Contact Us</h1>
                        <p>Direct line to the architects.</p>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div>
                            <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Get in touch.</h2>
                            <p className="text-zinc-400 leading-relaxed mb-8">
                                Whether you're scaling a startup or organizing your life's work, we're here to support your journey. Reach out for partnership inquiries, technical support, or just to share your success.
                            </p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {[
                                { icon: Mail, label: 'Email', value: 'hello@foundersroute.com', href: 'mailto:hello@foundersroute.com' },
                                { icon: MessageCircle, label: 'Community', value: 'Join our Discord', href: '#' },
                                { icon: Globe, label: 'Enterprise', value: 'Book a demo', href: '#' },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="project-card flex items-center justify-between group"
                                    style={{ padding: '1.25rem 1.5rem', textDecoration: 'none' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <item.icon size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#52525b', textTransform: 'uppercase' }}>{item.label}</div>
                                            <div style={{ fontSize: '1rem', color: '#a1a1aa' }}>{item.value}</div>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={18} className="text-zinc-700 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {!isSubmitted ? (
                            <div className="project-card" style={{ padding: '2.5rem' }}>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div className="field-section">
                                        <label>YOUR NAME</label>
                                        <input className="premium-textarea" placeholder="Founder Name" required style={{ minHeight: '44px' }} />
                                    </div>
                                    <div className="field-section">
                                        <label>WORK EMAIL</label>
                                        <input className="premium-textarea" type="email" placeholder="name@company.com" required style={{ minHeight: '44px' }} />
                                    </div>
                                    <div className="field-section">
                                        <label>SUBJECT</label>
                                        <select className="premium-textarea" style={{ minHeight: '44px', width: '100%', appearance: 'none', background: 'rgba(255,255,255,0.03)' }}>
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Partnership</option>
                                            <option>Billing</option>
                                        </select>
                                    </div>
                                    <div className="field-section">
                                        <label>MESSAGE</label>
                                        <textarea className="premium-textarea" placeholder="Tell us more..." rows={5} required />
                                    </div>
                                    <button type="submit" className="submit-task-btn w-full justify-center mt-4" style={{ height: '52px' }}>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="project-card text-center" style={{ padding: '4rem 2rem' }}>
                                <div className="flex justify-center mb-6">
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                        <CheckCircle2 size={32} />
                                    </div>
                                </div>
                                <h3 className="font-serif" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Message Transmitted</h3>
                                <p className="text-zinc-500 mb-8">We've received your inquiry. A member of our team will be in touch within 24 hours.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-zinc-600 hover:text-white transition-colors text-sm"
                                >
                                    Submit another message
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            <style jsx>{`
                .max-w-5xl { max-width: 64rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .mt-12 { margin-top: 3rem; }
                .mt-4 { margin-top: 1rem; }
                .mb-8 { margin-bottom: 2rem; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-col-width: 768px) {
                    .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                .gap-12 { gap: 3rem; }
                .gap-8 { gap: 2rem; }
                .gap-6 { gap: 1.5rem; }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .items-center { align-items: center; }
                .justify-between { justify-content: space-between; }
                .text-zinc-400 { color: #a1a1aa; }
                .text-zinc-500 { color: #71717a; }
                .text-zinc-600 { color: #52525b; }
                .text-zinc-700 { color: #3f3f46; }
                .text-center { text-align: center; }
            `}</style>
        </div>
    )
}
