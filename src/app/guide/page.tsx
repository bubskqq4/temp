'use client'

import React from 'react'
import {
    HelpCircle,
    Sparkles,
    Zap,
    Timer,
    BookOpen,
    Keyboard,
    Focus,
    Rocket,
    Lightbulb,
    ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/Sidebar'

const GuidePage = () => {
    const tips = [
        {
            icon: <Sparkles size={20} style={{ color: '#eab308' }} />,
            title: "Rapid Spark Capture",
            description: "Feeling inspired? Don't let the idea escape. Use the Inbox (Shortcut: 'I') to quickly dump thoughts. You can dress them up and convert them into projects or tasks later.",
            category: "Efficiency"
        },
        {
            icon: <Timer size={20} style={{ color: '#3b82f6' }} />,
            title: "The 25-Minute Sprint",
            description: "Use the built-in Pomodoro timer in the sidebar to maintain deep focus. 25 minutes of uninterrupted work followed by a 5-minute breather is the founder's secret weapon.",
            category: "Productivity"
        },
        {
            icon: <Zap size={20} style={{ color: '#a855f7' }} />,
            title: "AI Project Architect",
            description: "Stuck on the starting line? Head to 'AI Companion' and describe your vision. It will help you break down complex goals into actionable milestones and tasks.",
            category: "Strategy"
        },
        {
            icon: <BookOpen size={20} style={{ color: '#22c55e' }} />,
            title: "Your Second Brain",
            description: "The Knowledge Base isn't just for notes. Use it to store competitor research, design inspiration links, and strategy docs. Tag everything to find it in seconds.",
            category: "Knowledge"
        },
        {
            icon: <Focus size={20} style={{ color: '#ef4444' }} />,
            title: "Daily Rituals",
            description: "Consistency builds empires. Mark your Daily Rituals in the sidebar every day. Whether it's deep work, reading, or exercise—stack those wins.",
            category: "Habits"
        }
    ]

    const shortcuts = [
        { key: "G + D", action: "Go to Dashboard" },
        { key: "G + I", action: "Go to Inbox" },
        { key: "G + P", action: "Go to Projects" },
        { key: "N", action: "Create New Task/Spark" },
        { key: "/", action: "Global Search" },
        { key: "Esc", action: "Close Modals/Menus" },
    ]

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="dashboard-main overflow-y-auto custom-scrollbar">
                <header className="guide-header animate-fade-in">
                    <div className="label-row">
                        <div className="icon-box">
                            <HelpCircle size={20} color="white" />
                        </div>
                        <span className="section-label">The Handbook</span>
                    </div>
                    <h1 className="main-title font-serif italic">Mastering FounderRoute</h1>
                    <p className="main-subtitle">
                        Welcome to the command center. Here are the tips, tricks, and shortcuts used by top founders to build their empires efficiently.
                    </p>
                </header>

                <div className="tips-grid">
                    {tips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="tip-card card glass group"
                        >
                            <div className="tip-header">
                                <div className="tip-icon-bg">
                                    {tip.icon}
                                </div>
                                <span className="tip-cat">
                                    {tip.category}
                                </span>
                            </div>
                            <div className="tip-body">
                                <h3 className="tip-title">{tip.title}</h3>
                                <p className="tip-description">
                                    {tip.description}
                                </p>
                            </div>
                            <div className="tip-footer">
                                LEARN MORE <ArrowRight size={12} />
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="tip-card card glass empty-card"
                    >
                        <div className="bulb-icon">
                            <Lightbulb size={32} color="rgba(234, 179, 8, 0.5)" />
                        </div>
                        <h3 className="empty-title italic">Got a tip?</h3>
                        <p className="empty-desc">
                            Submit your own mastery tips to the community.
                        </p>
                        <button className="submit-btn">
                            Submit Suggestion
                        </button>
                    </motion.div>
                </div>

                <div className="bottom-sections">
                    <section className="shortcuts-section">
                        <div className="section-head">
                            <Keyboard size={20} color="rgba(255,255,255,0.4)" />
                            <h2 className="section-title font-serif">Power User Shortcuts</h2>
                        </div>
                        <div className="shortcuts-list">
                            {shortcuts.map((s, i) => (
                                <div key={i} className="shortcut-item">
                                    <span className="shortcut-action">{s.action}</span>
                                    <kbd className="shortcut-key">
                                        {s.key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="pro-section">
                        <div className="section-head">
                            <Rocket size={20} color="rgba(255,255,255,0.4)" />
                            <h2 className="section-title font-serif">Pro Mode</h2>
                        </div>
                        <div className="pro-card">
                            <div className="pro-content">
                                <h4 className="pro-title">Unlock FounderRoute Pro</h4>
                                <p className="pro-desc">
                                    Get unlimited AI projects, custom ritual tracking, and advanced analytics.
                                </p>
                                <button className="pro-btn">
                                    Upgrade Now
                                </button>
                            </div>
                            <div className="pro-glow" />
                        </div>
                    </section>
                </div>

                <footer className="guide-footer">
                    <div className="footer-top">
                        <div className="footer-logo">
                            <div className="logo-sq">
                                <span className="logo-plus">+</span>
                            </div>
                            <span className="logo-text">Founder's Route</span>
                        </div>
                        <div className="footer-links">
                            <a href="#" className="footer-link">Docs</a>
                            <a href="#" className="footer-link">Support</a>
                            <a href="#" className="footer-link">Changelog</a>
                            <a href="#" className="footer-link">Privacy</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="copy">© 2025 FounderRoute International. All rights reserved.</p>
                    </div>
                </footer>
            </main>

            <style jsx>{`
                .layout-wrapper {
                    display: flex;
                    min-height: 100vh;
                    background: var(--background);
                }

                .dashboard-main {
                    flex: 1;
                    padding: 4rem 2.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                @media (max-width: 768px) {
                    .dashboard-main {
                        padding: 6rem 1.5rem 2rem 1.5rem;
                    }
                }

                .guide-header {
                    margin-bottom: 3rem;
                }

                .label-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .icon-box {
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                }

                .section-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--muted-foreground);
                }

                .main-title {
                    font-size: clamp(2.5rem, 5vw, 4rem);
                    color: white;
                    margin-bottom: 1rem;
                    line-height: 1.1;
                }

                .main-subtitle {
                    color: var(--muted-foreground);
                    font-size: 1.125rem;
                    max-width: 600px;
                    line-height: 1.6;
                }

                .tips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }

                .tip-card {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .tip-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
                }

                .tip-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .tip-icon-bg {
                    padding: 0.75rem;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .tip-cat {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--muted-foreground);
                }

                .tip-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .tip-description {
                    color: var(--muted-foreground);
                    font-size: 0.875rem;
                    line-height: 1.6;
                }

                .tip-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 10px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.3);
                    transition: color 0.2s ease;
                    cursor: pointer;
                }

                .tip-card:hover .tip-footer {
                    color: white;
                }

                .empty-card {
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    border-style: dashed;
                    background: rgba(255, 255, 255, 0.01);
                }

                .bulb-icon {
                    padding: 1rem;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    margin-bottom: 0.5rem;
                }

                .empty-title {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.6);
                }

                .empty-desc {
                    font-size: 0.875rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                .submit-btn {
                    margin-top: 1rem;
                    padding: 0.5rem 1.5rem;
                    border-radius: 999px;
                    background: white;
                    color: black;
                    font-weight: 700;
                    font-size: 0.875rem;
                    transition: transform 0.2s ease;
                }

                .submit-btn:hover {
                    transform: scale(1.05);
                }

                .bottom-sections {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 3rem;
                    margin-bottom: 6rem;
                }

                @media (max-width: 1024px) {
                    .bottom-sections {
                        grid-template-columns: 1fr;
                    }
                }

                .section-head {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 1.5rem;
                    color: white;
                }

                .shortcuts-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1rem;
                }

                .shortcut-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: background 0.2s ease;
                }

                .shortcut-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                }

                .shortcut-action {
                    color: var(--muted-foreground);
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .shortcut-key {
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    font-family: monospace;
                    font-size: 0.75rem;
                }

                .pro-card {
                    position: relative;
                    padding: 2rem;
                    border-radius: 24px;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                }

                .pro-content {
                    position: relative;
                    z-index: 2;
                }

                .pro-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .pro-desc {
                    font-size: 0.875rem;
                    color: var(--muted-foreground);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }

                .pro-btn {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 12px;
                    background: white;
                    color: black;
                    font-weight: 800;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }

                .pro-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }

                .pro-glow {
                    position: absolute;
                    top: -20%;
                    right: -20%;
                    width: 150px;
                    height: 150px;
                    background: rgba(168, 85, 247, 0.2);
                    filter: blur(60px);
                    border-radius: 50%;
                }

                .guide-footer {
                    margin-top: 4rem;
                    padding: 3rem 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .footer-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                @media (max-width: 640px) {
                    .footer-top {
                        flex-direction: column;
                        gap: 2rem;
                        text-align: center;
                    }
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .logo-sq {
                    width: 24px;
                    height: 24px;
                    background: white;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(-45deg);
                }

                .logo-plus {
                    color: black;
                    font-weight: 800;
                    font-size: 14px;
                    transform: rotate(45deg);
                }

                .logo-text {
                    font-weight: 800;
                    color: white;
                    letter-spacing: -0.02em;
                }

                .footer-links {
                    display: flex;
                    gap: 1.5rem;
                }

                .footer-link {
                    font-size: 0.875rem;
                    color: var(--muted-foreground);
                    transition: color 0.2s ease;
                }

                .footer-link:hover {
                    color: white;
                }

                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .copy {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.2);
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }

                .glass {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                }
            `}</style>
        </div>
    )
}

export default GuidePage
