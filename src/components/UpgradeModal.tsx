'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Zap, Crown } from 'lucide-react'
import { Plan, PLANS, PlanTier } from '@/lib/plans'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    requiredPlan: PlanTier
    featureName?: string
    currentPlan: PlanTier
}

export const UpgradeModal = ({
    isOpen,
    onClose,
    requiredPlan,
    featureName,
    currentPlan
}: UpgradeModalProps) => {
    if (!isOpen) return null

    const plan = PLANS[requiredPlan]
    const isPro = requiredPlan === 'pro'

    return (
        <AnimatePresence>
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
                        width: '100%', maxWidth: '680px',
                        background: '#1c1917',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        color: '#d6d3d1'
                    }}
                >
                    {/* Close Button */}
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

                    {/* Header */}
                    <div style={{
                        padding: '3rem 2.5rem 2rem',
                        background: isPro
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                            : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: isPro
                                ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                                : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: isPro
                                ? '0 0 40px rgba(139, 92, 246, 0.3)'
                                : '0 0 40px rgba(59, 130, 246, 0.3)'
                        }}>
                            {isPro ? <Crown size={32} color="white" /> : <Zap size={32} color="white" />}
                        </div>

                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: 500,
                            fontFamily: 'var(--font-serif)',
                            color: '#fff',
                            marginBottom: '0.5rem'
                        }}>
                            Upgrade to {plan.name}
                        </h2>

                        {featureName && (
                            <p style={{ color: '#a8a29e', fontSize: '1rem', marginBottom: '1rem' }}>
                                <strong style={{ color: '#e7e5e4' }}>{featureName}</strong> requires a {plan.name} plan
                            </p>
                        )}

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'baseline',
                            gap: '0.5rem',
                            marginTop: '1rem'
                        }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700, color: '#fff' }}>
                                ${plan.price}
                            </span>
                            <span style={{ fontSize: '1.1rem', color: '#a8a29e' }}>
                                /{plan.interval}
                            </span>
                        </div>
                    </div>

                    {/* Features */}
                    <div style={{ padding: '2.5rem' }}>
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#8b5cf6',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem'
                        }}>
                            What's Included
                        </p>

                        <div style={{
                            display: 'grid',
                            gap: '1rem',
                            marginBottom: '2rem'
                        }}>
                            {plan.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{
                                        width: '24px', height: '24px',
                                        borderRadius: '50%',
                                        background: isPro
                                            ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                                            : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Check size={14} color="white" strokeWidth={3} />
                                    </div>
                                    <span style={{ color: '#e7e5e4', fontSize: '1rem' }}>
                                        {feature}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '1rem',
                                    background: '#292524',
                                    border: 'none', borderRadius: '50px',
                                    color: '#e7e5e4', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Redirect to payment/upgrade page
                                    console.log('Upgrade to:', requiredPlan)
                                    window.location.href = `/upgrade?plan=${requiredPlan}`
                                }}
                                style={{
                                    flex: 2, padding: '1rem',
                                    background: isPro
                                        ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                                        : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                                    border: 'none', borderRadius: '50px',
                                    color: 'white', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    boxShadow: isPro
                                        ? '0 4px 20px rgba(139, 92, 246, 0.3)'
                                        : '0 4px 20px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Sparkles size={18} />
                                Upgrade Now
                            </button>
                        </div>

                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: '#78716c',
                            marginTop: '1.5rem',
                            fontStyle: 'italic'
                        }}>
                            Cancel anytime. No questions asked.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
