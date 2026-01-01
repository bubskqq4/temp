'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Code, Globe, ArrowLeft, Terminal, GitBranch, GitMerge, Lock, Unlock } from 'lucide-react'

export default function GithubRoadmapPage() {
    return (
        <div className="roadmap-root">
            <div className="bg-decor">
                <div className="mesh blue-mesh" />
                <div className="mesh indigo-mesh" />
            </div>

            <nav className="nav">
                <div className="nav-container">
                    <Link href="/" className="back-link">
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </Link>
                    <div className="nav-logo">
                        <Github size={24} />
                        <span className="logo-text">OSS ROADMAP</span>
                    </div>
                </div>
            </nav>

            <main className="main">
                <div className="content-container">
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="header"
                    >
                        <div className="github-badge">
                            <Github size={14} />
                            <span>GITHUB.COM/FOUNDERSROUTE</span>
                        </div>
                        <h1 className="title">The Path to <br /> <span className="title-gradient">Open Source.</span></h1>
                        <p className="subtitle">
                            We believe the future of planning and productivity belongs to the community.
                            Founder's Route is embarking on a phased transition to become a fully open-source ecosystem.
                        </p>
                    </motion.header>

                    <div className="timeline">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="timeline-item"
                        >
                            <div className="time-marker">
                                <div className="marker-dot" />
                                <div className="marker-line" />
                            </div>
                            <div className="time-content">
                                <div className="time-label">NEXT 6 MONTHS</div>
                                <h2 className="time-title">Partially Open Source</h2>
                                <p className="time-desc">
                                    Release of core UI components, styling engine, and non-sensitive logic modules.
                                    Allowing developers to build extensions and custom themes for the Founder's Route cockpit.
                                </p>
                                <div className="module-grid">
                                    <div className="module-item"><Code size={14} /> UI Library</div>
                                    <div className="module-item"><Terminal size={14} /> CLI Tools</div>
                                    <div className="module-item"><GitBranch size={14} /> Extension API</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="timeline-item"
                        >
                            <div className="time-marker">
                                <div className="marker-dot pulse" />
                            </div>
                            <div className="time-content">
                                <div className="time-label highlight">WITHIN YEARS</div>
                                <h2 className="time-title">Fully Open Source</h2>
                                <p className="time-desc">
                                    The complete Founder's Route stack—including the local-first database architecture,
                                    AI orchestration layer, and project sandboxes—will be available under an open-source license.
                                </p>
                                <div className="status-badge"><Unlock size={14} /> Public Repository</div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="vision-card"
                    >
                        <div className="vision-glow" />
                        <div className="vision-content">
                            <GitMerge size={32} className="vision-icon" />
                            <h3>Why Open Source?</h3>
                            <p>
                                Transparency and community ownership are the ultimate safeguards for your personal data and workflows.
                                We want Founder's Route to be a permanent piece of infrastructure for the internet's architects.
                            </p>
                        </div>
                    </motion.section>
                </div>
            </main>

            <style jsx>{`
                .roadmap-root {
                    position: relative;
                    min-height: 100vh;
                    background: #030303;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                }

                .bg-decor {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                }

                .mesh {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(120px);
                    opacity: 0.15;
                }

                .blue-mesh {
                    top: -10%;
                    left: -10%;
                    height: 50%;
                    width: 50%;
                    background: #3b82f6;
                }

                .indigo-mesh {
                    bottom: -10%;
                    right: -10%;
                    height: 50%;
                    width: 50%;
                    background: #4f46e5;
                }

                .nav {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    padding: 1.5rem;
                    background: rgba(3, 3, 3, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .nav-container {
                    max-width: 64rem;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #a1a1aa;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: white;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                }

                .logo-text {
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    font-size: 0.75rem;
                }

                .main {
                    position: relative;
                    z-index: 10;
                    padding: 4rem 1.5rem;
                }

                .content-container {
                    max-width: 48rem;
                    margin: 0 auto;
                }

                .header {
                    text-align: center;
                    margin-bottom: 6rem;
                }

                .github-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    color: #a1a1aa;
                    margin-bottom: 2rem;
                }

                .title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    letter-spacing: -0.05em;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                }

                .title-gradient {
                    background: linear-gradient(135deg, #fff 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .subtitle {
                    font-size: 1.25rem;
                    color: #a1a1aa;
                    line-height: 1.6;
                    max-width: 36rem;
                    margin: 0 auto;
                }

                .timeline {
                    position: relative;
                    margin-bottom: 6rem;
                }

                .timeline-item {
                    display: flex;
                    gap: 2rem;
                    padding-bottom: 4rem;
                }

                .time-marker {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 2rem;
                }

                .marker-dot {
                    width: 0.75rem;
                    height: 0.75rem;
                    border-radius: 99px;
                    background: #3b82f6;
                    border: 2px solid #030303;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                    z-index: 2;
                }

                .marker-dot.pulse {
                    background: #6366f1;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
                }

                .marker-line {
                    width: 1px;
                    flex-grow: 1;
                    background: linear-gradient(to bottom, #3b82f6, rgba(59, 130, 246, 0));
                    margin-top: 0.5rem;
                }

                .time-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    color: #3b82f6;
                    margin-bottom: 0.5rem;
                }

                .time-label.highlight {
                    color: #6366f1;
                }

                .time-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .time-desc {
                    color: #d4d4d8;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                }

                .module-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                .module-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 0.75rem;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #a1a1aa;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    color: #818cf8;
                    font-size: 0.875rem;
                    font-weight: 700;
                }

                .vision-card {
                    position: relative;
                    padding: 3rem;
                    border-radius: 32px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                    text-align: center;
                }

                .vision-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
                }

                .vision-content {
                    position: relative;
                    z-index: 1;
                }

                .vision-icon {
                    color: #3b82f6;
                    margin-bottom: 1.5rem;
                }

                .vision-card h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .vision-card p {
                    color: #a1a1aa;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    )
}
