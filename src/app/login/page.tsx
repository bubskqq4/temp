'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Plus, ShieldCheck, LogIn } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (loginError) throw loginError

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Invalid credentials')
        } finally {
            setLoading(false)
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
                    <Link href="/" className="auth-logo-link">
                        <div className="auth-logo-box">
                            <Plus size={20} className="auth-logo-icon" />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter">Founder's Route</span>
                    </Link>
                    <h1 className="auth-title">Welcome back.</h1>
                    <p className="auth-subtitle">Return to your command center.</p>
                </div>

                <div className="auth-card">
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Work Email</label>
                            <div className="auth-input-wrapper">
                                <Mail className="auth-input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@vision.com"
                                    className="auth-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-input-group">
                            <div className="flex justify-between items-center px-1">
                                <label className="auth-label">Password</label>
                                <Link href="/reset-password" title="reset password" style={{ color: '#a1a1aa' }} className="text-[10px] uppercase font-bold tracking-wider hover:text-white transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
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

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="auth-error"
                            >
                                <ShieldCheck size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn group"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                            {!loading && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <Link
                            href="/reset-password"
                            className="w-full h-[3.5rem] bg-zinc-900 text-zinc-400 font-semibold rounded-[1rem] flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all border border-white/5"
                        >
                            Reset Password
                        </Link>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            No access yet? <Link href="/register" className="auth-footer-link">Claim your key</Link>
                        </p>
                    </div>
                </div>

                <p className="auth-security-note">
                    <ShieldCheck size={14} />
                    Secure login via Supabase.
                </p>
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

                .auth-footer {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: center;
                }

                .auth-footer-text {
                    font-size: 0.875rem;
                    color: #a1a1aa;
                }

                .auth-footer-link {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                }

                .auth-footer-link:hover {
                    text-decoration: underline;
                }

                .auth-security-note {
                    text-align: center;
                    margin-top: 2rem;
                    font-size: 0.75rem;
                    color: #52525b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
            `}</style>
        </div>
    )
}
