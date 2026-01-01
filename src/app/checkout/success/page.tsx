'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { useUserPlan } from '@/hooks/useUserPlan'
import { PlanTier } from '@/lib/plans'
import { supabase } from '@/lib/supabase'

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { setPlan } = useUserPlan()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const sessionId = searchParams.get('session_id')
        const planId = searchParams.get('plan') as PlanTier

        if (!sessionId || !planId) {
            setStatus('error')
            setMessage('Invalid checkout session')
            return
        }

        updateUserPlan(planId)
    }, [searchParams])

    const updateUserPlan = async (planId: PlanTier) => {
        try {

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                throw new Error('Not authenticated')
            }

            // Update user plan in database
            const { error: updateError } = await supabase
                .from('users')
                .update({ plan_tier: planId })
                .eq('id', user.id)

            if (updateError) {
                throw updateError
            }

            // Update local state
            setPlan(planId)

            setStatus('success')
            setMessage(`Successfully upgraded to ${planId} plan!`)

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                router.push('/')
            }, 3000)

        } catch (error) {
            console.error('Failed to update plan:', error)
            setStatus('error')
            setMessage('Payment successful, but failed to update your account. Please contact support.')
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    background: '#1c1917',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#d6d3d1'
                }}
            >
                {status === 'loading' && (
                    <>
                        <Loader2 size={64} color="#8b5cf6" className="animate-spin" style={{ margin: '0 auto 2rem' }} />
                        <h1 style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                            Processing...
                        </h1>
                        <p style={{ color: '#a8a29e' }}>
                            We're updating your account. This will only take a moment.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                        >
                            <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 2rem' }} />
                        </motion.div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                            Welcome Aboard!
                        </h1>
                        <p style={{ color: '#a8a29e', marginBottom: '2rem' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                border: 'none',
                                borderRadius: '50px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Go to Dashboard
                            <ArrowRight size={18} />
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '2px solid rgba(239, 68, 68, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem'
                        }}>
                            <span style={{ fontSize: '2rem' }}>⚠️</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 500, fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                            Something Went Wrong
                        </h1>
                        <p style={{ color: '#a8a29e', marginBottom: '2rem' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => router.push('/plans')}
                            style={{
                                padding: '1rem 2rem',
                                background: '#292524',
                                border: 'none',
                                borderRadius: '50px',
                                color: '#e7e5e4',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Back to Plans
                        </button>
                    </>
                )}
            </motion.div>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    )
}
