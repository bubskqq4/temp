'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'

interface WelcomeModalProps {
    onAccept: () => void
}

export const WelcomeModal = ({ onAccept }: WelcomeModalProps) => {
    const [isChecked, setIsChecked] = useState(false)

    return (
        <div key="welcome-modal-overlay" className="modal-overlay" style={{ backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.8)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                drag
                dragMomentum={false}
                whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 1000 }}
                className="modal-content welcome-modal"
                style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}
            >
                <div className="welcome-icon-container">
                    <div className="welcome-icon-ring" />
                    <Shield size={48} className="welcome-icon" />
                </div>

                <h1 className="welcome-title font-serif">
                    Welcome to Founder's Route
                </h1>

                <p className="welcome-text">
                    Your personal cockpit for productivity and life management.
                    Before we begin, please review and accept our privacy standards.
                </p>

                <div className="policy-box">
                    <p>
                        We value your privacy. Your data is stored locally on your device and
                        is never shared with third parties without your explicit consent.
                        By continuing, you agree to our <a href="/terms" className="highlight" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" className="highlight" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                    </p>
                </div>

                <div
                    className="checkbox-row"
                    onClick={() => setIsChecked(!isChecked)}
                >
                    <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                        {isChecked && <motion.div layoutId="check" className="check-dot" />}
                    </div>
                    <span>I accept the Privacy Policy and Terms of Use</span>
                </div>

                <button
                    className={`welcome-accept-btn ${isChecked ? 'active' : 'disabled'}`}
                    onClick={() => isChecked && onAccept()}
                    disabled={!isChecked}
                >
                    <span>Enter Cockpit</span>
                    <ArrowRight size={16} />
                </button>

            </motion.div>
        </div>
    )
}
