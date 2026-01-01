'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Scale } from 'lucide-react'

export default function TermsOfService() {
    return (
        <main className="legal-page">
            <div className="legal-container">
                <Link href="/" className="legal-back-link">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>

                <header className="legal-header">
                    <div className="legal-icon-box">
                        <Scale className="text-white" size={24} />
                    </div>
                    <h1 className="legal-title">Terms of Service</h1>
                    <p className="legal-intro">
                        The rules of the road for using Founder's Route.
                        By accessing our cockpit, you agree to these terms.
                    </p>
                </header>

                <div className="legal-sections">
                    <section className="legal-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Founder's Route application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>2. User Responsibility</h2>
                        <div>
                            <p>
                                Because Founder's Route relies on local storage for data persistence, you are responsible for:
                            </p>
                            <ul>
                                <li>Maintaining backups of your critical data.</li>
                                <li>Ensuring your device is secure.</li>
                                <li>Managing your browser data (clearing cache may result in data loss if not backed up).</li>
                            </ul>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>3. Intellectual Property</h2>
                        <p>
                            The Service and its original content (excluding Content provided by you), features, and functionality are and will remain the exclusive property of Founder's Route and its licensors.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>4. Termination</h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section className="legal-section">
                        <h2>5. Changes</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <footer className="legal-footer">
                        <p>Last updated: December 30, 2025</p>
                        <p style={{ marginTop: '0.5rem' }}>Contact: legal@foundersroute.com</p>
                    </footer>
                </div>
            </div>
        </main>
    )
}
