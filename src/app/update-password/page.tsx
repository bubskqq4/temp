'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, Plus, Save, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Check if we have an active session (Supabase handles the reset token automatically)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // If no session, they might have landed here without a valid reset link
                setStatus('error')
                setError('Invalid or expired reset session. Please request a new link.')
            }
        }
        checkSession()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setStatus('error')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setStatus('error')
            return
        }

        setStatus('loading')
        setError('')

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) throw updateError
            setStatus('success')

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to update password')
            setStatus('error')
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-bg-blob" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-container"
            >
                <div className="auth-header">
                    <Link href="/login" className="auth-logo-link">
                        <div className="auth-logo-box">
                            <Plus size={20} className="auth-logo-icon" />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter">Founder's Route</span>
                    </Link>
                    <h1 className="auth-title">New Credentials.</h1>
                    <p className="auth-subtitle">Secure your account with a new password.</p>
                </div>

                <div className="auth-card">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Password Updated</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Your access has been restored.<br />
                                Redirecting to login...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="auth-form">
                            <div className="auth-input-group">
                                <label className="auth-label">New Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock className="auth-input-icon" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="auth-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-input-group">
                                <label className="auth-label">Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock className="auth-input-icon" size={18} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="auth-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="auth-error"
                                >
                                    <ShieldAlert size={18} className="text-red-500" />
                                    {error}
                                </motion.div>
                            )}

                            {status === 'error' && error.includes('expired') ? (
                                <Link
                                    href="/reset-password"
                                    className="auth-submit-btn bg-zinc-800 text-white hover:bg-zinc-700"
                                >
                                    Try Again
                                </Link>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="auth-submit-btn group"
                                >
                                    {status === 'loading' ? 'Saving...' : 'Update Password'}
                                    {status !== 'loading' && <Save size={20} className="group-hover:scale-110 transition-transform" />}
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </motion.div>

            <style jsx global>{`
                .auth-wrapper {
                    min-height: 100vh;
                    background-color: #050505;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }

                .auth-bg-blob {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 600px;
                    height: 300px;
                    background: rgba(255, 255, 255, 0.05);
                    filter: blur(120px);
                    border-radius: 50%;
                    z-index: 0;
                    pointer-events: none;
                }

                .auth-container {
                    width: 100%;
                    max-width: 28rem;
                    position: relative;
                    z-index: 10;
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .auth-logo-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    color: inherit;
                    text-decoration: none;
                }

                .auth-logo-box {
                    width: 2.5rem;
                    height: 2.5rem;
                    background: white;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(-45deg);
                }

                .auth-logo-icon {
                    color: black;
                    transform: rotate(45deg);
                }

                .auth-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    font-family: var(--font-serif);
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }

                .auth-subtitle {
                    color: #a1a1aa;
                    font-size: 1rem;
                }

                .auth-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .auth-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .auth-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #a1a1aa;
                    margin-left: 0.25rem;
                }

                .auth-input-wrapper {
                    position: relative;
                }

                .auth-input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.2);
                    pointer-events: none;
                }

                .auth-input {
                    width: 100%;
                    height: 3.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding-left: 3rem;
                    padding-right: 1rem;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.2s;
                }

                .auth-input:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.08);
                }

                .auth-input::placeholder {
                    color: rgba(255, 255, 255, 0.1);
                }

                .auth-error {
                    padding: 1rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 0.75rem;
                    color: #ef4444;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .auth-submit-btn {
                    width: 100%;
                    height: 3.5rem;
                    background: white;
                    color: black;
                    font-weight: 700;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                    font-size: 1rem;
                }

                .auth-submit-btn:hover:not(:disabled) {
                    background: #e4e4e7;
                    transform: translateY(-1px);
                }

                .auth-submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    )
}
