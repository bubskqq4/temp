'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    User,
    Bell,
    Palette,
    Lock,
    CreditCard,
    LogOut,
    Save,
    Check,
    Camera,
    Mail,
    Shield,
    Zap
} from 'lucide-react'

// Settings Tab Component
const SettingsTab = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`settings-tab ${active ? 'active' : ''}`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
)

export default function SettingsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('account')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // User data state
    const [user, setUser] = useState<any>(null)
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')

    // Preferences state
    const [theme, setTheme] = useState('dark')
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                setEmail(user.email || '')
                setDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '')
                setBio(user.user_metadata?.bio || '')
            } else {
                router.push('/login')
            }
            setLoading(false)
        }
        getUser()
    }, [router])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    display_name: displayName,
                    bio: bio
                }
            })
            if (error) throw error
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (err) {
            console.error('Error saving:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loading-spinner" />
                </main>
            </div>
        )
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="settings-wrapper">
                    {/* Settings Header */}
                    <div className="settings-header">
                        <h1 className="settings-title">Settings</h1>
                        <p className="settings-subtitle">Manage your account, preferences, and subscription.</p>
                    </div>

                    <div className="settings-layout">
                        {/* Settings Sidebar */}
                        <aside className="settings-sidebar">
                            <div className="settings-tabs">
                                <SettingsTab icon={User} label="Account" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
                                <SettingsTab icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                                <SettingsTab icon={Palette} label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                                <SettingsTab icon={Lock} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                                <SettingsTab icon={CreditCard} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
                            </div>
                            <div className="settings-sidebar-footer">
                                <button onClick={handleLogout} className="logout-btn">
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </aside>

                        {/* Settings Content */}
                        <div className="settings-content">
                            {activeTab === 'account' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="settings-panel"
                                >
                                    <h2 className="panel-title">Account Information</h2>
                                    <p className="panel-subtitle">Update your personal details and public profile.</p>

                                    <div className="avatar-section">
                                        <div className="avatar-large">
                                            {displayName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <button className="avatar-upload-btn">
                                            <Camera size={16} />
                                            Change Photo
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="form-input"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <div className="form-input-with-icon">
                                            <Mail size={16} className="input-icon" />
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="form-input disabled"
                                            />
                                        </div>
                                        <p className="form-hint">Contact support to change your email.</p>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="form-textarea"
                                            placeholder="Tell us a bit about yourself..."
                                            rows={3}
                                        />
                                    </div>

                                    <button onClick={handleSave} disabled={saving} className="save-btn">
                                        {saving ? 'Saving...' : saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save Changes</>}
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="settings-panel"
                                >
                                    <h2 className="panel-title">Notification Preferences</h2>
                                    <p className="panel-subtitle">Control how and when you receive updates.</p>

                                    <div className="toggle-group">
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Email Notifications</h4>
                                                <p>Receive weekly digests and important alerts.</p>
                                            </div>
                                            <button
                                                onClick={() => setEmailNotifications(!emailNotifications)}
                                                className={`toggle-switch ${emailNotifications ? 'active' : ''}`}
                                            >
                                                <div className="toggle-knob" />
                                            </button>
                                        </div>
                                        <div className="toggle-item">
                                            <div>
                                                <h4>Push Notifications</h4>
                                                <p>Get real-time alerts in your browser.</p>
                                            </div>
                                            <button
                                                onClick={() => setPushNotifications(!pushNotifications)}
                                                className={`toggle-switch ${pushNotifications ? 'active' : ''}`}
                                            >
                                                <div className="toggle-knob" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'appearance' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="settings-panel"
                                >
                                    <h2 className="panel-title">Appearance</h2>
                                    <p className="panel-subtitle">Customize how Founder's Route looks for you.</p>

                                    <div className="theme-selector">
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                                        >
                                            <div className="theme-preview dark-preview" />
                                            <span>Dark Mode</span>
                                        </button>
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                                        >
                                            <div className="theme-preview light-preview" />
                                            <span>Light Mode</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="settings-panel"
                                >
                                    <h2 className="panel-title">Security</h2>
                                    <p className="panel-subtitle">Manage your password and account security.</p>

                                    <div className="security-card">
                                        <div className="security-icon">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h4>Password</h4>
                                            <p>Last changed: Never</p>
                                        </div>
                                        <button className="secondary-btn">Change Password</button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'subscription' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="settings-panel"
                                >
                                    <h2 className="panel-title">Subscription</h2>
                                    <p className="panel-subtitle">Manage your plan and billing.</p>

                                    <div className="current-plan-card">
                                        <div className="plan-badge">
                                            <Zap size={16} />
                                            <span>Foundation</span>
                                        </div>
                                        <p className="plan-status">You are on the free plan.</p>
                                        <button onClick={() => router.push('/plans')} className="upgrade-btn">
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .settings-wrapper {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .settings-header {
                    margin-bottom: 2rem;
                }

                .settings-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .settings-subtitle {
                    color: #a1a1aa;
                }

                .settings-layout {
                    display: grid;
                    grid-template-columns: 240px 1fr;
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .settings-layout {
                        grid-template-columns: 1fr;
                    }
                }

                .settings-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .settings-tabs {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .settings-tab {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    background: transparent;
                    border: none;
                    color: #a1a1aa;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                    width: 100%;
                }

                .settings-tab:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .settings-tab.active {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .settings-sidebar-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                }

                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.2);
                }

                .settings-content {
                    flex: 1;
                }

                .settings-panel {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    padding: 2rem;
                }

                .panel-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .panel-subtitle {
                    color: #a1a1aa;
                    margin-bottom: 2rem;
                }

                .avatar-section {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .avatar-large {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                }

                .avatar-upload-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .avatar-upload-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #a1a1aa;
                    margin-bottom: 0.5rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.08);
                }

                .form-input.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .form-input-with-icon {
                    position: relative;
                }

                .form-input-with-icon .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.3);
                }

                .form-input-with-icon .form-input {
                    padding-left: 2.5rem;
                }

                .form-hint {
                    font-size: 0.75rem;
                    color: #52525b;
                    margin-top: 0.5rem;
                }

                .form-textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 0.875rem;
                    resize: vertical;
                    min-height: 80px;
                }

                .form-textarea:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .save-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: white;
                    color: black;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .save-btn:hover:not(:disabled) {
                    background: #e4e4e7;
                }

                .save-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .toggle-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .toggle-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 0.75rem;
                }

                .toggle-item h4 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .toggle-item p {
                    font-size: 0.75rem;
                    color: #a1a1aa;
                }

                .toggle-switch {
                    width: 44px;
                    height: 24px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 999px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .toggle-switch.active {
                    background: #22c55e;
                }

                .toggle-knob {
                    width: 18px;
                    height: 18px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    transition: all 0.2s;
                }

                .toggle-switch.active .toggle-knob {
                    left: 23px;
                }

                .theme-selector {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .theme-option {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }

                .theme-option.active {
                    border-color: white;
                }

                .theme-preview {
                    width: 100%;
                    height: 80px;
                    border-radius: 0.5rem;
                }

                .dark-preview {
                    background: linear-gradient(135deg, #1c1c1c, #0a0a0a);
                }

                .light-preview {
                    background: linear-gradient(135deg, #f4f4f5, #e4e4e7);
                }

                .security-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                }

                .security-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .security-card h4 {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .security-card p {
                    font-size: 0.75rem;
                    color: #a1a1aa;
                }

                .secondary-btn {
                    margin-left: auto;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .secondary-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .current-plan-card {
                    padding: 2rem;
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 1rem;
                    text-align: center;
                }

                .plan-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 999px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .plan-status {
                    color: #a1a1aa;
                    margin-bottom: 1.5rem;
                }

                .upgrade-btn {
                    padding: 0.75rem 2rem;
                    background: white;
                    color: black;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .upgrade-btn:hover {
                    background: #e4e4e7;
                }

                .loading-spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
