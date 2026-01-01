'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <main className="legal-page">
            <div className="legal-container">
                <Link href="/" className="legal-back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <header className="legal-header">
                    <div className="legal-icon-box">
                        <Lock className="text-white" size={24} />
                    </div>
                    <h1 className="legal-title">Privacy Policy</h1>
                    <p className="legal-intro">
                        At Founder's Route, privacy isn't an afterthought—it's our foundation.
                        We believe your life's data belongs to you, and you alone.
                    </p>
                </header>

                <div className="legal-sections">
                    <section className="legal-section">
                        <h2>
                            <Shield size={20} style={{ color: 'var(--muted)' }} />
                            Data Storage & Ownership
                        </h2>
                        <div>
                            <p>
                                Founder's Route operates on a <strong>Local-First</strong> principle. This means:
                            </p>
                            <ul>
                                <li>Your tasks, projects, and personal entries are stored directly on your device's <code>localStorage</code>.</li>
                                <li>We do not have access to your private dashboard data on our servers.</li>
                                <li>You are the sole owner of your data. Clearing your browser cache will remove this data unless you have exported it.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>
                            <Eye size={20} style={{ color: 'var(--muted)' }} />
                            Data Collection & Usage
                        </h2>
                        <div>
                            <p>
                                We collect minimal anonymized data solely to improve the stability of the application. This includes:
                            </p>
                            <ul>
                                <li>Authentication status (to keep you logged in).</li>
                                <li>Subscription tier verification (to unlock usage features).</li>
                                <li>Basic error logging (to fix bugs).</li>
                            </ul>
                            <p style={{ marginTop: '1rem' }}>
                                We <strong>never</strong> sell your data to third parties, advertisers, or data brokers.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>Cookies</h2>
                        <p>
                            We use essential cookies only for authentication and session management. We do not use tracking cookies for cross-site behavioral advertising.
                        </p>
                    </section>

                    <footer className="legal-footer">
                        <p>Last updated: December 30, 2025</p>
                        <p style={{ marginTop: '0.5rem' }}>Contact: privacy@foundersroute.com</p>
                    </footer>
                </div>
            </div>
        </main>
    )
}
