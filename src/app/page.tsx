'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
    LayoutGrid,
    Inbox,
    Plus,
    Sparkles,
    Github,
    ChevronDown,
    Command,
    Cpu,
    ArrowRight,
    Code,
    Briefcase,
    Heart,
    Quote,
    Shield,
    Zap,
    Lock,
    CloudOff,
    MessageSquare,
    HelpCircle,
    Check,
    X,
    ExternalLink,
    Activity,
    Users
} from 'lucide-react'

// Components
const BentoCard = ({ icon: Icon, title, description, className, delay = 0 }: any) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`bento-card ${className}`}
        >
            <div className="bento-glow" />
            <div className="bento-content">
                <div className="bento-icon">
                    <Icon size={24} />
                </div>
                <h3 className="bento-title">{title}</h3>
                <p className="bento-desc">{description}</p>
            </div>
            <div className="bento-accent-glow" />
            <style jsx>{`
                .bento-card {
                    position: relative;
                    overflow: hidden;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(255, 255, 255, 0.02);
                    padding: 2rem;
                    transition: background 0.3s ease;
                }
                .bento-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                }
                .bento-glow {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent, transparent);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                .bento-card:hover .bento-glow {
                    opacity: 1;
                }
                .bento-content {
                    position: relative;
                    z-index: 10;
                }
                .bento-icon {
                    margin-bottom: 1rem;
                    display: inline-flex;
                    height: 3rem;
                    width: 3rem;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    transition: all 0.5s ease;
                }
                .bento-card:hover .bento-icon {
                    transform: scale(1.1);
                    background: rgba(255, 255, 255, 0.1);
                }
                .bento-title {
                    margin-bottom: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    color: white;
                }
                .bento-desc {
                    font-size: 0.875rem;
                    line-height: 1.5;
                    color: #a1a1aa;
                    transition: color 0.3s ease;
                }
                .bento-card:hover .bento-desc {
                    color: #d4d4d8;
                }
                .bento-accent-glow {
                    position: absolute;
                    right: -1rem;
                    bottom: -1rem;
                    height: 6rem;
                    width: 6rem;
                    border-radius: 9999px;
                    background: rgba(59, 130, 246, 0.1);
                    filter: blur(24px);
                    opacity: 0;
                    transition: opacity 0.7s ease;
                }
                .bento-card:hover .bento-accent-glow {
                    opacity: 1;
                }
            `}</style>
        </motion.div>
    )
}

const Nav = () => (
    <nav className="nav-container">
        <div className="nav-blur-box">
            <div className="nav-logo">
                <div className="logo-sq">
                    <Plus size={16} className="logo-plus" />
                </div>
                <span className="logo-text">FOUNDER'S ROUTE</span>
            </div>

            <div className="nav-links">
                <a href="#features" className="nav-link">Features</a>
                <a href="#methodology" className="nav-link">Methodology</a>
                <Link href="/plans" className="nav-link">Pricing</Link>
                <div className="nav-sep" />
                <Link href="/github" className="nav-badge">
                    <Github size={14} />
                    <span>OSS Roadmap</span>
                </Link>
            </div>

            <div className="nav-actions">
                <Link href="/login" className="nav-link">Sign in</Link>
                <Link href="/register" className="nav-cta">
                    <span>Get Started</span>
                    <ArrowRight size={14} className="cta-arrow" />
                </Link>
            </div>
        </div>
        <style jsx>{`
            .nav-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 100;
                padding: 2rem 1.5rem;
            }
            .nav-blur-box {
                margin: 0 auto;
                max-width: 80rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 9999px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.4);
                padding: 0.75rem 2rem;
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
            }
            .nav-logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .logo-sq {
                display: flex;
                height: 2rem;
                width: 2rem;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                background: white;
                transform: rotate(-45deg);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            }
            .logo-plus {
                color: black;
                transform: rotate(45deg);
            }
            .logo-text {
                font-size: 1.125rem;
                font-weight: 800;
                letter-spacing: -0.05em;
                color: white;
            }
            .nav-links {
                display: none;
                align-items: center;
                gap: 2rem;
            }
            @media (min-width: 768px) {
                .nav-links {
                    display: flex;
                }
            }
            .nav-link {
                font-size: 0.875rem;
                font-weight: 500;
                color: #a1a1aa;
                transition: color 0.2s ease;
            }
            .nav-link:hover {
                color: white;
            }
            .nav-sep {
                height: 1rem;
                width: 1px;
                background: rgba(255, 255, 255, 0.1);
            }
            .nav-badge {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: #a1a1aa;
                transition: color 0.2s ease;
            }
            .nav-badge:hover {
                color: white;
            }
            .nav-actions {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
            .nav-cta {
                position: relative;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                overflow: hidden;
                border-radius: 9999px;
                background: white;
                padding: 0.5rem 1.5rem;
                font-size: 0.875rem;
                font-bold: 700;
                color: black;
                transition: all 0.2s ease;
            }
            .nav-cta:hover {
                transform: scale(1.05);
            }
            .nav-cta:active {
                transform: scale(0.95);
            }
            .cta-arrow {
                transition: transform 0.2s ease;
            }
            .nav-cta:hover .cta-arrow {
                transform: translateX(2px);
            }
        `}</style>
    </nav>
)

export default function LandingPage() {
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

    return (
        <div className="page-root grain">
            <Nav />

            {/* Mesh Background */}
            <div className="bg-decor">
                <div className="mesh blue-mesh" />
                <div className="mesh indigo-mesh" />
                <div className="mesh purple-mesh" />
            </div>

            {/* Hero Section */}
            <header ref={heroRef} className="hero">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="beta-pill"
                >
                    <div className="pill-tag">New</div>
                    <span className="pill-text">Private Beta v2.0 is officially live</span>
                    <ChevronDown size={14} className="pill-icon" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-title font-serif italic"
                >
                    Elite Systems for <br />
                    <span className="title-gradient not-italic">Visionary Founders.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-subtitle"
                >
                    Founder's Route is the ultimate planner and integrated OS for the modern architect.
                    Capture sparks, master rituals, and orchestrate projects within a high-fidelity command center.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="hero-btns"
                >
                    <Link href="/register" className="btn-large-primary">
                        <span>Access the Beta</span>
                        <ArrowRight size={20} />
                    </Link>
                    <a href="#features" className="btn-ghost">
                        Explore Features
                    </a>
                </motion.div>

                {/* Main Mockup */}
                <motion.div
                    style={{ opacity, scale, y }}
                    className="mockup-container"
                >
                    <div className="mockup-frame shadow-effect">
                        <div className="mockup-gradient-overlay" />
                        <img
                            src="/dashboard-preview-new.png"
                            alt="Elite Dashboard Interface"
                            className="mockup-img"
                        />
                    </div>
                </motion.div>
            </header>

            {/* Features (Bento Grid) */}
            <section id="features" className="features">
                <div className="section-container">
                    <header className="features-header">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="features-title"
                        >
                            Engineered for <br />
                            <span className="title-muted">Peak Performance.</span>
                        </motion.h2>
                    </header>

                    <div className="large-bento-grid">
                        <BentoCard
                            icon={LayoutGrid}
                            title="The Cockpit"
                            description="A real-time overview of your life's trajectory. Monitor trajectory, velocity, and health."
                            className="span-8"
                        />
                        <BentoCard
                            icon={Inbox}
                            title="Flash Inbox"
                            description="Zero friction thought capture."
                            className="span-4"
                            delay={0.1}
                        />
                        <BentoCard
                            icon={Command}
                            title="Command Center"
                            description="Hyper-integrated OS with project sandboxes and resource archives."
                            className="span-4"
                            delay={0.2}
                        />
                        <BentoCard
                            icon={Cpu}
                            title="AI Integration"
                            description="LLM-powered brainstorming and autonomous sorting."
                            className="span-8"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Made For Section */}
            <section className="made-for">
                <div className="section-container">
                    <header className="made-for-header">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="section-label"
                        >
                            BUILT FOR EVERY VISION
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="made-for-title"
                        >
                            Designed for those who <br />
                            <span className="title-muted">think differently.</span>
                        </motion.h2>
                    </header>

                    <div className="made-for-grid">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="made-for-card"
                        >
                            <div className="card-icon"><Code size={32} /></div>
                            <h3>Indie Coders</h3>
                            <p>The ultimate life planner for your development journey. Capture gits of thought, manage logic, and maintain total flow state.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="made-for-card"
                        >
                            <div className="card-icon"><Briefcase size={32} /></div>
                            <h3>Small Businesses</h3>
                            <p>A scalable planner OS for your enterprise. Track velocity, ritualize growth, and maintain crystal clear project health.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="made-for-card highlight"
                        >
                            <div className="card-icon"><Heart size={32} /></div>
                            <h3>Inclusive by Design</h3>
                            <p>Radically intuitive. Our high-fidelity interface is built for ease of use, providing a friction-less experience for users with disabilities.</p>
                            <div className="accessibility-badge">Free for disabled users</div>
                        </motion.div>
                    </div>

                    {/* Accessibility Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="accessibility-note"
                    >
                        <p>
                            <Sparkles size={14} className="sparkle-icon" />
                            Mission Driven: We believe in equal opportunity. <strong>Contact us with proof of disability to receive any plan 100% free, forever.</strong>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Methodology */}
            <section id="methodology" className="methodology">
                <div className="section-container">
                    <div className="method-layout">
                        <div className="method-text">
                            <span className="section-label">THE PHILOSOPHY</span>
                            <h2 className="method-title">
                                More than a tool. <br />
                                A system of <span className="italic font-serif method-title-muted">ascension.</span>
                            </h2>
                            <p className="method-quote">
                                "The quality of your output is limited by the intentionality of your environment."
                            </p>

                            <div className="method-steps">
                                {[
                                    { step: "01", title: "Capture sparks", desc: "Remove friction between thought and storage." },
                                    { step: "02", title: "Process with intent", desc: "Never let a good idea die in a messy list." },
                                    { step: "03", title: "Execute with focus", desc: "Show only what matters for your current session." }
                                ].map((step, i) => (
                                    <div key={i} className="method-item">
                                        <div className="method-num tabular-nums">{step.step}</div>
                                        <div>
                                            <h4 className="method-item-title">{step.title}</h4>
                                            <p className="method-item-desc">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="method-visual">
                            <div className="visual-orbit">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="orbit-outer"
                                >
                                    <div className="outer-dot" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                    className="orbit-inner"
                                >
                                    <div className="inner-dot" />
                                </motion.div>
                                <div className="center-plus">
                                    <Plus className="plus-icon" size={48} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. Testimonials: The Visionaries */}
            <section className="testimonials">
                <div className="section-container">
                    <header className="section-header-center">
                        <span className="section-label">PEER REVIEW</span>
                        <h2 className="section-title-sm">Trusted by the next <br /> generation of <span className="italic font-serif">architects.</span></h2>
                    </header>
                    <div className="testimonials-grid">
                        {[
                            { name: "Julian Rossi", role: "Indie Founder", quote: "The only system that actually keeps up with my brain. It's not a tool, it's an extension of my consciousness." },
                            { name: "Elena Chen", role: "Creative Director", quote: "Finally, a planner that values aesthetic as much as utility. It's the most beautiful piece of software I own." },
                            { name: "Marcus Thorne", role: "Systems Engineer", quote: "The latency is non-existent. For someone who lives in flow state, Founder's Route is the only choice." }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="testimonial-card"
                            >
                                <Quote size={24} className="quote-icon" />
                                <p className="testimonial-text">"{t.quote}"</p>
                                <div className="testimonial-meta">
                                    <div className="testimonial-author">{t.name}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Performance: Engineered for Speed */}
            <section className="performance">
                <div className="section-container">
                    <div className="performance-layout">
                        <div className="performance-metrics">
                            <div className="metric-box">
                                <div className="metric-value">0ms</div>
                                <div className="metric-label">Input Latency</div>
                            </div>
                            <div className="metric-box">
                                <div className="metric-value">1.2kb</div>
                                <div className="metric-label">Payload Size</div>
                            </div>
                            <div className="metric-box">
                                <div className="metric-value">100</div>
                                <div className="metric-label">Lighthouse Score</div>
                            </div>
                        </div>
                        <div className="performance-text">
                            <span className="section-label">TECHNICAL EXCELLENCE</span>
                            <h2 className="method-title">Built for <br /> <span className="title-gradient">instantaneous</span> capture.</h2>
                            <p className="method-item-desc">We've stripped away every millisecond of friction. Every interaction is local-first, ensuring your focus remains unbroken.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Privacy: Your Mind, Encrypted */}
            <section className="security">
                <div className="section-container security-card">
                    <div className="security-bg-glow" />
                    <div className="security-content">
                        <div className="security-icon-group">
                            <Lock size={40} className="lock-icon" />
                            <Shield size={60} className="shield-icon" />
                            <CloudOff size={40} className="cloud-icon" />
                        </div>
                        <h2 className="security-title">Zero-Knowledge <br /> Architecture.</h2>
                        <p className="security-desc">We don't want your data. Founder's Route uses end-to-end encryption with local-only storage options. You own the keys, you own the thoughts.</p>
                        <div className="security-badges">
                            <div className="s-badge"><Check size={14} /> E2EE Enabled</div>
                            <div className="s-badge"><Check size={14} /> Local First</div>
                            <div className="s-badge"><Check size={14} /> Private Sync</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Integrations: The Ecosystem */}
            <section className="integrations">
                <div className="section-container">
                    <div className="int-layout">
                        <div className="int-text">
                            <span className="section-label">ECOSYSTEM</span>
                            <h2 className="method-title">Orchestrate your <br /> entire stack.</h2>
                            <p className="method-item-desc">Founder's Route sits at the center of your workflow, pulling in what you need and pushing out clarity.</p>
                        </div>
                        <div className="int-grid">
                            {['Github', 'Supabase', 'Notion', 'Slack', 'Linear', 'Discord'].map((app, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="int-card"
                                >
                                    <span className="int-name">{app}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Pricing: Elite Tiers */}
            <section id="pricing" className="pricing">
                <div className="section-container">
                    <header className="section-header-center">
                        <span className="section-label">INVESTMENT</span>
                        <h2 className="section-title-sm">Choose your <br /> level of <span className="italic font-serif">mastery.</span></h2>
                    </header>
                    <div className="pricing-grid">
                        <div className="price-card">
                            <div className="p-tier">FOUNDER</div>
                            <div className="p-amount">$0<span className="p-period">/mo</span></div>
                            <ul className="p-features">
                                <li><Check size={14} /> Unlimited Planning</li>
                                <li><Check size={14} /> 3 Project Sandboxes</li>
                                <li><Check size={14} /> Local-first Capture</li>
                            </ul>
                            <Link href="/register" className="p-btn">Start Free</Link>
                        </div>
                        <div className="price-card featured">
                            <div className="p-badge">Most Popular</div>
                            <div className="p-tier">ARCHITECT</div>
                            <div className="p-amount">$19<span className="p-period">/mo</span></div>
                            <ul className="p-features">
                                <li><Check size={14} /> Everything in Founder</li>
                                <li><Check size={14} /> Unlimited Sandboxes</li>
                                <li><Check size={14} /> Private Cloud Sync</li>
                                <li><Check size={14} /> AI Companion Access</li>
                            </ul>
                            <Link href="/register" className="p-btn primary">Upgrade Now</Link>
                        </div>
                        <div className="price-card">
                            <div className="p-tier">SYSTEMS</div>
                            <div className="p-amount">$49<span className="p-period">/mo</span></div>
                            <ul className="p-features">
                                <li><Check size={14} /> Everything in Architect</li>
                                <li><Check size={14} /> Priority AI Tokens</li>
                                <li><Check size={14} /> API Access</li>
                                <li><Check size={14} /> Custom Subdomain</li>
                            </ul>
                            <Link href="/register" className="p-btn">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Comparison: The Superior Choice */}
            <section className="comparison">
                <div className="section-container">
                    <table className="comp-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th className="highlight-col">Founder's Route</th>
                                <th>Typical Apps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Latency</td>
                                <td className="highlight-col">Sub-1ms</td>
                                <td>150ms+</td>
                            </tr>
                            <tr>
                                <td>Offline Support</td>
                                <td className="highlight-col">Local-First</td>
                                <td>Cloud-Only</td>
                            </tr>
                            <tr>
                                <td>Design Quality</td>
                                <td className="highlight-col">Elite (Million Dollar)</td>
                                <td>Generic</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 7. FAQ: The Knowledge Base */}
            <section className="faq">
                <div className="section-container">
                    <header className="section-header-center">
                        <span className="section-label">RESOURCES</span>
                        <h2 className="section-title-sm">Frequently asked <br /> <span className="italic font-serif">questions.</span></h2>
                    </header>
                    <div className="faq-list">
                        {[
                            { q: "Is it really local-first?", a: "Yes. Every byte of data is stored on your device first, ensuring lightning speed and complete privacy." },
                            { q: "Can I cancel anytime?", a: "Absolutely. We believe in value-based retention, not lock-in contracts." },
                            { q: "How do I get my free disability plan?", a: "Simply email us at support@foundersroute.com with any verification, and we'll upgrade your account within 24 hours." }
                        ].map((item, i) => (
                            <details key={i} className="faq-item">
                                <summary className="faq-question">{item.q} <ChevronDown size={16} className="faq-icon" /></summary>
                                <div className="faq-answer">{item.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="cta-card group"
                >
                    <div className="cta-glow" />
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to build your <br /> legacy?</h2>
                        <p className="cta-desc">
                            Join a select group of founders defining the future. <br />
                            Private beta access is strictly limited.
                        </p>
                        <div className="cta-action">
                            <Link href="/register" className="btn-mega-dark">
                                <span>Secure Access</span>
                                <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            <footer className="footer">
                <div className="section-container footer-inner">
                    <div className="footer-logo">
                        <div className="footer-sq">
                            <Plus size={12} className="footer-plus" />
                        </div>
                        <span className="footer-logo-text">FOUNDER'S ROUTE</span>
                    </div>
                    <div className="footer-links">
                        <a href="#" className="footer-link">Twitter</a>
                        <a href="#" className="footer-link">GitHub</a>
                        <Link href="/guide" className="footer-link">User Guide</Link>
                        <a href="#" className="footer-link">Discord</a>
                    </div>
                    <div className="footer-copy">
                        &copy; 2026 Founder's Route Systems.
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                
                .page-root {
                    position: relative;
                    min-height: 100vh;
                    background: #030303;
                    color: white;
                    overflow-x: hidden;
                }

                .bg-decor {
                    pointer-events: none;
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                }

                .mesh {
                    position: absolute;
                    border-radius: 9999px;
                    filter: blur(120px);
                }

                .blue-mesh {
                    top: -10%;
                    left: -10%;
                    height: 40%;
                    width: 40%;
                    background: rgba(59, 130, 246, 0.2);
                }

                .indigo-mesh {
                    bottom: 10%;
                    right: -5%;
                    height: 50%;
                    width: 50%;
                    background: rgba(79, 70, 229, 0.1);
                }

                .purple-mesh {
                    top: 20%;
                    right: 10%;
                    height: 30%;
                    width: 30%;
                    background: rgba(147, 51, 234, 0.1);
                }

                .hero {
                    position: relative;
                    display: flex;
                    min-height: 100vh;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding-top: 8rem;
                    padding-left: 1.5rem;
                    padding-right: 1.5rem;
                }

                .beta-pill {
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.25rem 1rem 0.25rem 0.25rem;
                    backdrop-filter: blur(24px);
                }

                .pill-tag {
                    border-radius: 9999px;
                    background: #3b82f6;
                    padding: 0.125rem 0.625rem;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .pill-text {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #d4d4d8;
                }

                .pill-icon {
                    color: #71717a;
                }

                .hero-title {
                    max-width: 60rem;
                    text-align: center;
                    font-size: clamp(3rem, 10vw, 8rem);
                    font-weight: 700;
                    letter-spacing: -0.05em;
                    line-height: 0.9;
                }

                .title-gradient {
                    background: linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0.4));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    margin-top: 2rem;
                    max-width: 40rem;
                    text-align: center;
                    font-size: 1.125rem;
                    line-height: 1.6;
                    color: #a1a1aa;
                }

                @media (min-width: 768px) {
                    .hero-subtitle {
                        font-size: 1.25rem;
                    }
                }

                .hero-btns {
                    margin-top: 3rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .hero-btns {
                        flex-direction: row;
                    }
                }

                .btn-large-primary {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-radius: 16px;
                    background: white;
                    padding: 1rem 2.5rem;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: black;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .btn-large-primary:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
                }

                .btn-ghost {
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #71717a;
                    transition: color 0.2s ease;
                }

                .btn-ghost:hover {
                    color: white;
                }

                .mockup-container {
                    position: relative;
                    margin-top: 6rem;
                    width: 100%;
                    max-width: 80rem;
                    padding: 0 1rem;
                    perspective: 1000px;
                }

                .mockup-frame {
                    position: relative;
                    overflow: hidden;
                    border-radius: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(24, 24, 27, 0.5);
                    padding: 0.5rem;
                    backdrop-filter: blur(24px);
                }

                .mockup-gradient-overlay {
                    position: absolute;
                    inset: 0;
                    bottom: 0;
                    z-index: 10;
                    height: 50%;
                    background: linear-gradient(to top, #030303, transparent);
                }

                .mockup-img {
                    width: 100%;
                    border-radius: 32px;
                    object-fit: cover;
                    opacity: 0.8;
                    transition: opacity 1s ease;
                }

                .mockup-container:hover .mockup-img {
                    opacity: 1;
                }

                .features {
                    position: relative;
                    z-index: 10;
                    padding: 8rem 1.5rem;
                }

                .section-container {
                    margin: 0 auto;
                    max-width: 80rem;
                }

                .features-header {
                    margin-bottom: 5rem;
                }

                .features-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    tracking: -0.02em;
                    line-height: title;
                }

                @media (min-width: 768px) {
                    .features-title {
                        font-size: 3.75rem;
                    }
                }

                .title-muted {
                    color: #52525b;
                }

                .large-bento-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .large-bento-grid {
                        grid-template-columns: repeat(12, 1fr);
                    }
                    .span-8 { grid-column: span 8; }
                    .span-4 { grid-column: span 4; }
                }

                .made-for {
                    padding: 8rem 1.5rem;
                    background: rgba(255, 255, 255, 0.01);
                }

                .made-for-header {
                    text-align: center;
                    margin-bottom: 5rem;
                }

                .made-for-title {
                    margin-top: 1.5rem;
                    font-size: 2.5rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                @media (min-width: 768px) {
                    .made-for-title {
                        font-size: 3.75rem;
                    }
                }

                .made-for-grid {
                    display: grid;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .made-for-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .made-for-card {
                    padding: 3rem 2rem;
                    border-radius: 32px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .made-for-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    transform: translateY(-8px);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .made-for-card.highlight {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.02));
                    border-color: rgba(59, 130, 246, 0.2);
                }

                .card-icon {
                    margin-bottom: 2rem;
                    color: white;
                    opacity: 0.8;
                }

                .made-for-card h3 {
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .made-for-card p {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #a1a1aa;
                }

                .accessibility-badge {
                    margin-top: 1.5rem;
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 99px;
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: #60a5fa;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .accessibility-note {
                    margin-top: 4rem;
                    text-align: center;
                    padding: 2rem;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .accessibility-note p {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    color: #71717a;
                    font-size: 0.875rem;
                }

                .accessibility-note strong {
                    color: white;
                    font-weight: 600;
                }

                .sparkle-icon {
                    color: #3b82f6;
                }

                .methodology {
                    position: relative;
                    padding: 8rem 1.5rem;
                    overflow: hidden;
                }

                .method-layout {
                    display: grid;
                    gap: 5rem;
                }

                @media (min-width: 1024px) {
                    .method-layout {
                        grid-template-columns: 1fr 1fr;
                        align-items: center;
                    }
                }

                .section-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.3em;
                    color: #3b82f6;
                    text-transform: uppercase;
                }

                .method-title {
                    margin-top: 1.5rem;
                    font-size: 2.5rem;
                    font-weight: 700;
                    tracking: -0.02em;
                }

                @media (min-width: 768px) {
                    .method-title {
                        font-size: 3.75rem;
                    }
                }

                .method-title-muted {
                    color: #a1a1aa;
                }

                .method-quote {
                    margin-top: 2rem;
                    font-size: 1.125rem;
                    color: #a1a1aa;
                    line-height: 1.6;
                    font-style: italic;
                }

                .method-steps {
                    margin-top: 3rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .method-item {
                    display: flex;
                    gap: 1.5rem;
                }

                .method-num {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #3b82f6;
                }

                .method-item-title {
                    font-weight: 700;
                    color: white;
                }

                .method-item-desc {
                    margin-top: 0.25rem;
                    font-size: 0.875rem;
                    color: #52525b;
                }

                .visual-orbit {
                    position: relative;
                    aspect-ratio: 1/1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .orbit-outer {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .outer-dot {
                    position: absolute;
                    top: -0.5rem;
                    left: 50%;
                    height: 1rem;
                    width: 1rem;
                    transform: translateX(-50%);
                    border-radius: 9999px;
                    background: #3b82f6;
                    filter: blur(4px);
                }

                .orbit-inner {
                    position: absolute;
                    height: 66.666667%;
                    width: 66.666667%;
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .inner-dot {
                    position: absolute;
                    bottom: -0.25rem;
                    left: 50%;
                    height: 0.5rem;
                    width: 0.5rem;
                    transform: translateX(-50%);
                    border-radius: 9999px;
                    background: #6366f1;
                    filter: blur(4px);
                }

                .center-plus {
                    z-index: 10;
                    height: 8rem;
                    width: 8rem;
                    border-radius: 2rem;
                    background: #18181b;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .plus-icon {
                    color: white;
                }

                .cta {
                    padding: 8rem 1.5rem;
                }

                .cta-card {
                    position: relative;
                    margin: 0 auto;
                    max-width: 64rem;
                    overflow: hidden;
                    border-radius: 3rem;
                    background: white;
                    color: black;
                    padding: 3rem;
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .cta-card {
                        padding: 6rem;
                    }
                }

                .cta-glow {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent);
                    opacity: 0.5;
                    transition: transform 1s ease;
                }

                .cta-card:hover .cta-glow {
                    transform: scale(1.1);
                }

                .cta-content {
                    position: relative;
                    z-index: 10;
                }

                .cta-title {
                    font-size: 2.25rem;
                    font-weight: 700;
                    tracking: -0.05em;
                }

                @media (min-width: 768px) {
                    .cta-title {
                        font-size: 4.5rem;
                    }
                }

                .cta-desc {
                    margin-top: 2rem;
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 28rem;
                    font-size: 1.125rem;
                    font-weight: 500;
                    color: #52525b;
                }

                .cta-action {
                    margin-top: 3rem;
                }

                .btn-mega-dark {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    border-radius: 1.25rem;
                    background: black;
                    padding: 1.25rem 3rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    transition: all 0.2s ease;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .btn-mega-dark:hover {
                    transform: scale(1.05);
                }

                .footer {
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 3rem 1.5rem;
                    color: #52525b;
                    font-style: italic;
                }

                .footer-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                }

                @media (min-width: 768px) {
                    .footer-inner {
                        flex-direction: row;
                    }
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    opacity: 0.5;
                    filter: grayscale(1);
                }

                .footer-sq {
                    display: flex;
                    height: 1.5rem;
                    width: 1.5rem;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    background: white;
                    transform: rotate(-45deg);
                }

                .footer-plus {
                    color: black;
                    transform: rotate(45deg);
                }

                .footer-logo-text {
                    font-size: 0.875rem;
                    font-weight: 700;
                    letter-spacing: -0.05em;
                    color: white;
                }

                .footer-links {
                    display: flex;
                    gap: 2rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                }

                .footer-link {
                    transition: color 0.2s ease;
                }

                .footer-link:hover {
                    color: white;
                }

                .footer-copy {
                    font-size: 0.75rem;
                }

                .section-header-center {
                    text-align: center;
                    margin-bottom: 5rem;
                }

                .section-title-sm {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 1rem;
                }

                @media (min-width: 768px) {
                    .section-title-sm {
                        font-size: 3rem;
                    }
                }

                .testimonials {
                    padding: 8rem 1.5rem;
                }

                .testimonials-grid {
                    display: grid;
                    gap: 2rem;
                }

                @media (min-width: 1024px) {
                    .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .testimonial-card {
                    padding: 3rem 2.5rem;
                    border-radius: 32px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                }

                .quote-icon {
                    color: #3b82f6;
                    opacity: 0.5;
                    margin-bottom: 2rem;
                }

                .testimonial-text {
                    font-size: 1.125rem;
                    line-height: 1.6;
                    color: #d4d4d8;
                    font-style: italic;
                    margin-bottom: 2rem;
                }

                .testimonial-meta {
                    display: flex;
                    flex-direction: column;
                }

                .testimonial-author {
                    font-weight: 700;
                    color: white;
                }

                .testimonial-role {
                    font-size: 0.875rem;
                    color: #52525b;
                }

                .performance {
                    padding: 8rem 1.5rem;
                    background: rgba(30, 64, 175, 0.02);
                }

                .performance-layout {
                    display: grid;
                    gap: 5rem;
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .performance-layout {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .performance-metrics {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .metric-box {
                    padding: 2rem 1rem;
                    text-align: center;
                    border-radius: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .metric-value {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #3b82f6;
                    margin-bottom: 0.5rem;
                }

                .metric-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #52525b;
                }

                .security {
                    padding: 8rem 1.5rem;
                }

                .security-card {
                    position: relative;
                    padding: 6rem 3rem;
                    border-radius: 48px;
                    background: #09090b;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                    text-align: center;
                }

                .security-bg-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40rem;
                    height: 40rem;
                    background: radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .security-icon-group {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .lock-icon { color: #52525b; }
                .shield-icon { color: #3b82f6; filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3)); }
                .cloud-icon { color: #52525b; }

                .security-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .security-desc {
                    max-width: 32rem;
                    margin: 0 auto 3rem;
                    font-size: 1.125rem;
                    color: #a1a1aa;
                    line-height: 1.6;
                }

                .security-badges {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1.5rem;
                }

                .s-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #d4d4d8;
                }

                .integrations {
                    padding: 8rem 1.5rem;
                }

                .int-layout {
                    display: grid;
                    gap: 5rem;
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .int-layout {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .int-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .int-card {
                    padding: 2rem 1rem;
                    text-align: center;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                }

                .int-name {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #a1a1aa;
                }

                .pricing {
                    padding: 8rem 1.5rem;
                    background: rgba(255, 255, 255, 0.01);
                }

                .pricing-grid {
                    display: grid;
                    gap: 2rem;
                }

                @media (min-width: 1024px) {
                    .pricing-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .price-card {
                    padding: 4rem 2.5rem;
                    border-radius: 40px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }

                .price-card.featured {
                    background: #fff;
                    color: black;
                    border: none;
                    transform: scale(1.05);
                    z-index: 10;
                }

                .p-tier {
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                    opacity: 0.6;
                }

                .p-amount {
                    font-size: 4rem;
                    font-weight: 800;
                    letter-spacing: -0.05em;
                    margin-bottom: 2rem;
                }

                .p-period {
                    font-size: 1rem;
                    opacity: 0.5;
                }

                .p-badge {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    padding: 0.25rem 0.75rem;
                    background: #3b82f6;
                    color: white;
                    border-radius: 99px;
                    font-size: 0.65rem;
                    font-weight: 800;
                }

                .p-features {
                    list-style: none;
                    margin-bottom: 3rem;
                    flex-grow: 1;
                }

                .p-features li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                }

                .p-btn {
                    padding: 1.25rem;
                    text-align: center;
                    border-radius: 20px;
                    font-weight: 700;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s;
                }

                .p-btn.primary {
                    background: black;
                    color: white;
                    border: none;
                }

                .p-card.featured .p-btn:not(.primary) {
                    background: black;
                    color: white;
                }

                .comparison {
                    padding: 8rem 1.5rem;
                }

                .comp-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .comp-table th, .comp-table td {
                    padding: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .comp-table th {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #52525b;
                }

                .highlight-col {
                    background: rgba(59, 130, 246, 0.05);
                    color: white;
                    font-weight: 700;
                }

                .faq {
                    padding: 8rem 1.5rem;
                }

                .faq-list {
                    max-width: 48rem;
                    margin: 0 auto;
                }

                .faq-item {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .faq-question {
                    padding: 2rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-weight: 700;
                    cursor: pointer;
                    list-style: none;
                }

                .faq-question::-webkit-details-marker { display: none; }

                .faq-answer {
                    padding-bottom: 2rem;
                    color: #a1a1aa;
                    line-height: 1.6;
                }

                .faq-icon {
                    transition: transform 0.3s;
                }

                .faq-item[open] .faq-icon {
                    transform: rotate(180deg);
                }

                ::selection {
                    background: white;
                    color: black;
                }

                .grain::before {
                    content: "";
                    position: fixed;
                    top: -150%;
                    left: -150%;
                    width: 300%;
                    height: 300%;
                    background-image: url("https://grainy-gradients.vercel.app/noise.svg");
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 50;
                    filter: brightness(100%) contrast(100%);
                }
            `}</style>
        </div>
    )
}
