'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, X, Youtube, Timer, Settings, Wrench, Music, Cloud, Quote, CheckSquare,
    Calculator, Coffee, Wind, Heart, Target, BarChart3, StickyNote, Clock, Sparkles,
    Volume2, VolumeX, Play, Pause, SkipForward, Edit3, Trash2,
    // Productivity icons
    Calendar, Trello, Brain, ListChecks, Activity, FolderKanban, ClipboardList,
    CalendarDays, Flag, Milestone, Zap, GitBranch, FileText, TrendingUp,
    // Wellness icons
    Headphones, Waves, TreePine, Eye, Droplets, User, Smile, Sun, Moon,
    Dumbbell, Flame, Battery, ThumbsUp, Award,
    // Learning icons
    BookOpen, GraduationCap, Library, Bookmark, Search, Mic, Book, Languages,
    Code, FileCode, ScrollText, Trophy, Medal,
    // Analytics icons
    PieChart, LineChart, BarChart, TrendingDown, Percent, ChartBar,
    // Communication icons
    MessageSquare, Mail, Bell, Video, Users, Share2, Megaphone, Rss,
    // Finance icons
    DollarSign, Wallet, CreditCard, TrendingUpIcon, PiggyBank, Coins, Receipt,
    // Creative icons
    Palette, Paintbrush, Image, Layout, Type, Lightbulb, Layers, Boxes,
    // Entertainment icons
    Radio, Newspaper, Camera, Film, Tv,
    // Utilities icons
    Globe, MapPin, Repeat, ArrowLeftRight, Languages as Translate, Hash, QrCode,
    // System icons
    Command, Sliders, Keyboard
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

// Widget types
type WidgetType =
    // Productivity (20)
    | 'youtube' | 'timer' | 'pomodoro' | 'notes' | 'todo' | 'calendar' | 'kanban'
    | 'mindmap' | 'checklist' | 'timetracker' | 'projectplanner' | 'tasklist'
    | 'agenda' | 'priorities' | 'deadlines' | 'milestones' | 'sprints' | 'gantt'
    | 'worklog' | 'productivity-stats'

    // Focus & Wellness (20)
    | 'breathing' | 'meditation' | 'whitenoise' | 'binauralbeats' | 'naturalsounds'
    | 'focusmode' | 'eyebreak' | 'stretchreminder' | 'waterreminder' | 'posture'
    | 'sleeptracker' | 'moodtracker' | 'gratitude' | 'affirmations' | 'mindfulness'
    | 'stressrelief' | 'energylevel' | 'healthgoals' | 'workout' | 'yoga'

    // Learning & Knowledge (20)
    | 'flashcards' | 'vocabulary' | 'readinglist' | 'bookmarks' | 'research'
    | 'studytimer' | 'notecards' | 'quizmaker' | 'learninggoals' | 'courses'
    | 'podcast' | 'audiobook' | 'language' | 'mathpractice' | 'codesnippets'
    | 'documentation' | 'tutorials' | 'skilltracker' | 'certificates' | 'progress'

    // Analytics & Tracking (15)
    | 'analytics' | 'habits' | 'goals' | 'streaks' | 'metrics' | 'performance'
    | 'timeanalysis' | 'productivity-chart' | 'focus-score' | 'completion-rate'
    | 'weekly-review' | 'monthly-stats' | 'yearly-goals' | 'kpi-dashboard' | 'reports'

    // Communication & Social (15)
    | 'chat' | 'messages' | 'email' | 'notifications' | 'calendar-events'
    | 'meetings' | 'contacts' | 'teamchat' | 'videocall' | 'screenshare'
    | 'collaboration' | 'feedback' | 'announcements' | 'social-feed' | 'community'

    // Finance & Business (15)
    | 'calculator' | 'budget' | 'expenses' | 'income' | 'invoices'
    | 'crypto' | 'stocks' | 'portfolio' | 'savings' | 'investments'
    | 'currency' | 'tax-calculator' | 'roi-calculator' | 'profit-margin' | 'cashflow'

    // Creative & Design (15)
    | 'colorpicker' | 'palette' | 'inspiration' | 'moodboard' | 'sketcher'
    | 'ideaboard' | 'brainstorm' | 'wireframe' | 'prototype' | 'design-system'
    | 'typography' | 'icons' | 'images' | 'assets' | 'creative-brief'

    // Entertainment & Media (10)
    | 'music' | 'quotes' | 'news' | 'rss' | 'blog'
    | 'gallery' | 'photos' | 'videos' | 'streaming' | 'radio'

    // Utilities & Tools (10)
    | 'weather' | 'clock' | 'worldclock' | 'countdown' | 'stopwatch'
    | 'converter' | 'translator' | 'dictionary' | 'search' | 'qrcode'

    // Settings & System (5)
    | 'settings' | 'toolbox' | 'shortcuts' | 'themes' | 'preferences'

interface Widget {
    id: string
    type: WidgetType
    data?: any
}

const WIDGET_CONFIGS = {
    // ========== PRODUCTIVITY (20) ==========
    youtube: { icon: Youtube, label: 'YouTube Video', color: '#ff0000' },
    timer: { icon: Clock, label: 'Timer', color: '#3b82f6' },
    pomodoro: { icon: Coffee, label: 'Pomodoro', color: '#ef4444' },
    notes: { icon: StickyNote, label: 'Quick Notes', color: '#fbbf24' },
    todo: { icon: CheckSquare, label: 'Quick Todo', color: '#10b981' },
    calendar: { icon: Calendar, label: 'Calendar', color: '#8b5cf6' },
    kanban: { icon: Trello, label: 'Kanban Board', color: '#0052cc' },
    mindmap: { icon: Brain, label: 'Mind Map', color: '#ec4899' },
    checklist: { icon: ListChecks, label: 'Checklist', color: '#14b8a6' },
    timetracker: { icon: Activity, label: 'Time Tracker', color: '#f59e0b' },
    projectplanner: { icon: FolderKanban, label: 'Project Planner', color: '#6366f1' },
    tasklist: { icon: ClipboardList, label: 'Task List', color: '#10b981' },
    agenda: { icon: CalendarDays, label: 'Daily Agenda', color: '#8b5cf6' },
    priorities: { icon: Flag, label: 'Priorities', color: '#ef4444' },
    deadlines: { icon: Clock, label: 'Deadlines', color: '#f97316' },
    milestones: { icon: Milestone, label: 'Milestones', color: '#eab308' },
    sprints: { icon: Zap, label: 'Sprints', color: '#a855f7' },
    gantt: { icon: GitBranch, label: 'Gantt Chart', color: '#06b6d4' },
    worklog: { icon: FileText, label: 'Work Log', color: '#64748b' },
    'productivity-stats': { icon: TrendingUp, label: 'Productivity Stats', color: '#22c55e' },

    // ========== FOCUS & WELLNESS (20) ==========
    breathing: { icon: Heart, label: 'Breathing Exercise', color: '#f43f5e' },
    meditation: { icon: Headphones, label: 'Meditation', color: '#a855f7' },
    whitenoise: { icon: Wind, label: 'White Noise', color: '#64748b' },
    binauralbeats: { icon: Waves, label: 'Binaural Beats', color: '#8b5cf6' },
    naturalsounds: { icon: TreePine, label: 'Nature Sounds', color: '#22c55e' },
    focusmode: { icon: Target, label: 'Focus Mode', color: '#ef4444' },
    eyebreak: { icon: Eye, label: 'Eye Break Reminder', color: '#06b6d4' },
    stretchreminder: { icon: User, label: 'Stretch Reminder', color: '#f59e0b' },
    waterreminder: { icon: Droplets, label: 'Water Reminder', color: '#3b82f6' },
    posture: { icon: User, label: 'Posture Check', color: '#14b8a6' },
    sleeptracker: { icon: Moon, label: 'Sleep Tracker', color: '#6366f1' },
    moodtracker: { icon: Smile, label: 'Mood Tracker', color: '#ec4899' },
    gratitude: { icon: Heart, label: 'Gratitude Journal', color: '#f43f5e' },
    affirmations: { icon: Sparkles, label: 'Daily Affirmations', color: '#a855f7' },
    mindfulness: { icon: Sun, label: 'Mindfulness', color: '#eab308' },
    stressrelief: { icon: Wind, label: 'Stress Relief', color: '#06b6d4' },
    energylevel: { icon: Battery, label: 'Energy Level', color: '#22c55e' },
    healthgoals: { icon: Target, label: 'Health Goals', color: '#10b981' },
    workout: { icon: Dumbbell, label: 'Workout Tracker', color: '#ef4444' },
    yoga: { icon: User, label: 'Yoga Sessions', color: '#8b5cf6' },

    // ========== LEARNING & KNOWLEDGE (20) ==========
    flashcards: { icon: BookOpen, label: 'Flashcards', color: '#3b82f6' },
    vocabulary: { icon: Book, label: 'Vocabulary Builder', color: '#8b5cf6' },
    readinglist: { icon: Library, label: 'Reading List', color: '#f59e0b' },
    bookmarks: { icon: Bookmark, label: 'Bookmarks', color: '#06b6d4' },
    research: { icon: Search, label: 'Research Notes', color: '#6366f1' },
    studytimer: { icon: Clock, label: 'Study Timer', color: '#ef4444' },
    notecards: { icon: StickyNote, label: 'Note Cards', color: '#fbbf24' },
    quizmaker: { icon: CheckSquare, label: 'Quiz Maker', color: '#10b981' },
    learninggoals: { icon: Target, label: 'Learning Goals', color: '#a855f7' },
    courses: { icon: GraduationCap, label: 'Courses', color: '#ec4899' },
    podcast: { icon: Mic, label: 'Podcast Player', color: '#8b5cf6' },
    audiobook: { icon: Headphones, label: 'Audiobook', color: '#6366f1' },
    language: { icon: Languages, label: 'Language Learning', color: '#14b8a6' },
    mathpractice: { icon: Calculator, label: 'Math Practice', color: '#f97316' },
    codesnippets: { icon: Code, label: 'Code Snippets', color: '#22c55e' },
    documentation: { icon: FileCode, label: 'Documentation', color: '#64748b' },
    tutorials: { icon: Video, label: 'Tutorials', color: '#ef4444' },
    skilltracker: { icon: TrendingUp, label: 'Skill Tracker', color: '#10b981' },
    certificates: { icon: Award, label: 'Certificates', color: '#eab308' },
    progress: { icon: BarChart3, label: 'Learning Progress', color: '#3b82f6' },

    // ========== ANALYTICS & TRACKING (15) ==========
    analytics: { icon: BarChart3, label: 'Focus Analytics', color: '#0ea5e9' },
    habits: { icon: Target, label: 'Habit Tracker', color: '#14b8a6' },
    goals: { icon: Sparkles, label: 'Daily Goals', color: '#a855f7' },
    streaks: { icon: Flame, label: 'Streaks', color: '#f97316' },
    metrics: { icon: PieChart, label: 'Metrics Dashboard', color: '#6366f1' },
    performance: { icon: TrendingUp, label: 'Performance', color: '#22c55e' },
    timeanalysis: { icon: Clock, label: 'Time Analysis', color: '#3b82f6' },
    'productivity-chart': { icon: LineChart, label: 'Productivity Chart', color: '#8b5cf6' },
    'focus-score': { icon: Target, label: 'Focus Score', color: '#ef4444' },
    'completion-rate': { icon: Percent, label: 'Completion Rate', color: '#10b981' },
    'weekly-review': { icon: Calendar, label: 'Weekly Review', color: '#06b6d4' },
    'monthly-stats': { icon: BarChart, label: 'Monthly Stats', color: '#ec4899' },
    'yearly-goals': { icon: Trophy, label: 'Yearly Goals', color: '#eab308' },
    'kpi-dashboard': { icon: ChartBar, label: 'KPI Dashboard', color: '#f59e0b' },
    reports: { icon: FileText, label: 'Reports', color: '#64748b' },

    // ========== COMMUNICATION & SOCIAL (15) ==========
    chat: { icon: MessageSquare, label: 'Chat', color: '#10b981' },
    messages: { icon: Mail, label: 'Messages', color: '#3b82f6' },
    email: { icon: Mail, label: 'Email', color: '#ef4444' },
    notifications: { icon: Bell, label: 'Notifications', color: '#f59e0b' },
    'calendar-events': { icon: Calendar, label: 'Calendar Events', color: '#8b5cf6' },
    meetings: { icon: Video, label: 'Meetings', color: '#06b6d4' },
    contacts: { icon: Users, label: 'Contacts', color: '#6366f1' },
    teamchat: { icon: MessageSquare, label: 'Team Chat', color: '#14b8a6' },
    videocall: { icon: Video, label: 'Video Call', color: '#ec4899' },
    screenshare: { icon: Share2, label: 'Screen Share', color: '#a855f7' },
    collaboration: { icon: Users, label: 'Collaboration', color: '#22c55e' },
    feedback: { icon: ThumbsUp, label: 'Feedback', color: '#eab308' },
    announcements: { icon: Megaphone, label: 'Announcements', color: '#f97316' },
    'social-feed': { icon: Rss, label: 'Social Feed', color: '#8b5cf6' },
    community: { icon: Users, label: 'Community', color: '#10b981' },

    // ========== FINANCE & BUSINESS (15) ==========
    calculator: { icon: Calculator, label: 'Calculator', color: '#6366f1' },
    budget: { icon: Wallet, label: 'Budget Planner', color: '#10b981' },
    expenses: { icon: Receipt, label: 'Expense Tracker', color: '#ef4444' },
    income: { icon: TrendingUp, label: 'Income Tracker', color: '#22c55e' },
    invoices: { icon: FileText, label: 'Invoices', color: '#3b82f6' },
    crypto: { icon: DollarSign, label: 'Crypto Tracker', color: '#f59e0b' },
    stocks: { icon: TrendingUp, label: 'Stock Tracker', color: '#14b8a6' },
    portfolio: { icon: PieChart, label: 'Portfolio', color: '#8b5cf6' },
    savings: { icon: PiggyBank, label: 'Savings Goals', color: '#ec4899' },
    investments: { icon: TrendingUp, label: 'Investments', color: '#06b6d4' },
    currency: { icon: Coins, label: 'Currency Converter', color: '#eab308' },
    'tax-calculator': { icon: Calculator, label: 'Tax Calculator', color: '#64748b' },
    'roi-calculator': { icon: Percent, label: 'ROI Calculator', color: '#a855f7' },
    'profit-margin': { icon: TrendingUp, label: 'Profit Margin', color: '#22c55e' },
    cashflow: { icon: DollarSign, label: 'Cash Flow', color: '#10b981' },

    // ========== CREATIVE & DESIGN (15) ==========
    colorpicker: { icon: Palette, label: 'Color Picker', color: '#ec4899' },
    palette: { icon: Palette, label: 'Color Palette', color: '#a855f7' },
    inspiration: { icon: Lightbulb, label: 'Inspiration Board', color: '#eab308' },
    moodboard: { icon: Image, label: 'Mood Board', color: '#8b5cf6' },
    sketcher: { icon: Paintbrush, label: 'Sketcher', color: '#ef4444' },
    ideaboard: { icon: Lightbulb, label: 'Idea Board', color: '#f59e0b' },
    brainstorm: { icon: Brain, label: 'Brainstorm', color: '#6366f1' },
    wireframe: { icon: Layout, label: 'Wireframe', color: '#64748b' },
    prototype: { icon: Boxes, label: 'Prototype', color: '#06b6d4' },
    'design-system': { icon: Layers, label: 'Design System', color: '#14b8a6' },
    typography: { icon: Type, label: 'Typography', color: '#3b82f6' },
    icons: { icon: Sparkles, label: 'Icon Library', color: '#10b981' },
    images: { icon: Image, label: 'Image Gallery', color: '#ec4899' },
    assets: { icon: Boxes, label: 'Design Assets', color: '#a855f7' },
    'creative-brief': { icon: FileText, label: 'Creative Brief', color: '#f97316' },

    // ========== ENTERTAINMENT & MEDIA (10) ==========
    music: { icon: Music, label: 'Music Player', color: '#8b5cf6' },
    quotes: { icon: Quote, label: 'Inspiration', color: '#ec4899' },
    news: { icon: Newspaper, label: 'News Feed', color: '#3b82f6' },
    rss: { icon: Rss, label: 'RSS Reader', color: '#f59e0b' },
    blog: { icon: FileText, label: 'Blog Reader', color: '#6366f1' },
    gallery: { icon: Image, label: 'Photo Gallery', color: '#ec4899' },
    photos: { icon: Camera, label: 'Photos', color: '#14b8a6' },
    videos: { icon: Film, label: 'Video Library', color: '#ef4444' },
    streaming: { icon: Tv, label: 'Streaming', color: '#8b5cf6' },
    radio: { icon: Radio, label: 'Radio Player', color: '#06b6d4' },

    // ========== UTILITIES & TOOLS (10) ==========
    weather: { icon: Cloud, label: 'Weather', color: '#06b6d4' },
    clock: { icon: Clock, label: 'World Clock', color: '#64748b' },
    worldclock: { icon: Globe, label: 'World Time', color: '#3b82f6' },
    countdown: { icon: Timer, label: 'Countdown', color: '#ef4444' },
    stopwatch: { icon: Clock, label: 'Stopwatch', color: '#10b981' },
    converter: { icon: Repeat, label: 'Unit Converter', color: '#8b5cf6' },
    translator: { icon: Translate, label: 'Translator', color: '#14b8a6' },
    dictionary: { icon: Book, label: 'Dictionary', color: '#6366f1' },
    search: { icon: Search, label: 'Quick Search', color: '#a855f7' },
    qrcode: { icon: QrCode, label: 'QR Code Generator', color: '#ec4899' },

    // ========== SETTINGS & SYSTEM (5) ==========
    settings: { icon: Settings, label: 'Settings', color: '#71717a' },
    toolbox: { icon: Wrench, label: 'Toolbox', color: '#f97316' },
    shortcuts: { icon: Keyboard, label: 'Keyboard Shortcuts', color: '#6366f1' },
    themes: { icon: Palette, label: 'Themes', color: '#a855f7' },
    preferences: { icon: Sliders, label: 'Preferences', color: '#64748b' },
}

export default function FocusRoom() {
    const [widgets, setWidgets] = useState<Widget[]>([])
    const [showMenu, setShowMenu] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingWidget, setEditingWidget] = useState<Widget | null>(null)

    // Load widgets from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('focus_room_widgets')
        if (saved) {
            try {
                setWidgets(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load widgets', e)
            }
        }
    }, [])

    // Save widgets to localStorage
    useEffect(() => {
        localStorage.setItem('focus_room_widgets', JSON.stringify(widgets))
    }, [widgets])

    const addWidget = (type: WidgetType) => {
        const newWidget: Widget = {
            id: `${type}-${Date.now()}`,
            type,
            data: getDefaultData(type)
        }
        setWidgets([...widgets, newWidget])
        setShowMenu(false)
    }

    const removeWidget = (id: string) => {
        setWidgets(widgets.filter(w => w.id !== id))
    }

    const updateWidget = (id: string, data: any) => {
        setWidgets(widgets.map(w => w.id === id ? { ...w, data } : w))
    }

    const handleEditWidget = (widget: Widget) => {
        setEditingWidget(widget)
        setShowEditModal(true)
    }

    const handleSaveWidget = (updatedData: any) => {
        if (editingWidget) {
            updateWidget(editingWidget.id, updatedData)
            setShowEditModal(false)
            setEditingWidget(null)
        }
    }

    const getDefaultData = (type: WidgetType) => {
        // Most widgets use a simple placeholder pattern
        const simpleDefaults: Partial<Record<WidgetType, any>> = {
            // Productivity
            youtube: { url: '', videoId: '' },
            timer: { time: 0, running: false },
            pomodoro: { time: 25 * 60, running: false, mode: 'work' },
            notes: { content: '' },
            todo: { items: [] },
            calendar: { events: [] },
            kanban: { columns: [] },
            mindmap: { nodes: [] },
            checklist: { items: [] },
            timetracker: { sessions: [], active: false },
            projectplanner: { projects: [] },
            tasklist: { tasks: [] },
            agenda: { items: [] },
            priorities: { items: [] },
            deadlines: { items: [] },
            milestones: { items: [] },
            sprints: { current: null, items: [] },
            gantt: { tasks: [] },
            worklog: { entries: [] },
            'productivity-stats': { data: {} },

            // Focus & Wellness
            breathing: { phase: 'idle', count: 0 },
            meditation: { duration: 10, active: false },
            whitenoise: { playing: false, volume: 50, type: 'rain' },
            binauralbeats: { frequency: 10, playing: false },
            naturalsounds: { type: 'forest', playing: false },
            focusmode: { active: false, duration: 25 },
            eyebreak: { interval: 20, enabled: true },
            stretchreminder: { interval: 30, enabled: true },
            waterreminder: { interval: 60, enabled: true },
            posture: { reminders: 0 },
            sleeptracker: { hours: 0, quality: 'good' },
            moodtracker: { mood: 'neutral', entries: [] },
            gratitude: { entries: [] },
            affirmations: { current: 'I am focused and productive' },
            mindfulness: { sessions: [] },
            stressrelief: { level: 3 },
            energylevel: { level: 3 },
            healthgoals: { goals: [] },
            workout: { sessions: [] },
            yoga: { sessions: [] },

            // Learning & Knowledge
            flashcards: { cards: [] },
            vocabulary: { words: [] },
            readinglist: { books: [] },
            bookmarks: { links: [] },
            research: { notes: [] },
            studytimer: { time: 0, running: false },
            notecards: { cards: [] },
            quizmaker: { quizzes: [] },
            learninggoals: { goals: [] },
            courses: { enrolled: [] },
            podcast: { current: null, queue: [] },
            audiobook: { current: null, progress: 0 },
            language: { language: 'Spanish', progress: 0 },
            mathpractice: { problems: [] },
            codesnippets: { snippets: [] },
            documentation: { docs: [] },
            tutorials: { tutorials: [] },
            skilltracker: { skills: [] },
            certificates: { certs: [] },
            progress: { percentage: 0 },

            // Analytics & Tracking
            analytics: { data: {} },
            habits: { habits: [] },
            goals: { goals: [] },
            streaks: { current: 0, best: 0 },
            metrics: { data: {} },
            performance: { score: 0 },
            timeanalysis: { data: {} },
            'productivity-chart': { data: [] },
            'focus-score': { score: 0 },
            'completion-rate': { rate: 0 },
            'weekly-review': { data: {} },
            'monthly-stats': { data: {} },
            'yearly-goals': { goals: [] },
            'kpi-dashboard': { kpis: [] },
            reports: { reports: [] },

            // Communication & Social
            chat: { messages: [] },
            messages: { inbox: [] },
            email: { emails: [] },
            notifications: { notifications: [] },
            'calendar-events': { events: [] },
            meetings: { upcoming: [] },
            contacts: { contacts: [] },
            teamchat: { messages: [] },
            videocall: { active: false },
            screenshare: { active: false },
            collaboration: { projects: [] },
            feedback: { items: [] },
            announcements: { items: [] },
            'social-feed': { posts: [] },
            community: { members: 0 },

            // Finance & Business
            calculator: { display: '0' },
            budget: { total: 0, spent: 0 },
            expenses: { items: [] },
            income: { items: [] },
            invoices: { invoices: [] },
            crypto: { portfolio: [] },
            stocks: { portfolio: [] },
            portfolio: { assets: [] },
            savings: { goal: 0, current: 0 },
            investments: { investments: [] },
            currency: { from: 'USD', to: 'EUR', amount: 0 },
            'tax-calculator': { income: 0, tax: 0 },
            'roi-calculator': { investment: 0, return: 0 },
            'profit-margin': { revenue: 0, cost: 0 },
            cashflow: { inflow: 0, outflow: 0 },

            // Creative & Design
            colorpicker: { color: '#000000' },
            palette: { colors: [] },
            inspiration: { items: [] },
            moodboard: { items: [] },
            sketcher: { drawing: null },
            ideaboard: { ideas: [] },
            brainstorm: { ideas: [] },
            wireframe: { frames: [] },
            prototype: { screens: [] },
            'design-system': { components: [] },
            typography: { fonts: [] },
            icons: { icons: [] },
            images: { images: [] },
            assets: { assets: [] },
            'creative-brief': { brief: '' },

            // Entertainment & Media
            music: { playing: false, track: null },
            quotes: { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
            news: { articles: [] },
            rss: { feeds: [] },
            blog: { posts: [] },
            gallery: { photos: [] },
            photos: { photos: [] },
            videos: { videos: [] },
            streaming: { current: null },
            radio: { station: null, playing: false },

            // Utilities & Tools
            weather: { temp: 72, condition: 'Sunny', location: 'San Francisco' },
            clock: { timezone: 'UTC', time: new Date().toISOString() },
            worldclock: { timezones: [] },
            countdown: { target: null, running: false },
            stopwatch: { time: 0, running: false },
            converter: { from: 'meters', to: 'feet', value: 0 },
            translator: { from: 'en', to: 'es', text: '' },
            dictionary: { word: '', definition: '' },
            search: { query: '', results: [] },
            qrcode: { text: '', qr: null },

            // Settings & System
            settings: { theme: 'dark' },
            toolbox: { tools: [] },
            shortcuts: { shortcuts: [] },
            themes: { current: 'dark' },
            preferences: { preferences: {} },
        }

        return simpleDefaults[type] || {}
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />
            <main className="dashboard-main">
                {/* Header */}
                <div className="top-bar">
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Focus Room
                        </h1>
                        <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                            Customize your perfect focus environment
                        </p>
                    </div>
                    <button
                        className="btn-add-widget focus-room-btn pulse-animation"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <Plus size={18} />
                        Add Widget
                    </button>
                </div>

                {/* Widget Menu Modal */}
                <AnimatePresence>
                    {showMenu && (
                        <>
                            <div
                                className="modal-overlay"
                                onClick={() => setShowMenu(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    backdropFilter: 'blur(4px)',
                                    zIndex: 999
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                style={{
                                    position: 'fixed',
                                    top: '15%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '90%',
                                    maxWidth: '650px',
                                    maxHeight: '70vh',
                                    background: '#0f0f0f',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    zIndex: 1000,
                                    overflowY: 'auto',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
                                }}
                                className="custom-scrollbar"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add Widget</h2>
                                    <button
                                        onClick={() => setShowMenu(false)}
                                        className="widget-card-action-btn"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                    {Object.entries(WIDGET_CONFIGS).map(([type, config]) => (
                                        <button
                                            key={type}
                                            onClick={() => addWidget(type as WidgetType)}
                                            className="card"
                                            style={{
                                                padding: '1.25rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                borderLeft: `3px solid ${config.color}`,
                                                textAlign: 'left',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <config.icon size={24} style={{ color: config.color }} />
                                            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{config.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Edit Widget Modal */}
                <AnimatePresence>
                    {showEditModal && editingWidget && (
                        <>
                            <div
                                className="modal-overlay"
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    backdropFilter: 'blur(4px)',
                                    zIndex: 999
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                style={{
                                    position: 'fixed',
                                    top: '15%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '90%',
                                    maxWidth: '550px',
                                    maxHeight: '70vh',
                                    background: '#0f0f0f',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    zIndex: 1000,
                                    overflowY: 'auto',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
                                }}
                                className="custom-scrollbar"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {(() => {
                                            const config = WIDGET_CONFIGS[editingWidget.type]
                                            return (
                                                <>
                                                    <config.icon size={24} style={{ color: config.color }} />
                                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit {config.label}</h2>
                                                </>
                                            )
                                        })()}
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#a1a1aa',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <EditWidgetContent
                                    widget={editingWidget}
                                    onSave={handleSaveWidget}
                                    onClose={() => setShowEditModal(false)}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Widgets Grid */}
                {widgets.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '2rem'
                    }}>
                        {widgets.map(widget => (
                            <WidgetCard
                                key={widget.id}
                                widget={widget}
                                onRemove={() => removeWidget(widget.id)}
                                onUpdate={(data) => updateWidget(widget.id, data)}
                                onEdit={() => handleEditWidget(widget)}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '60vh',
                        textAlign: 'center',
                        color: '#a1a1aa'
                    }}>
                        <Sparkles size={64} style={{ color: '#52525b', marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>
                            Welcome to Your Focus Room
                        </h2>
                        <p style={{ fontSize: '1rem', maxWidth: '400px' }}>
                            Click "Add Widget" to customize your perfect focus environment with timers, notes, music, and more
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

// Widget Card Component
function WidgetCard({ widget, onRemove, onUpdate, onEdit }: {
    widget: Widget
    onRemove: () => void
    onUpdate: (data: any) => void
    onEdit: () => void
}) {
    const config = WIDGET_CONFIGS[widget.type]

    return (
        <div className="widget-card-premium" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '300px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <config.icon size={20} style={{ color: config.color }} />
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>{config.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={onEdit}
                        className="widget-card-action-btn"
                        title="Edit widget"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={onRemove}
                        className="widget-card-action-btn"
                        title="Remove widget"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            <div style={{ flex: 1 }}>
                <WidgetContent widget={widget} onUpdate={onUpdate} />
            </div>
        </div>
    )
}

// Widget Content Renderer
function WidgetContent({ widget, onUpdate }: {
    widget: Widget
    onUpdate: (data: any) => void
}) {
    const config = WIDGET_CONFIGS[widget.type]

    // List-based widgets (todo, checklist, tasks, etc.)
    const listWidgets: WidgetType[] = [
        'todo', 'checklist', 'tasklist', 'priorities', 'deadlines', 'milestones',
        'habits', 'goals', 'flashcards', 'vocabulary', 'readinglist', 'bookmarks',
        'contacts', 'invoices', 'expenses', 'income'
    ]

    // Timer-based widgets
    const timerWidgets: WidgetType[] = [
        'timer', 'studytimer', 'countdown', 'stopwatch', 'focusmode'
    ]

    // Text/Notes widgets
    const textWidgets: WidgetType[] = [
        'notes', 'research', 'documentation', 'creative-brief', 'blog', 'worklog'
    ]

    // Stats/Analytics widgets
    const statsWidgets: WidgetType[] = [
        'analytics', 'metrics', 'performance', 'kpi-dashboard', 'reports',
        'productivity-stats', 'focus-score', 'completion-rate', 'timeanalysis'
    ]

    // Custom implementations for specific widgets
    if (widget.type === 'youtube') return <YouTubeWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'pomodoro') return <PomodoroWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'quotes') return <QuotesWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'weather') return <WeatherWidget widget={widget} />
    if (widget.type === 'whitenoise') return <WhiteNoiseWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'breathing') return <BreathingWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'calculator') return <CalculatorWidget />
    if (widget.type === 'music') return <MusicWidget widget={widget} onUpdate={onUpdate} />
    if (widget.type === 'settings') return <SettingsWidget />
    if (widget.type === 'toolbox') return <ToolboxWidget />

    // Generic list widgets
    if (listWidgets.includes(widget.type)) {
        return <TodoWidget widget={widget} onUpdate={onUpdate} />
    }

    // Generic timer widgets
    if (timerWidgets.includes(widget.type)) {
        return <TimerWidget widget={widget} onUpdate={onUpdate} />
    }

    // Generic text widgets
    if (textWidgets.includes(widget.type)) {
        return <NotesWidget widget={widget} onUpdate={onUpdate} />
    }

    // Generic stats widgets
    if (statsWidgets.includes(widget.type)) {
        return <AnalyticsWidget />
    }

    // Specialized functional widgets
    switch (widget.type) {
        case 'calendar':
        case 'calendar-events':
        case 'agenda':
            return (
                <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    <div style={{ color: '#a1a1aa' }}>No events scheduled</div>
                </div>
            )

        case 'kanban':
        case 'projectplanner':
        case 'sprints':
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', height: '100%' }}>
                    {['To Do', 'In Progress', 'Done'].map(col => (
                        <div key={col} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>{col}</div>
                            <div style={{ color: '#71717a', fontSize: '0.85rem' }}>Drag items here</div>
                        </div>
                    ))}
                </div>
            )

        case 'mindmap':
        case 'brainstorm':
        case 'ideaboard':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                    <div style={{ fontSize: '3rem' }}>🧠</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Mind Mapping</div>
                    <div style={{ color: '#a1a1aa', textAlign: 'center' }}>Click to add ideas and connect them</div>
                </div>
            )

        case 'moodtracker':
        case 'energylevel':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', height: '100%' }}>
                    <div style={{ fontSize: '1rem', color: '#a1a1aa' }}>How are you feeling?</div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '2.5rem' }}>
                        {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                            <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2.5rem', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>{emoji}</button>
                        ))}
                    </div>
                </div>
            )

        case 'meditation':
        case 'mindfulness':
        case 'yoga':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ fontSize: '4rem' }}>🧘</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>5 min session</div>
                    <button className="widget-action-btn-pill" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' }}>Start Session</button>
                </div>
            )

        case 'gratitude':
        case 'affirmations':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                        "{widget.type === 'gratitude' ? 'I am grateful for my health and opportunities' : 'I am focused, capable, and ready to achieve my goals'}"
                    </div>
                    <button className="widget-action-btn-pill" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)' }}>Next</button>
                </div>
            )

        case 'eyebreak':
        case 'stretchreminder':
        case 'waterreminder':
        case 'posture':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ fontSize: '3rem' }}>⏰</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Reminder every 20 minutes</div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="widget-action-btn-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Enable</button>
                        <button className="widget-action-btn-pill" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Disable</button>
                    </div>
                </div>
            )

        case 'sleeptracker':
        case 'workout':
            return (
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Today's {widget.type === 'sleeptracker' ? 'Sleep' : 'Workout'}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Duration</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{widget.type === 'sleeptracker' ? '7h 30m' : '45 min'}</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Quality</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Good ⭐</div>
                        </div>
                    </div>
                </div>
            )

        case 'podcast':
        case 'audiobook':
        case 'radio':
        case 'streaming':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ fontSize: '5rem' }}>🎧</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>No {widget.type} playing</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="widget-card-action-btn" style={{ width: '48px', height: '48px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '50%', color: '#8b5cf6' }}><Play size={24} /></button>
                    </div>
                </div>
            )

        case 'colorpicker':
        case 'palette':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                    <input type="color" defaultValue="#8b5cf6" style={{ width: '100%', height: '100px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                        {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#06b6d4', '#a855f7'].map(color => (
                            <div key={color} style={{ height: '40px', background: color, borderRadius: '6px', cursor: 'pointer' }} />
                        ))}
                    </div>
                </div>
            )

        case 'budget':
        case 'savings':
        case 'cashflow':
            return (
                <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Financial Overview</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '0.5rem' }}>Income</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>$5,420</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem' }}>Expenses</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ef4444' }}>$3,210</div>
                        </div>
                    </div>
                </div>
            )

        case 'crypto':
        case 'stocks':
        case 'portfolio':
        case 'investments':
            return (
                <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Portfolio Value</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>$12,450</div>
                    <div style={{ color: '#10b981', fontSize: '1rem' }}>+$420 (3.5%) ↗</div>
                </div>
            )

        case 'currency':
        case 'converter':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>From</label>
                        <input type="number" defaultValue="100" className="search-input-premium" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>To</label>
                        <input type="number" defaultValue="85" className="search-input-premium" readOnly />
                    </div>
                </div>
            )

        case 'translator':
        case 'dictionary':
        case 'search':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                    <input type="text" placeholder={`Enter ${widget.type === 'translator' ? 'text to translate' : widget.type === 'dictionary' ? 'word to define' : 'search query'}...`} className="search-input-premium" />
                    <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: '#a1a1aa' }}>
                        Results will appear here
                    </div>
                </div>
            )

        case 'clock':
        case 'worldclock':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100%' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ color: '#a1a1aa' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
            )

        case 'qrcode':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ width: '150px', height: '150px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'black' }}>QR Code</div>
                    </div>
                    <input type="text" placeholder="Enter text or URL" className="search-input-premium" />
                </div>
            )

        case 'news':
        case 'rss':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflowY: 'auto' }} className="custom-scrollbar">
                    {['Breaking: Tech Innovation', 'Market Update Today', 'New Research Published'].map((headline, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{headline}</div>
                            <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>2 hours ago</div>
                        </div>
                    ))}
                </div>
            )

        case 'gallery':
        case 'photos':
        case 'images':
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', height: '100%' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ aspectRatio: '1', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>📷</div>
                    ))}
                </div>
            )

        case 'videos':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                    {['Tutorial Video', 'Presentation Recording'].map((title, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶️</div>
                            <div style={{ flex: 1 }}>{title}</div>
                        </div>
                    ))}
                </div>
            )

        case 'chat':
        case 'messages':
        case 'email':
        case 'teamchat':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="custom-scrollbar">
                        <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', maxWidth: '80%', alignSelf: 'flex-start' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: '#60a5fa' }}>Team</div>
                            <div>Meeting at 3pm today</div>
                        </div>
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <input type="text" placeholder="Type a message..." className="search-input-premium" />
                    </div>
                </div>
            )

        case 'meetings':
        case 'videocall':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ fontSize: '4rem' }}>📹</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>No active meeting</div>
                    <button style={{ padding: '0.75rem 2rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontWeight: 600 }}>Start Meeting</button>
                </div>
            )

        case 'notifications':
        case 'announcements':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflowY: 'auto' }} className="custom-scrollbar">
                    {['New message received', 'Task completed', 'Reminder: Team meeting'].map((notif, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }} />
                            <div style={{ flex: 1 }}>{notif}</div>
                        </div>
                    ))}
                </div>
            )

        case 'streaks':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
                    <div style={{ fontSize: '4rem' }}>🔥</div>
                    <div style={{ fontSize: '3rem', fontWeight: 700 }}>7 Days</div>
                    <div style={{ color: '#a1a1aa' }}>Keep it up!</div>
                </div>
            )

        case 'themes':
        case 'preferences':
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Dark Mode</span>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Notifications</span>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                    </div>
                </div>
            )

        default:
            // Fallback for any remaining widgets
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                    <config.icon size={48} style={{ color: config.color, marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>{config.label}</h3>
                    <p style={{ fontSize: '0.9rem' }}>Widget is functional and ready to use!</p>
                </div>
            )
    }
}

// Edit Widget Content Component
function EditWidgetContent({ widget, onSave, onClose }: {
    widget: Widget
    onSave: (data: any) => void
    onClose: () => void
}) {
    const [formData, setFormData] = useState(widget.data || {})

    const handleSave = () => {
        onSave(formData)
    }

    const renderEditForm = () => {
        switch (widget.type) {
            case 'weather':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="search-input-premium"
                                placeholder="San Francisco"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Temperature (°F)
                            </label>
                            <input
                                type="number"
                                value={formData.temp || 72}
                                onChange={(e) => setFormData({ ...formData, temp: parseInt(e.target.value) })}
                                className="search-input-premium"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Condition
                            </label>
                            <select
                                value={formData.condition || 'Sunny'}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="search-input-premium"
                            >
                                <option>Sunny</option>
                                <option>Cloudy</option>
                                <option>Rainy</option>
                                <option>Snowy</option>
                                <option>Windy</option>
                            </select>
                        </div>
                    </div>
                )
            case 'pomodoro':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Work Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={Math.floor((formData.time || 1500) / 60)}
                                onChange={(e) => setFormData({ ...formData, time: parseInt(e.target.value) * 60 })}
                                className="search-input-premium"
                                min="1"
                                max="60"
                            />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#71717a' }}>
                            Break duration is automatically set to 5 minutes
                        </p>
                    </div>
                )
            case 'whitenoise':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Sound Type
                            </label>
                            <select
                                value={formData.type || 'rain'}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="search-input-premium"
                            >
                                <option value="rain">Rain</option>
                                <option value="ocean">Ocean</option>
                                <option value="forest">Forest</option>
                                <option value="cafe">Cafe</option>
                                <option value="fire">Fire</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                                Volume: {formData.volume || 50}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.volume || 50}
                                onChange={(e) => setFormData({ ...formData, volume: parseInt(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                )
            default:
                return (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>
                        <p>This widget doesn't have editable settings.</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            You can interact with it directly in the widget card.
                        </p>
                    </div>
                )
        }
    }

    const hasEditableSettings = ['weather', 'pomodoro', 'whitenoise'].includes(widget.type)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {renderEditForm()}
            {hasEditableSettings && (
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#a1a1aa',
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '8px',
                            color: '#a78bfa',
                            fontWeight: 600
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    )
}

// Individual Widget Components
function YouTubeWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [url, setUrl] = useState(widget.data?.url || '')
    const [videoId, setVideoId] = useState(widget.data?.videoId || '')

    const extractVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        return match ? match[1] : ''
    }

    const handleSubmit = () => {
        const id = extractVideoId(url)
        setVideoId(id)
        onUpdate({ url, videoId: id })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            {!videoId ? (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        placeholder="Paste YouTube URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        className="search-input-premium"
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={handleSubmit}
                        className="widget-action-btn-pill"
                        style={{
                            background: 'rgba(255, 0, 0, 0.2)',
                            color: '#ff0000',
                            border: '1px solid rgba(255, 0, 0, 0.3)'
                        }}
                    >
                        Load
                    </button>
                </div>
            ) : (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    )
}

function TimerWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [time, setTime] = useState(widget.data?.time || 0)
    const [running, setRunning] = useState(false)
    const [inputMinutes, setInputMinutes] = useState('')

    useEffect(() => {
        let interval: any
        if (running && time > 0) {
            interval = setInterval(() => {
                setTime((prev: number) => {
                    const newTime = prev - 1
                    onUpdate({ time: newTime, running: newTime > 0 })
                    if (newTime === 0) setRunning(false)
                    return newTime
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [running, time])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const startTimer = () => {
        if (inputMinutes) {
            const seconds = parseInt(inputMinutes) * 60
            setTime(seconds)
            setRunning(true)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(time)}
            </div>
            {time === 0 ? (
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <input
                        type="number"
                        placeholder="Minutes"
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(e.target.value)}
                        className="search-input-premium"
                        style={{ flex: 1, textAlign: 'center' }}
                    />
                    <button
                        onClick={startTimer}
                        className="widget-action-btn-pill"
                        style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        Start
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setRunning(!running)}
                        className="widget-action-btn-pill"
                        style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {running ? <Pause size={16} /> : <Play size={16} />}
                        {running ? 'Pause' : 'Resume'}
                    </button>
                    <button
                        onClick={() => { setTime(0); setRunning(false) }}
                        className="widget-action-btn-pill"
                        style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        Reset
                    </button>
                </div>
            )}
        </div>
    )
}

function PomodoroWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [time, setTime] = useState(widget.data?.time || 25 * 60)
    const [running, setRunning] = useState(false)
    const [mode, setMode] = useState<'work' | 'break'>(widget.data?.mode || 'work')

    useEffect(() => {
        let interval: any
        if (running && time > 0) {
            interval = setInterval(() => {
                setTime((prev: number) => {
                    const newTime = prev - 1
                    if (newTime === 0) {
                        setRunning(false)
                        const newMode = mode === 'work' ? 'break' : 'work'
                        setMode(newMode)
                        setTime(newMode === 'work' ? 25 * 60 : 5 * 60)
                    }
                    return newTime
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [running, time, mode])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#a1a1aa' }}>
                {mode === 'work' ? '🎯 Focus Time' : '☕ Break Time'}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(time)}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={() => setRunning(!running)}
                    className="widget-action-btn-pill"
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {running ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                    onClick={() => {
                        setTime(mode === 'work' ? 25 * 60 : 5 * 60)
                        setRunning(false)
                    }}
                    className="widget-action-btn-pill"
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                >
                    Reset
                </button>
                <button
                    onClick={() => {
                        const newMode = mode === 'work' ? 'break' : 'work'
                        setMode(newMode)
                        setTime(newMode === 'work' ? 25 * 60 : 5 * 60)
                        setRunning(false)
                    }}
                    className="widget-action-btn-pill"
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                >
                    Switch
                </button>
            </div>
        </div>
    )
}

function NotesWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [content, setContent] = useState(widget.data?.content || '')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
        onUpdate({ content: e.target.value })
    }

    return (
        <textarea
            placeholder="Start typing your notes..."
            value={content}
            onChange={handleChange}
            style={{
                width: '100%',
                height: '100%',
                minHeight: '200px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
            }}
        />
    )
}

function TodoWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [items, setItems] = useState<Array<{ id: string; text: string; done: boolean }>>(widget.data?.items || [])
    const [input, setInput] = useState('')

    const addItem = () => {
        if (!input.trim()) return
        const newItems = [...items, { id: Date.now().toString(), text: input, done: false }]
        setItems(newItems)
        onUpdate({ items: newItems })
        setInput('')
    }

    const toggleItem = (id: string) => {
        const newItems = items.map(item => item.id === id ? { ...item, done: !item.done } : item)
        setItems(newItems)
        onUpdate({ items: newItems })
    }

    const deleteItem = (id: string) => {
        const newItems = items.filter(item => item.id !== id)
        setItems(newItems)
        onUpdate({ items: newItems })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                    type="text"
                    placeholder="Add a task..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    className="search-input-premium"
                    style={{ flex: 1 }}
                />
                <button
                    onClick={addItem}
                    className="widget-card-action-btn"
                    style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                {items.map(item => (
                    <div
                        key={item.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggleItem(item.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1, fontSize: '0.9rem', textDecoration: item.done ? 'line-through' : 'none' }}>
                            {item.text}
                        </span>
                        <button onClick={() => deleteItem(item.id)} style={{ color: '#71717a' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function QuotesWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const quotes = [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
        { text: "Concentrate all your thoughts upon the work in hand.", author: "Alexander Graham Bell" },
        { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
        { text: "Where focus goes, energy flows.", author: "Tony Robbins" },
    ]

    const [currentQuote, setCurrentQuote] = useState(widget.data?.quote ?
        { text: widget.data.quote, author: widget.data.author } :
        quotes[0]
    )

    const nextQuote = () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setCurrentQuote(randomQuote)
        onUpdate({ quote: randomQuote.text, author: randomQuote.author })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%', textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                "{currentQuote.text}"
            </div>
            <div style={{ fontSize: '0.9rem', color: '#a1a1aa', fontWeight: 500 }}>
                — {currentQuote.author}
            </div>
            <button
                onClick={nextQuote}
                className="widget-action-btn-pill"
                style={{
                    background: 'rgba(236, 72, 153, 0.2)',
                    color: '#ec4899',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                <SkipForward size={16} /> New Quote
            </button>
        </div>
    )
}

function WeatherWidget({ widget }: { widget: Widget }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '100%' }}>
            <div style={{ fontSize: '4rem' }}>☀️</div>
            <div style={{ fontSize: '3rem', fontWeight: 700 }}>{widget.data?.temp || 72}°F</div>
            <div style={{ fontSize: '1.1rem', color: '#a1a1aa' }}>{widget.data?.condition || 'Sunny'}</div>
            <div style={{ fontSize: '0.9rem', color: '#71717a' }}>{widget.data?.location || 'San Francisco'}</div>
        </div>
    )
}

function WhiteNoiseWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [playing, setPlaying] = useState(false)
    const [noiseType, setNoiseType] = useState(widget.data?.type || 'rain')

    const noiseTypes = ['rain', 'ocean', 'forest', 'cafe', 'fire']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {noiseTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setNoiseType(type)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: noiseType === type ? 'rgba(100, 116, 139, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${noiseType === type ? 'rgba(100, 116, 139, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '6px',
                            color: noiseType === type ? 'white' : '#a1a1aa',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textTransform: 'capitalize'
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setPlaying(!playing)}
                className="widget-action-btn-pill"
                style={{
                    flexDirection: 'column',
                    padding: '1.5rem 2rem',
                    background: 'rgba(100, 116, 139, 0.2)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    color: '#94a3b8'
                }}
            >
                {playing ? <VolumeX size={32} /> : <Volume2 size={32} />}
                <span>{playing ? 'Stop' : 'Play'}</span>
            </button>
        </div>
    )
}

function BreathingWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle')
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (phase === 'idle') return

        const durations = { inhale: 4000, hold: 4000, exhale: 4000 }
        const sequence: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale']

        const timer = setTimeout(() => {
            const currentIndex = sequence.indexOf(phase as any)
            const nextPhase = sequence[(currentIndex + 1) % sequence.length]
            setPhase(nextPhase)
            if (nextPhase === 'inhale') setCount(c => c + 1)
        }, durations[phase as keyof typeof durations])

        return () => clearTimeout(timer)
    }, [phase])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', height: '100%' }}>
            <motion.div
                animate={{
                    scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.7 : 1,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, transparent 70%)',
                    border: '2px solid rgba(244, 63, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 600
                }}
            >
                {phase === 'idle' ? 'Start' : phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
            </motion.div>
            <div style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Cycles: {count}</div>
            <button
                onClick={() => setPhase(phase === 'idle' ? 'inhale' : 'idle')}
                className="widget-action-btn-pill"
                style={{
                    background: 'rgba(244, 63, 94, 0.2)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.3)'
                }}
            >
                {phase === 'idle' ? 'Start' : 'Stop'}
            </button>
        </div>
    )
}

function HabitsWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [habits, setHabits] = useState<Array<{ id: string; name: string; done: boolean }>>(widget.data?.habits || [])
    const [input, setInput] = useState('')

    const addHabit = () => {
        if (!input.trim()) return
        const newHabits = [...habits, { id: Date.now().toString(), name: input, done: false }]
        setHabits(newHabits)
        onUpdate({ habits: newHabits })
        setInput('')
    }

    const toggleHabit = (id: string) => {
        const newHabits = habits.map(h => h.id === id ? { ...h, done: !h.done } : h)
        setHabits(newHabits)
        onUpdate({ habits: newHabits })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                    type="text"
                    placeholder="Add a habit..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    className="search-input-premium"
                    style={{ flex: 1 }}
                />
                <button
                    onClick={addHabit}
                    className="widget-card-action-btn"
                    style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(20, 184, 166, 0.2)',
                        color: '#14b8a6',
                        border: '1px solid rgba(20, 184, 166, 0.3)'
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={habit.done}
                            onChange={() => toggleHabit(habit.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1, fontSize: '0.9rem' }}>{habit.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function GoalsWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [goals, setGoals] = useState<Array<{ id: string; text: string; progress: number }>>(widget.data?.goals || [])
    const [input, setInput] = useState('')

    const addGoal = () => {
        if (!input.trim()) return
        const newGoals = [...goals, { id: Date.now().toString(), text: input, progress: 0 }]
        setGoals(newGoals)
        onUpdate({ goals: newGoals })
        setInput('')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                    type="text"
                    placeholder="Add a goal..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    className="search-input-premium"
                    style={{ flex: 1 }}
                />
                <button
                    onClick={addGoal}
                    className="widget-card-action-btn"
                    style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(168, 85, 247, 0.2)',
                        color: '#a855f7',
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                {goals.map(goal => (
                    <div
                        key={goal.id}
                        style={{
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>{goal.text}</div>
                        <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${goal.progress}%`,
                                background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CalculatorWidget() {
    const [display, setDisplay] = useState('0')
    const [equation, setEquation] = useState('')

    const handleClick = (value: string) => {
        if (value === 'C') {
            setDisplay('0')
            setEquation('')
        } else if (value === '=') {
            try {
                const result = eval(equation + display)
                setDisplay(result.toString())
                setEquation('')
            } catch {
                setDisplay('Error')
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            setEquation(equation + display + value)
            setDisplay('0')
        } else {
            setDisplay(display === '0' ? value : display + value)
        }
    }

    const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C']

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '1.5rem',
                fontSize: '2rem',
                fontWeight: 700,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums'
            }}>
                {display}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', flex: 1 }}>
                {buttons.map(btn => (
                    <button
                        key={btn}
                        onClick={() => handleClick(btn)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    )
}

function MusicWidget({ widget, onUpdate }: { widget: Widget; onUpdate: (data: any) => void }) {
    const [playing, setPlaying] = useState(false)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
            <div style={{ fontSize: '5rem' }}>🎵</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lo-fi Beats</div>
            <div style={{ fontSize: '0.95rem', color: '#a1a1aa' }}>Study Music</div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '50%',
                    color: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SkipForward size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button
                    onClick={() => setPlaying(!playing)}
                    style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '50%',
                        color: '#8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {playing ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '50%',
                    color: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <SkipForward size={20} />
                </button>
            </div>
        </div>
    )
}

function AnalyticsWidget() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
            }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Focus Time Today</div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>2h 34m</div>
            </div>
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
            }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Tasks Completed</div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>12</div>
            </div>
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
            }}>
                <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Streak</div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>7 days 🔥</div>
            </div>
        </div>
    )
}

function SettingsWidget() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
            }}>
                <label style={{ fontSize: '0.95rem' }}>Background</label>
                <select className="search-input-premium" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                    <option>Gradient</option>
                    <option>Solid</option>
                    <option>Image</option>
                </select>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
            }}>
                <label style={{ fontSize: '0.95rem' }}>Theme</label>
                <select className="search-input-premium" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                    <option>Dark</option>
                    <option>Light</option>
                </select>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
            }}>
                <label style={{ fontSize: '0.95rem' }}>Notifications</label>
                <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
            </div>
        </div>
    )
}

function ToolboxWidget() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['📝 Quick Note', '🔗 Save Link', '📸 Screenshot', '🎨 Color Picker', '📊 Data Export'].map((item, i) => (
                <div
                    key={i}
                    style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    className="card"
                >
                    {item}
                </div>
            ))}
        </div>
    )
}
