'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Check,
    ArrowRight,
    Sparkles,
    Zap,
    Crown,
    Building2,
    Loader2,
    CreditCard,
    ShieldCheck,
    History,
    X
} from 'lucide-react'
import { PLANS, PlanTier } from '@/lib/plans'
import { useUserPlan } from '@/hooks/useUserPlan'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PlanCard = ({ planId, recommended = false, delay }: { planId: PlanTier, recommended?: boolean, delay: number }) => {
    const plan = PLANS[planId]
    const { setPlan, plan: currentPlan } = useUserPlan()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const iconMap = {
        'no-access': Zap,
        'basic': Zap,
        'small-business': Building2,
        'pro': Crown,
        'founder': Sparkles
    }
    const Icon = iconMap[planId]
    const isCurrent = currentPlan === planId

    const handleSelectPlan = async () => {
        if (isCurrent) return

        if (planId === 'no-access') {
            setPlan('no-access')
            router.push('/')
            return
        }

        setLoading(true)
        try {
            const priceId = getPriceId(planId)

            // TEST MODE: If using placeholder price IDs, simulate upgrade
            if (priceId.includes('_test')) {
                console.log('[TEST MODE] Simulating upgrade to:', planId)

                // Update Supabase if user is authenticated
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await supabase
                        .from('users')
                        .update({ plan_tier: planId })
                        .eq('id', user.id)
                }

                // Update local state
                setPlan(planId)

                // Simulate Stripe redirect
                router.push(`/checkout/success?session_id=test_${Date.now()}&plan=${planId}`)
                return
            }

            // PRODUCTION MODE: Use real Stripe checkout
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    priceId
                })
            })

            const { url } = await response.json()
            if (url) window.location.href = url
        } catch (error) {
            console.error('Checkout error:', error)
            setLoading(false)
        }
    }

    const getPriceId = (pId: PlanTier) => {
        const priceIds = {
            'basic': 'price_basic_test',
            'small-business': 'price_smallbiz_test',
            'pro': 'price_pro_test'
        }
        return priceIds[pId as keyof typeof priceIds] || ''
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`premium-plan-card ${recommended ? 'recommended' : ''} ${isCurrent ? 'current' : ''}`}
            style={{
                background: isCurrent ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: isCurrent ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                padding: '2.5rem',
                borderRadius: '32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}
        >
            {recommended && (
                <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'white'
                }}>
                    <Sparkles size={12} /> Recommended
                </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: recommended ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: 'white'
                }}>
                    <Icon size={28} />
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>${plan.price}</span>
                    {plan.price > 0 && <span style={{ color: '#71717a', fontSize: '0.9rem' }}>/{plan.interval}</span>}
                </div>
                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6' }}>{plan.description}</p>
            </div>

            <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Included Features</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {plan.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#d6d3d1' }}>
                            <div style={{ color: '#8b5cf6', display: 'flex' }}><Check size={16} /></div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSelectPlan}
                disabled={loading || isCurrent}
                style={{
                    width: '100%',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: isCurrent ? 'rgba(255,255,255,0.05)' : (recommended ? 'white' : 'transparent'),
                    border: recommended ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    color: recommended ? 'black' : (isCurrent ? '#52525b' : 'white'),
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: (loading || isCurrent) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                }}
            >
                {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : isCurrent ? (
                    'Current Plan'
                ) : (
                    <>
                        {plan.price === 0 ? 'Downgrade to Free' : 'Upgrade Now'}
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </motion.div>
    )
}

export default function PlansPage() {
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
    const [founderCode, setFounderCode] = useState('')
    const [codeError, setCodeError] = useState('')
    const { setPlan } = useUserPlan()
    const router = useRouter()
    const { plan, email } = useUserPlan()
    const [billingDetails, setBillingDetails] = useState<any>(null)

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="projects-main" style={{ padding: '2rem', overflowY: 'auto' }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                                <CreditCard size={24} color="#ec4899" />
                            </div>
                            <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white' }}>
                                Plans & Billing
                            </h1>
                        </div>
                        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                            Choose the power tier for your modular journey.
                        </p>
                    </div>

                    {email && (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            padding: '1rem 1.5rem',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                {email[0].toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{email}</div>
                                <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Current Plan: <span style={{ color: '#8b5cf6', fontWeight: 700, textTransform: 'capitalize' }}>{plan.replace('-', ' ')}</span></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <PlanCard planId="basic" delay={0.1} />
                    <PlanCard planId="pro" recommended delay={0.2} />
                    <PlanCard planId="small-business" delay={0.3} />

                    {/* Founder Plan - CODE ONLY */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="premium-plan-card"
                        style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            padding: '2.5rem',
                            borderRadius: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'white' }}>
                            CODE ONLY
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white' }}>
                                <Sparkles size={28} />
                            </div>
                            <h3 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Founder</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>Exclusive</span>
                            </div>
                            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6' }}>For visionary founders and early supporters</p>
                        </div>

                        <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Included Features</div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {PLANS.founder.features.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#d6d3d1' }}>
                                        <div style={{ color: '#8b5cf6', display: 'flex' }}><Check size={16} /></div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCodeModalOpen(true)}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                background: 'white',
                                border: 'none',
                                color: 'black',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Enter Founder Code
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>

                {/* Billing Info Footer */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem',
                        borderRadius: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <ShieldCheck size={20} color="#10b981" />
                            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'white' }}>Secure Payments</h3>
                        </div>
                        <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            All transactions are encrypted and processed securely through Stripe. We never store your card details on our servers.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '2rem',
                        borderRadius: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <History size={20} color="#3b82f6" />
                            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'white' }}>Billing Portal</h3>
                        </div>
                        <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Manage your existing subscription, update payment methods, and download invoices easily.
                        </p>
                        <button style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            Open Billing Portal
                        </button>
                    </div>
                </div>

                {/* Founder Code Modal */}
                <AnimatePresence>
                    {isCodeModalOpen && (
                        <div className="modal-overlay" onClick={() => setIsCodeModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                onClick={e => e.stopPropagation()}
                                style={{
                                    maxWidth: '500px',
                                    width: '90%',
                                    background: '#1c1917',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)'
                                }}
                            >
                                <div style={{ padding: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.1), transparent)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Sparkles size={28} color="white" />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>Enter Founder Code</h2>
                                            <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Exclusive access for founders</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '2.5rem' }}>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault()
                                        setCodeError('')

                                        // Valid founder codes
                                        const validCodes = ['FOUNDER2025', 'STARTUP2025', 'CEO2025', 'code-found-nye-2026']

                                        if (validCodes.includes(founderCode.toUpperCase())) {
                                            // Update Supabase if user is authenticated
                                            const { data: { user } } = await supabase.auth.getUser()
                                            if (user) {
                                                await supabase
                                                    .from('users')
                                                    .update({ plan_tier: 'founder' })
                                                    .eq('id', user.id)
                                            }

                                            // Update local state
                                            setPlan('founder')
                                            setIsCodeModalOpen(false)
                                            setFounderCode('')

                                            // Show success and redirect
                                            router.push('/dashboard')
                                        } else {
                                            setCodeError('Invalid founder code. Please check and try again.')
                                        }
                                    }}>
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3f3f46', letterSpacing: '0.1em', marginBottom: '1rem', display: 'block', textTransform: 'uppercase' }}>
                                                Founder / Startup Code
                                            </label>
                                            <input
                                                type="text"
                                                value={founderCode}
                                                onChange={(e) => {
                                                    setFounderCode(e.target.value)
                                                    setCodeError('')
                                                }}
                                                placeholder="Enter your special code"
                                                autoFocus
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: codeError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px',
                                                    padding: '1.25rem',
                                                    color: 'white',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    outline: 'none',
                                                    fontFamily: 'monospace',
                                                    textAlign: 'center'
                                                }}
                                            />
                                            {codeError && (
                                                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <X size={14} /> {codeError}
                                                </p>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCodeModalOpen(false)
                                                    setFounderCode('')
                                                    setCodeError('')
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '1.25rem',
                                                    borderRadius: '16px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#d6d3d1',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                style={{
                                                    flex: 1,
                                                    padding: '1.25rem',
                                                    borderRadius: '16px',
                                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                                    border: 'none',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                Activate
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <style jsx global>{`
                    .premium-plan-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6);
                    }
                    .premium-plan-card.recommended {
                        border: 1px solid rgba(139, 92, 246, 0.4) !important;
                        box-shadow: 0 0 40px rgba(139, 92, 246, 0.15) !important;
                    }
                    .premium-plan-card.current {
                        border: 1px solid rgba(139, 92, 246, 0.5) !important;
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>
            </main>
        </div>
    )
}
