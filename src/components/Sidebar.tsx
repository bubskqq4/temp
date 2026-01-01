'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Inbox,
    FolderKanban,
    PenTool,
    Briefcase,
    BookOpen,
    HelpCircle,
    Settings,
    CheckSquare,
    ScrollText,
    Sparkles,
    Timer,
    Zap,
    MoreHorizontal,
    Plus,
    LayoutGrid,
    Menu,
    X,
    Focus,
    CreditCard,
    Mail,
    Palette,
    Users,
    BarChart3,
    LogOut,
    MessageSquare,
    Moon
} from 'lucide-react'
import { ReviewModal } from './ReviewModal'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

export const Sidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [inboxCount, setInboxCount] = useState(0)
    const [user, setUser] = useState<any>(null)
    const isSidebarLoaded = React.useRef(false)

    React.useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    React.useEffect(() => {
        const savedSparks = localStorage.getItem('lifepath_sparks')
        if (savedSparks) {
            try {
                const sparks = JSON.parse(savedSparks)
                setInboxCount(sparks.filter((s: any) => !s.converted).length)
            } catch (e) { }
        }
    }, [pathname])

    const menuItems = [
        { icon: LayoutGrid, label: 'Cockpit', href: '/dashboard' },
        { icon: Inbox, label: 'Inbox', href: '/inbox' },
        { icon: Focus, label: 'Focus Room', href: '/focus-room' },
        { icon: FolderKanban, label: 'Projects', href: '/projects' },
        { icon: PenTool, label: 'Creative Studio', href: '/creative-studio' },
        { icon: Sparkles, label: 'AI Companion', href: '/ai-companion' },
        { icon: Briefcase, label: 'Business Hub', href: '/business' },
        { icon: BookOpen, label: 'Knowledge Base', href: '/knowledge-base' },
        { icon: HelpCircle, label: 'User Guide', href: '/guide' },
    ]

    const empireItems = [
        { icon: Users, label: 'Network', href: '/network' },
        { icon: CreditCard, label: 'Spending', href: '/spending' },
        { icon: Zap, label: 'Venture', href: '/venture' },
        { icon: Mail, label: 'Marketing', href: '/marketing' },
    ]

    const masteryItems = [
        { icon: CheckSquare, label: 'Habit Systems', href: '/habits' },
        { icon: Timer, label: 'Roadmap', href: '/roadmap' },
        { icon: BarChart3, label: 'Performance', href: '/performance' },
        { icon: PenTool, label: 'Design Lab', href: '/design-lab' },
        { icon: Palette, label: 'Brand Lab', href: '/brand' },
        { icon: Sparkles, label: 'AI Tools', href: '/ai-tools' },
        { icon: CreditCard, label: 'Plans & Billing', href: '/plans' },
    ]

    const bottomItems = [
        { icon: Settings, label: 'Settings', href: '/settings' },
        { icon: CheckSquare, label: 'Review', href: '#' },
        { icon: ScrollText, label: 'Journals', href: '/journals' },
    ]

    const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [energy, setEnergy] = useState(3) // 1-5 scale
    const [rituals, setRituals] = useState([
        { id: 1, icon: Sparkles, label: 'Deep Work', completed: false },
        { id: 2, icon: BookOpen, label: 'Reading', completed: false },
        { id: 3, icon: Zap, label: 'Exercise', completed: false },
        { id: 4, icon: Timer, label: 'Meditation', completed: false },
    ])
    const [bigWins, setBigWins] = useState<any[]>([])
    const isLoaded = useRef(false)

    // Load from localStorage
    React.useEffect(() => {
        const savedRituals = localStorage.getItem('lifepath_rituals')
        const savedEnergy = localStorage.getItem('lifepath_energy')
        const savedTimer = localStorage.getItem('lifepath_timer')
        const savedReflections = localStorage.getItem('lifepath_reflections')

        if (savedRituals) {
            try {
                const parsed = JSON.parse(savedRituals)
                // Need to re-map symbols because icons can't be stored directly
                const ICON_MAP: any = { Sparkles, BookOpen, Zap, Timer }
                setRituals(parsed.map((r: any) => ({ ...r, icon: ICON_MAP[r.iconName] || Sparkles })))
            } catch (e) { }
        }
        if (savedEnergy) setEnergy(parseInt(savedEnergy))
        if (savedTimer) setPomodoroTime(parseInt(savedTimer))

        if (savedReflections) {
            try {
                const refs = JSON.parse(savedReflections)
                setBigWins(refs.filter((r: any) => r.type === 'big_win').reverse())
            } catch (e) { }
        }

        isLoaded.current = true
    }, [pathname]) // Refresh when navigating

    // Save to localStorage
    React.useEffect(() => {
        if (isLoaded.current) {
            const serializableRituals = rituals.map(r => ({ ...r, icon: undefined, iconName: (r.icon as any).displayName || (r.icon as any).name }))
            localStorage.setItem('lifepath_rituals', JSON.stringify(serializableRituals))
            localStorage.setItem('lifepath_energy', energy.toString())
            localStorage.setItem('lifepath_timer', pomodoroTime.toString())
        }
    }, [rituals, energy, pomodoroTime])

    const toggleRitual = (id: number) => {
        setRituals(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r))
    }

    React.useEffect(() => {
        let interval: any
        if (isTimerRunning && pomodoroTime > 0) {
            interval = setInterval(() => {
                setPomodoroTime(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning, pomodoroTime])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <>
            <button
                className="mobile-menu-toggle fixed top-4 left-4 z-[1100] md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div
                className={cn("sidebar-overlay", isOpen && "open")}
                onClick={() => setIsOpen(false)}
            />

            <aside className={cn("sidebar", isOpen && "open")}>
                <div className="sidebar-header">
                    <Link href="/dashboard" className="logo-container" onClick={() => setIsOpen(false)}>
                        <div className="logo-icon-image">
                            <div className="w-6 h-6 rounded bg-white flex items-center justify-center rotate-[-45deg]" style={{ width: '24px', height: '24px', background: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-45deg)' }}>
                                <Plus size={14} className="text-black rotate-[45deg]" style={{ color: 'black', transform: 'rotate(45deg)' }} />
                            </div>
                        </div>
                        <span className="logo-text">Founder's Route</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn('nav-link', isActive && 'active')}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                        <item.icon size={16} className="nav-icon" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.label === 'Inbox' && inboxCount > 0 && (
                                        <span className="inbox-count-badge" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', color: '#a1a1aa' }}>{inboxCount}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-label" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3f3f46', padding: '1rem 0 0.5rem 1.25rem', letterSpacing: '0.05em' }}>EMPIRE</div>
                        {empireItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn('nav-link', isActive && 'active')}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon size={16} className="nav-icon" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-label" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3f3f46', padding: '1rem 0 0.5rem 1.25rem', letterSpacing: '0.05em' }}>MASTERY</div>
                        {masteryItems.map((item, index) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn('nav-link', isActive && 'active')}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon size={16} className="nav-icon" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="nav-group secondary">
                        {bottomItems.map((item, index) => {
                            if (item.label === 'Review') {
                                return (
                                    <button
                                        key={index}
                                        className="nav-link w-full"
                                        onClick={() => {
                                            setIsOpen(false)
                                            setIsReviewOpen(true)
                                        }}
                                    >
                                        <item.icon size={16} className="nav-icon" />
                                        <span>{item.label}</span>
                                    </button>
                                )
                            }
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="nav-link"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon size={16} className="nav-icon" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="spacer" />

                    <div className="rituals-section">
                        <div className="section-header">
                            <span>Daily Rituals</span>
                            <span className="rituals-count">{rituals.filter(r => r.completed).length}/{rituals.length}</span>
                        </div>
                        <div className="rituals-icons">
                            {rituals.map(ritual => (
                                <button
                                    key={ritual.id}
                                    className={cn("ritual-btn", ritual.completed && "completed")}
                                    onClick={() => toggleRitual(ritual.id)}
                                    title={ritual.label}
                                >
                                    <ritual.icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="timer-widget card">
                        <div className="widget-header">
                            <span>Pomodoro Timer</span>
                            <button onClick={() => setPomodoroTime(25 * 60)} className="reset-timer-btn">
                                <Plus size={12} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <div className="timer-content" onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ cursor: 'pointer' }}>
                            <div className="timer-circle">
                                <div className="timer-value">{formatTime(pomodoroTime)}</div>
                                <div className="timer-label">{isTimerRunning ? 'RUNNING' : 'PAUSED'}</div>
                            </div>
                        </div>
                    </div>

                    {bigWins.length > 0 && (
                        <div className="big-wins-widget card sidebar-widget-hover" style={{ padding: '0.75rem', marginBottom: '0.75rem' }}>
                            <div className="widget-header" style={{ marginBottom: '0.5rem', fontSize: '0.65rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Recent Wins</span>
                                <Sparkles size={10} color="#eab308" />
                            </div>
                            <div className="wins-mini-gallery custom-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {bigWins.slice(0, 3).map((win) => (
                                    <div key={win.id} style={{
                                        minWidth: '140px',
                                        maxWidth: '140px',
                                        padding: '0.75rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        color: '#a1a1aa',
                                        fontStyle: 'italic',
                                        lineHeight: '1.4',
                                        border: '1px solid rgba(255,255,255,0.02)'
                                    }}>
                                        "{win.content.length > 50 ? win.content.substring(0, 50) + '...' : win.content}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="energy-widget card">
                        <div className="widget-header">
                            <div className="energy-label">
                                <Zap size={14} />
                                <span>Energy</span>
                            </div>
                            <div className="energy-indicator">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <div
                                        key={level}
                                        className={cn("energy-dot", energy >= level && "filled")}
                                        onClick={() => setEnergy(level)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="footer-icons">
                        <Link href="/feedback" className="footer-icon-btn" title="Feedback">
                            <MessageSquare size={18} />
                        </Link>
                        <Link href="/contact" className="footer-icon-btn" title="Contact Us">
                            <Mail size={18} />
                        </Link>
                        <button onClick={handleLogout} className="footer-icon-btn text-red-500" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
            />
        </>
    )
}
