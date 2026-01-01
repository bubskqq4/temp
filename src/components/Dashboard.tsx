'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search,
    ChevronRight,
    MoreVertical,
    Plus,
    Filter,
    SortAsc,
    User,
    Zap,
    Clock as ClockIcon,
    Check,
    Target,
    Sparkles,
    TrendingUp,
    AlertCircle,
    Bell,
    X,
    Calendar as CalendarIcon,
    Briefcase, Camera, Coffee, Compass,
    Cpu, CreditCard, Database, Earth, Eye,
    Flag, Folder, Gift, Globe, HardDrive,
    Heart, Home, Image, Info, Key,
    Layers, Link, Lock, Mail, Map,
    MessageCircle, Mic, Moon, Music, Navigation,
    Package, Paperclip, PenTool, Phone, PieChart,
    Play, Rocket, Save, Send,
    Settings, Shield, ShoppingBag, Smile, Speaker,
    Star, Sun, Tag as TagIcon, Terminal, Trash,
    Truck, Tv, Umbrella, Video
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AddCategoryModal } from './AddCategoryModal'
import { useDroppable } from '@dnd-kit/core'

import { AddTaskModal } from './AddTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { WelcomeModal } from './WelcomeModal'
import { ContextMenu } from './ContextMenu'
import { EditColumnModal } from './EditColumnModal'



// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

const ICON_MAP: Record<string, any> = {
    Target, Zap, Sparkles, TrendingUp, Clock: ClockIcon,
    Briefcase, Calendar: CalendarIcon, Camera, Coffee, Compass,
    Cpu, CreditCard, Database, Earth, Eye,
    Flag, Folder, Gift, Globe, HardDrive,
    Heart, Home, Image, Info, Key,
    Layers, Link, Lock, Mail, Map,
    MessageCircle, Mic, Moon, Music, Navigation,
    Package, Paperclip, PenTool, Phone, PieChart,
    Play, Rocket, Save, Search, Send,
    Settings, Shield, ShoppingBag, Smile, Speaker,
    Star, Sun, Tag: TagIcon, Terminal, Trash,
    Truck, Tv, Umbrella, User, Video
}

const Tag = ({ label, color }: { label: string, color?: string }) => {
    const colors: Record<string, { bg: string, text: string }> = {
        beige: { bg: '#2c2b28', text: '#d6d3d1' },
        green: { bg: '#1e2d24', text: '#a7f3d0' },
        red: { bg: '#2d1e1e', text: '#fecaca' },
        blue: { bg: '#1e232d', text: '#bfdbfe' },
        default: { bg: '#27272a', text: '#a1a1aa' }
    }
    const style = colors[color || 'default'] || colors.default

    return (
        <span className="task-tag" style={{ backgroundColor: style.bg, color: style.text }}>
            {label}
        </span>
    )
}

const TaskDropdown = ({
    isOpen,
    onClose,
    onDelete,
    onEdit,
    onDuplicate,
    onUrgent
}: {
    isOpen: boolean,
    onClose: () => void,
    onDelete: () => void,
    onEdit: () => void,
    onDuplicate: () => void,
    onUrgent: () => void
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="inbox-dropdown"
            style={{ top: '30px', right: '0' }}
        >
            <button className="dropdown-item" onClick={onEdit}>Edit</button>
            <button className="dropdown-item" onClick={onUrgent}>Mark as Urgent</button>
            <button className="dropdown-item" onClick={onDuplicate}>Duplicate</button>
            <button className="dropdown-item">Move to...</button>
            <div className="dropdown-divider" />
            <button className="dropdown-item delete" onClick={onDelete}>Delete</button>
        </motion.div>
    )
}

const TaskCard = ({ id, title, dueDate, tags, avatar, avatarActive, onComplete, onEdit, onDuplicate, onUrgent, isOverlay, onTaskContextMenu }: {
    id: string,
    title: string,
    dueDate?: string,
    tags?: { label: string, color?: string }[],
    avatar?: string,
    avatarActive?: boolean,
    onComplete?: (id: string) => void,
    onEdit?: (task: any) => void,
    onDuplicate?: (id: string) => void,
    onUrgent?: (id: string) => void,
    isOverlay?: boolean,
    onTaskContextMenu?: (e: React.MouseEvent, taskId: string) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    const [isCompleting, setIsCompleting] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleCheck = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsCompleting(true)
        setTimeout(() => {
            onComplete?.(id)
        }, 400)
    }

    // When used in DragOverlay, we want a premium "lifted" look
    const overlayStyles = isOverlay ? {
        transform: 'rotate(3deg) scale(1.02)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        cursor: 'grabbing',
        zIndex: 1000,
    } : {}

    return (
        <div
            ref={setNodeRef}
            style={isOverlay ? overlayStyles : style}
            {...attributes}
            {...listeners}
            className={cn("task-card", isCompleting && "completing", isOverlay && "dragging-overlay")}
            onContextMenu={(e) => {
                if (onTaskContextMenu && !isOverlay) {
                    onTaskContextMenu(e, id)
                }
            }}
        >
            <div className="task-main">
                <button
                    className={cn("task-checkbox", isCompleting && "checked")}
                    onClick={handleCheck}
                >
                    {isCompleting && <Check size={12} color="white" />}
                </button>
                <div className="task-content">
                    <div className="task-title-row">
                        <span className={cn("task-title", isCompleting && "strikethrough")}>{title}</span>
                        <div className="relative" onPointerDown={e => e.stopPropagation()}>
                            <button
                                className={cn("task-more-btn", isMenuOpen && "active")}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsMenuOpen(!isMenuOpen)
                                }}
                            >
                                <MoreVertical size={14} />
                            </button>
                            {isMenuOpen && (
                                <TaskDropdown
                                    isOpen={isMenuOpen}
                                    onClose={() => setIsMenuOpen(false)}
                                    onDelete={() => onComplete?.(id)}
                                    onEdit={() => {
                                        setIsMenuOpen(false)
                                        onEdit?.({ id, title, dueDate, tags, avatar, avatarActive })
                                    }}
                                    onDuplicate={() => {
                                        setIsMenuOpen(false)
                                        onDuplicate?.(id)
                                    }}
                                    onUrgent={() => {
                                        setIsMenuOpen(false)
                                        onUrgent?.(id)
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="task-due" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                        <CalendarIcon size={12} />
                        <span>{dueDate ? `Due ${dueDate}` : 'No due date'}</span>
                    </div>

                    {/* Right-click hint */}
                    {!isOverlay && (
                        <div
                            className="task-context-hint"
                            title="Right-click for more options"
                            style={{
                                position: 'absolute',
                                bottom: '0.5rem',
                                right: '0.5rem',
                                opacity: 0.3,
                                fontSize: '0.7rem',
                                color: '#71717a',
                                pointerEvents: 'none',
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            Right-click for options
                        </div>
                    )}

                    {tags && tags.length > 0 && (
                        <div className="task-tags">
                            {tags.map((tag, i) => (
                                <Tag key={i} label={tag.label} color={tag.color} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="task-footer">
                <div className={cn("task-user-tag", avatarActive && "active")}>
                    {avatar || 'ET'}
                </div>
            </div>
        </div>
    )
}

// Wrapper to make the column sortable
const SortableTaskColumn = ({ column, tasks, onCompleteTask, onOpenModal, onEditTask, onDuplicateTask, onUrgentTask, onColumnContextMenu, onTaskContextMenu }: {
    column: ColumnDef,
    tasks: any[],
    onCompleteTask: (id: string) => void,
    onOpenModal: (columnId: string) => void,
    onEditTask: (task: any) => void,
    onDuplicateTask: (id: string) => void,
    onUrgentTask: (id: string) => void,
    onColumnContextMenu?: (e: React.MouseEvent, columnId: string) => void,
    onTaskContextMenu?: (e: React.MouseEvent, taskId: string, columnId: string) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="task-column-wrapper">
            <TaskColumn
                title={column.title}
                columnId={column.id}
                tasks={tasks}
                dragHandleProps={{ ...attributes, ...listeners }}
                onCompleteTask={onCompleteTask}
                onOpenModal={onOpenModal}
                onEditTask={onEditTask}
                onDuplicateTask={onDuplicateTask}
                onUrgentTask={onUrgentTask}
                icon={column.icon}
                onColumnContextMenu={onColumnContextMenu}
                onTaskContextMenu={onTaskContextMenu}
            />
        </div>
    );
};

// Updated TaskColumn to be a Droppable zone
const TaskColumn = ({ title, columnId, icon, tasks, dragHandleProps, onCompleteTask, onOpenModal, onEditTask, onDuplicateTask, onUrgentTask, onColumnContextMenu, onTaskContextMenu }: {
    title: string,
    columnId: string,
    icon?: string,
    tasks: any[],
    dragHandleProps?: any,
    onCompleteTask: (id: string) => void,
    onOpenModal: (columnId: string) => void,
    onEditTask: (task: any) => void,
    onDuplicateTask: (id: string) => void,
    onUrgentTask: (id: string) => void,
    onColumnContextMenu?: (e: React.MouseEvent, columnId: string) => void,
    onTaskContextMenu?: (e: React.MouseEvent, taskId: string, columnId: string) => void
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: columnId,
        data: {
            type: "Column",
            columnId,
        },
    });

    const getColumnIcon = () => {
        if (icon && ICON_MAP[icon]) {
            const IconComp = ICON_MAP[icon]
            return <IconComp size={14} />
        }

        // Fallback for legacy columns
        switch (columnId) {
            case 'schedule': return <ClockIcon size={14} />
            case 'active': return <Zap size={14} />
            case 'creative': return <Sparkles size={14} />
            case 'leads': return <TrendingUp size={14} />
            default: return <Target size={14} />
        }
    }

    return (
        <div className={cn("task-column", isOver && "is-over")} ref={setNodeRef} style={{ position: 'relative' }}>
            {/* Invisible overlay for right-click context menu */}
            {onColumnContextMenu && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        pointerEvents: 'all'
                    }}
                    onContextMenu={(e) => onColumnContextMenu(e, columnId)}
                />
            )}
            <div className="column-header" {...dragHandleProps} style={{ position: 'relative', zIndex: 1 }}>
                <div className="column-title-group">
                    <div className="column-icon">
                        {getColumnIcon()}
                    </div>
                    <span className="column-title font-serif">{title}</span>
                    <span className="count">{tasks.length}</span>
                </div>
                <div className="column-actions">
                    <button onClick={() => onOpenModal(columnId)} className="icon-btn-small" onPointerDown={(e) => e.stopPropagation()}>
                        <Plus size={14} />
                    </button>
                    <div className="drag-handle-icon" style={{ cursor: 'grab' }}>
                        <SortAsc size={14} />
                    </div>
                </div>
            </div>
            <div className="column-content" id={columnId} style={{ position: 'relative', zIndex: 1 }}>
                <SortableContext
                    id={columnId}
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                {...task}
                                onComplete={onCompleteTask}
                                onEdit={onEditTask}
                                onDuplicate={onDuplicateTask}
                                onUrgent={onUrgentTask}
                                onTaskContextMenu={(e, taskId) => {
                                    if (onTaskContextMenu) {
                                        onTaskContextMenu(e, taskId, columnId)
                                    }
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </SortableContext>
            </div>
        </div>
    )
}

interface Task {
    id: string
    title: string
    dueDate?: string
    tags?: { label: string; color?: string }[]
    avatar?: string
    avatarActive?: boolean
}

// Changed to Record for dynamic keys
type TaskState = Record<string, Task[]>

interface ColumnDef {
    id: string
    title: string
    icon?: string
    color?: string
}

export const Dashboard = () => {
    const [time, setTime] = useState<Date | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false)
    const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false)
    const [editingColumn, setEditingColumn] = useState<ColumnDef | null>(null)

    const [activeColumn, setActiveColumn] = useState<string | null>(null)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // Dynamic columns state
    const [columns, setColumns] = useState<ColumnDef[]>([
        { id: 'schedule', title: "Today's Schedule", icon: 'Clock' },
        { id: 'active', title: "Active Tasks", icon: 'Zap' },
        { id: 'creative', title: "Creative Incubator", icon: 'Sparkles' },
        { id: 'leads', title: "Business Leads", icon: 'TrendingUp' }
    ])

    const [tasks, setTasks] = useState<TaskState>({
        schedule: [],
        active: [],
        creative: [],
        leads: []
    })

    const isLoaded = useRef(false)
    const [activeDragItem, setActiveDragItem] = useState<any>(null)
    const [globalProgress, setGlobalProgress] = useState(0)
    const [activeProjectsCount, setActiveProjectsCount] = useState(0)
    const [userName, setUserName] = useState('Founder')
    const router = useRouter()

    // Context menu state
    const [columnContextMenu, setColumnContextMenu] = useState({ isOpen: false, x: 0, y: 0, columnId: '' })
    const [taskContextMenu, setTaskContextMenu] = useState({ isOpen: false, x: 0, y: 0, taskId: '', columnId: '' })


    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user && !localStorage.getItem('lifepath_user_name')) {
                router.push('/login')
            }
        }
        checkAuth()
    }, [])
    const [issues, setIssues] = useState<any[]>([])

    const [showSortMenu, setShowSortMenu] = useState(false)
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [sortBy, setSortBy] = useState('Default')
    const [filterBy, setFilterBy] = useState('All')

    const sortRef = useRef<HTMLDivElement>(null)
    const filterRef = useRef<HTMLDivElement>(null)

    const sortOptions = ['Default', 'Due Date', 'Priority', 'Alphabetical']
    const filterOptions = ['All', 'Personal', 'Work', 'Urgent']

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setShowSortMenu(false)
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Load tasks AND columns from localStorage
    useEffect(() => {
        // Initialize time
        setTime(new Date())

        // Check for privacy acceptance
        const privacyAccepted = localStorage.getItem('lifepath_privacy_accepted')
        if (privacyAccepted !== 'true') {
            setIsWelcomeModalOpen(true)
        }

        const savedTasks = localStorage.getItem('lifepath_tasks')
        const savedColumns = localStorage.getItem('lifepath_columns')

        if (savedColumns) {
            try {
                const parsedColumns = JSON.parse(savedColumns)
                console.log('[Dashboard] Loaded columns from localStorage:', parsedColumns)
                setColumns(parsedColumns)
            } catch (e) { console.error("Failed to parse columns", e) }
        } else {
            console.log('[Dashboard] No saved columns found, using and saving defaults')
            // Save default columns immediately so they persist
            const defaultColumns = [
                { id: 'schedule', title: "Today's Schedule", icon: 'Clock' },
                { id: 'active', title: "Active Tasks", icon: 'Zap' },
                { id: 'creative', title: "Creative Incubator", icon: 'Sparkles' },
                { id: 'leads', title: "Business Leads", icon: 'TrendingUp' }
            ]
            setColumns(defaultColumns)
            localStorage.setItem('lifepath_columns', JSON.stringify(defaultColumns))
        }

        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks))
            } catch (e) {
                console.error("Failed to parse saved tasks", e)
            }
        } else {
            // Initial seed data
            setTasks({
                schedule: [
                    { id: '1', title: 'Finalize Homepage Copy', dueDate: 'Dec 29' },
                    { id: '13', title: 'Review Q3 Financials', dueDate: 'Dec 29' }
                ],
                active: [
                    { id: '4', title: 'Approve Wireframes', avatarActive: true },
                    { id: '5', title: 'Draft Email Sequence' },
                    { id: '6', title: 'Source Moodboard Images' }
                ],
                creative: [
                    { id: '7', title: 'Podcast Launch Idea', tags: [{ label: 'Content', color: 'beige' }, { label: 'Media', color: 'beige' }] },
                    { id: '8', title: 'AI Automation Research', tags: [{ label: 'Innovation', color: 'red' }, { label: 'Tech', color: 'green' }] },
                    { id: '9', title: 'Merch Store Mockups', tags: [{ label: 'Design', color: 'beige' }, { label: 'Ecommerce', color: 'green' }] }
                ],
                leads: [
                    { id: '10', title: 'Follow up with Nike', tags: [{ label: 'Partnership', color: 'green' }] },
                    { id: '11', title: 'Intro call: Jason M.', tags: [{ label: 'Networking', color: 'blue' }] },
                    { id: '12', title: 'Send Proposal to TechStart', tags: [{ label: 'Sales', color: 'red' }] }
                ]
            })
        }

        // Projects, User Profile & Issues
        const savedProjects = localStorage.getItem('lifepath_projects')
        if (savedProjects) {
            try {
                const projects = JSON.parse(savedProjects)
                const active = projects.filter((p: any) => p.status === 'Active')
                setActiveProjectsCount(active.length)

                if (active.length > 0) {
                    const totalProgress = active.reduce((acc: number, p: any) => acc + (p.progress || 0), 0)
                    setGlobalProgress(Math.round(totalProgress / active.length))
                }
            } catch (e) {
                console.error("Failed to parse saved projects", e)
            }
        }

        const savedUser = localStorage.getItem('lifepath_user_name')
        if (savedUser) setUserName(savedUser)

        const savedIssues = localStorage.getItem('lifepath_issues')
        if (savedIssues) {
            try { setIssues(JSON.parse(savedIssues)) } catch (e) { }
        } else {
            setIssues([{ id: '1', title: 'Update Q4 Strategy', priority: 'High' }])
        }

        isLoaded.current = true
    }, [])

    // Listen for task updates from ReviewModal
    useEffect(() => {
        const handleTaskUpdate = () => {
            console.log('[Dashboard] Reloading tasks due to external update')
            const savedTasks = localStorage.getItem('lifepath_tasks')
            if (savedTasks) {
                try {
                    setTasks(JSON.parse(savedTasks))
                } catch (e) {
                    console.error("Failed to parse saved tasks on update", e)
                }
            }
        }
        window.addEventListener('lifepath-task-update', handleTaskUpdate)
        return () => window.removeEventListener('lifepath-task-update', handleTaskUpdate)
    }, [])

    // Save tasks and columns
    useEffect(() => {
        if (isLoaded.current) {
            console.log('[Dashboard] Saving to localStorage - columns:', columns.length, 'tasks:', Object.keys(tasks).length)
            localStorage.setItem('lifepath_tasks', JSON.stringify(tasks))
            localStorage.setItem('lifepath_columns', JSON.stringify(columns))
        }
    }, [tasks, columns])

    // ... clock effect ...
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleAcceptPrivacy = () => {
        localStorage.setItem('lifepath_privacy_accepted', 'true')
        setIsWelcomeModalOpen(false)
    }

    const handleAddCategory = (title: string, id: string, icon: string) => {
        // Ensure unique ID
        let finalId = id
        if (tasks[finalId]) {
            finalId = `${id}-${Math.random().toString(36).substr(2, 5)}`
        }

        console.log('[Dashboard] Adding new column:', { id: finalId, title, icon })
        setColumns(prev => [...prev, { id: finalId, title, icon }])
        setTasks(prev => ({
            ...prev,
            [finalId]: []
        }))
    }

    const handleCompleteTask = (id: string) => {
        setTasks(prev => {
            const newTasks = { ...prev }
            Object.keys(newTasks).forEach(key => {
                newTasks[key] = newTasks[key].filter(t => t.id !== id)
            })
            return newTasks
        })
    }

    const handleAddTask = (title: string, category: string, dueDate?: Date) => {
        if (!activeColumn) return

        // Format the date
        const formatDate = (date: Date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return `${months[date.getMonth()]} ${date.getDate()}`
        }

        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            dueDate: dueDate ? formatDate(dueDate) : 'Today'
        }
        setTasks(prev => ({
            ...prev,
            [activeColumn]: [newTask, ...(prev[activeColumn] || [])]
        }))
        setIsAddModalOpen(false)
        setActiveColumn(null)
    }

    const handleSaveTask = (updatedTask: any) => {
        setTasks(prev => {
            const newTasks = { ...prev }
            Object.keys(newTasks).forEach(key => {
                const index = newTasks[key].findIndex(t => t.id === updatedTask.id)
                if (index !== -1) {
                    newTasks[key][index] = {
                        ...newTasks[key][index],
                        ...updatedTask
                    }
                }
            })
            return newTasks
        })
        setIsEditModalOpen(false)
        setEditingTask(null)
    }

    const handleDuplicateTask = (id: string) => {
        setTasks(prev => {
            const newTasks = { ...prev }
            Object.keys(newTasks).forEach(key => {
                const task = newTasks[key].find(t => t.id === id)
                if (task) {
                    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9), title: `${task.title} (Copy)` }
                    newTasks[key] = [newTask, ...newTasks[key]]
                }
            })
            return newTasks
        })
    }

    const handleUrgentTask = (id: string) => {
        setTasks(prev => {
            const newTasks = { ...prev }
            Object.keys(newTasks).forEach(key => {
                const index = newTasks[key].findIndex(t => t.id === id)
                if (index !== -1) {
                    const task = newTasks[key][index]
                    const tags = task.tags || []
                    if (!tags.find((t: any) => t.label === 'URGENT')) {
                        newTasks[key][index] = { ...task, tags: [{ label: 'URGENT', color: 'red' }, ...tags] }
                    }
                }
            })
            return newTasks
        })
    }


    // Context menu handlers for columns
    const handleDeleteColumn = (columnId: string) => {
        setColumns(prev => prev.filter(c => c.id !== columnId))
        setTasks(prev => {
            const newTasks = { ...prev }
            delete newTasks[columnId]
            return newTasks
        })
    }

    const handleRenameColumn = (columnId: string) => {
        const column = columns.find(c => c.id === columnId)
        if (!column) return
        setEditingColumn(column)
        setIsEditColumnModalOpen(true)
    }

    const handleChangeColumnColor = (columnId: string) => {
        const column = columns.find(c => c.id === columnId)
        if (!column) return
        setEditingColumn(column)
        setIsEditColumnModalOpen(true)
    }

    const handleSaveColumnEdit = (data: { title: string; color?: string }) => {
        if (!editingColumn) return
        setColumns(prev => prev.map(c =>
            c.id === editingColumn.id ? { ...c, title: data.title, color: data.color } : c
        ))
        setEditingColumn(null)
    }

    const handleMoveColumnUp = (columnId: string) => {
        const index = columns.findIndex(c => c.id === columnId)
        if (index > 0) {
            const newColumns = [...columns]
                ;[newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]]
            setColumns(newColumns)
        }
    }

    const handleMoveColumnDown = (columnId: string) => {
        const index = columns.findIndex(c => c.id === columnId)
        if (index < columns.length - 1) {
            const newColumns = [...columns]
                ;[newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]]
            setColumns(newColumns)
        }
    }

    const handleArchiveColumn = (columnId: string) => {
        handleDeleteColumn(columnId) // For now, archive = delete
    }

    const findContainer = (id: string) => {
        if (id in tasks) return id
        return Object.keys(tasks).find((key) =>
            tasks[key].some((task) => task.id === id)
        )
    }

    const checkIfColumn = (id: string) => {
        return columns.some(col => col.id === id)
    }

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveDragItem({ type: 'Column', data: event.active.data.current.column });
            return;
        }

        // Assume Task
        const taskId = event.active.id as string;
        const task = Object.values(tasks).flat().find(t => t.id === taskId);
        setActiveDragItem({ type: 'Task', data: task });
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        if (activeId === overId) return

        const isActiveTask = active.data.current?.type !== "Column"
        const isOverTask = over.data.current?.type !== "Column"

        if (!isActiveTask) return // We handle column reordering in DragEnd only

        // Im dragging a task
        const activeContainer = findContainer(activeId)
        const overContainer = isOverTask ? findContainer(overId) : overId // If over is column, container is the column itself

        if (!activeContainer || !overContainer) return

        // If dragging over a column directly (empty or not)
        if (checkIfColumn(overId)) {
            setTasks((prev) => {
                const activeItems = prev[activeContainer]
                const overItems = prev[overContainer] || [] // handle empty
                const activeIndex = activeItems.findIndex((item) => item.id === activeId)

                // If it's already in this container, do nothing here (SortableContext handles reorder within list usually, but across lists we need this)
                if (activeContainer === overContainer) {
                    return prev
                }

                return {
                    ...prev,
                    [activeContainer]: [
                        ...prev[activeContainer].filter((item) => item.id !== activeId),
                    ],
                    [overContainer]: [
                        ...prev[overContainer],
                        activeItems[activeIndex], // Append to end of new column
                    ],
                }
            })
            return
        }

        if (activeContainer !== overContainer) {
            setTasks((prev) => {
                const activeItems = prev[activeContainer]
                const overItems = prev[overContainer]
                const activeIndex = activeItems.findIndex((item) => item.id === activeId)
                const overIndex = overItems.findIndex((item) => item.id === overId)

                let newIndex: number
                if (checkIfColumn(overId)) {
                    newIndex = overItems.length + 1
                } else {
                    const isBelowLastItem =
                        over &&
                        activeIndex > overIndex
                    const modifier = isBelowLastItem ? 1 : 0
                    newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
                }

                return {
                    ...prev,
                    [activeContainer]: [
                        ...prev[activeContainer].filter((item) => item.id !== active.id),
                    ],
                    [overContainer]: [
                        ...prev[overContainer].slice(0, newIndex),
                        prev[activeContainer][activeIndex],
                        ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                    ],
                }
            })
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) {
            setActiveDragItem(null)
            return
        }

        // Column Reordering
        if (active.data.current?.type === "Column") {
            if (active.id !== over.id) {
                setColumns((items) => {
                    const oldIndex = items.findIndex((c) => c.id === active.id);
                    const newIndex = items.findIndex((c) => c.id === over.id);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
            setActiveDragItem(null);
            return;
        }

        // Task Reordering (Sort inside same container)
        const activeContainer = findContainer(active.id as string)
        const overContainer = findContainer(over.id as string)

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = tasks[activeContainer].findIndex((task) => task.id === active.id)
            const overIndex = tasks[overContainer].findIndex((task) => task.id === over.id)

            if (activeIndex !== overIndex) {
                setTasks((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }))
            }
        }

        setActiveDragItem(null)
    }

    const openAddTaskModal = (columnId: string) => {
        setActiveColumn(columnId)
        setIsAddModalOpen(true)
    }

    const openEditTaskModal = (task: any) => {
        setEditingTask(task)
        setIsEditModalOpen(true)
    }

    // ... widget calculations (hourDeg, etc) ...
    const hourDeg = time ? (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 : 0
    const minuteDeg = time ? time.getMinutes() * 6 : 0
    const secondDeg = time ? time.getSeconds() * 6 : 0
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    const greeting = () => {
        if (!time) return "Welcome"
        const hour = time.getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 18) return "Good Afternoon"
        return "Good Evening"
    }

    // Dynamic task count calculation
    const totalTasksLeft = Object.values(tasks).reduce((acc, curr) => acc + curr.length, 0)

    return (
        <main className="dashboard-main">
            <header className="top-bar">
                <div className="search-container">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Search tasks..." className="search-input" />
                </div>
                <div className="top-actions">
                    <button className="icon-btn" onClick={() => setIsAddCategoryModalOpen(true)}>
                        <Plus size={16} />
                        Add Column
                    </button>
                    <div className="relative" ref={sortRef}>
                        <button className={cn("icon-btn", showSortMenu && "active")} onClick={() => setShowSortMenu(!showSortMenu)}>
                            <SortAsc size={16} />
                            <span>Sort: {sortBy}</span>
                        </button>
                        <AnimatePresence>
                            {showSortMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="inbox-dropdown"
                                    style={{ top: '35px', left: '0', width: '160px', zIndex: 110 }}
                                >
                                    {sortOptions.map(opt => (
                                        <button key={opt} className="dropdown-item" onClick={() => { setSortBy(opt); setShowSortMenu(false); }}>{opt}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={filterRef}>
                        <button className={cn("icon-btn", showFilterMenu && "active")} onClick={() => setShowFilterMenu(!showFilterMenu)}>
                            <Filter size={16} />
                            <span>Filter: {filterBy}</span>
                        </button>
                        <AnimatePresence>
                            {showFilterMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="inbox-dropdown"
                                    style={{ top: '35px', left: '0', width: '160px', zIndex: 110 }}
                                >
                                    {filterOptions.map(opt => (
                                        <button key={opt} className="dropdown-item" onClick={() => { setFilterBy(opt); setShowFilterMenu(false); }}>{opt}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="user-profile">
                        <div className="header-badge notifications">
                            <Bell size={16} />
                            <span className="badge-dot" />
                        </div>
                        {issues.length > 0 && (
                            <div className="header-badge issue-pill">
                                <AlertCircle size={14} />
                                <span>{issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}</span>
                                <X size={12} className="close-mini" onClick={() => setIssues([])} />
                            </div>
                        )}
                        <div className="user-name-group" onClick={() => {
                            const newName = prompt("Enter your name:", userName)
                            if (newName) {
                                setUserName(newName)
                                localStorage.setItem('lifepath_user_name', newName)
                            }
                        }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <User size={14} style={{ opacity: 0.6 }} />
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{userName}</span>
                        </div>
                        <div className="profile-circle-avatar">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <section className="dashboard-content">
                <div className="greeting-row">
                    <div className="greeting-container">
                        <motion.div
                            className="widgets-top"
                            drag
                            dragMomentum={false}
                            whileDrag={{ zIndex: 1000, scale: 1.05 }}
                        >
                            <div className="time-widgets">
                                <div className="analog-clock">
                                    <div className="clock-face">
                                        <div className="hand hour" style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
                                        <div className="hand minute" style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
                                        <div className="hand second" style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
                                    </div>
                                </div>
                                <div className="calendar-widget">
                                    <span className="month">{time ? monthNames[time.getMonth()] : '--'}</span>
                                    <span className="day">{time ? time.getDate() : '--'}</span>
                                </div>
                            </div>
                            <div className="greeting-text">
                                <h1 className="greeting-title font-serif">{greeting()}, {userName}.</h1>
                                <div className="task-count-hero">
                                    <span className="count-number">{totalTasksLeft}</span>
                                    <span className="count-label">Tasks Left Today</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="velocity-widget card glass"
                            drag
                            dragMomentum={false}
                            whileDrag={{ zIndex: 1000, scale: 1.05 }}
                        >
                            <div className="widget-header">
                                <span>7-Day Velocity</span>
                            </div>
                            <div className="velocity-chart">
                                {['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, i) => {
                                    const isToday = i === 6
                                    const height = isToday ? '60px' : '15px'
                                    return (
                                        <div key={day} className="chart-bar-container">
                                            <div className={cn("chart-bar", isToday && "active")} style={{ height }} />
                                            <span className="chart-day">{day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>

                        <motion.div
                            className="progress-widget card glass"
                            drag
                            dragMomentum={false}
                            whileDrag={{ zIndex: 1000, scale: 1.05 }}
                        >
                            <div className="progress-group">
                                <div className="progress-value">{globalProgress}%</div>
                                <div className="progress-label">Global Project Progress</div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill" style={{ width: `${globalProgress}%` }} />
                                </div>
                                <div className="progress-sub">Active Projects <span className="float-right">{activeProjectsCount}</span></div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="quick-actions-bar">
                    <div className="quick-action-item">
                        <div className="action-icon blue">
                            <Sparkles size={16} />
                        </div>
                        <div className="action-text">
                            <span className="action-label">Quick Capture</span>
                            <span className="action-shortcut">⌘ K</span>
                        </div>
                    </div>
                    <div className="quick-action-item">
                        <div className="action-icon green">
                            <Plus size={16} />
                        </div>
                        <div className="action-text">
                            <span className="action-label">New Task</span>
                            <span className="action-shortcut">T</span>
                        </div>
                    </div>
                    <div className="quick-action-item">
                        <div className="action-icon purple">
                            <Bell size={16} />
                        </div>
                        <div className="action-text">
                            <span className="action-label">Reminders</span>
                            <span className="action-shortcut">R</span>
                        </div>
                    </div>
                    <div className="quick-action-item">
                        <div className="action-icon orange">
                            <Target size={16} />
                        </div>
                        <div className="action-text">
                            <span className="action-label">Goals</span>
                            <span className="action-shortcut">G</span>
                        </div>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className={cn("task-columns-container", activeDragItem && "dragging-active")} style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        <SortableContext
                            items={columns.map(c => c.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map(col => (
                                <SortableTaskColumn
                                    key={col.id}
                                    column={col}
                                    tasks={tasks[col.id] || []}
                                    onCompleteTask={handleCompleteTask}
                                    onOpenModal={openAddTaskModal}
                                    onEditTask={openEditTaskModal}
                                    onDuplicateTask={handleDuplicateTask}
                                    onUrgentTask={handleUrgentTask}
                                    onColumnContextMenu={(e, columnId) => {
                                        e.preventDefault()
                                        setColumnContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, columnId })
                                    }}
                                    onTaskContextMenu={(e, taskId, columnId) => {
                                        e.preventDefault()
                                        setTaskContextMenu({ isOpen: true, x: e.clientX, y: e.clientY, taskId, columnId })
                                    }}
                                />
                            ))}
                        </SortableContext>
                    </div>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: {
                                active: { opacity: '0.5' },
                            },
                        }),
                    }}>
                        {activeDragItem?.type === 'Task' && (
                            <TaskCard
                                id={activeDragItem.data.id}
                                isOverlay
                                {...activeDragItem.data}
                            />
                        )}
                        {activeDragItem?.type === 'Column' && (
                            <div className="task-column dragging-overlay" style={{ height: '400px', opacity: 0.8 }}>
                                <div className="column-header">
                                    <span className="column-title font-serif">{activeDragItem.data.title}</span>
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </section >

            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false)
                    setActiveColumn(null)
                }}
                onAdd={handleAddTask}
            />

            <AddCategoryModal
                isOpen={isAddCategoryModalOpen}
                onClose={() => setIsAddCategoryModalOpen(false)}
                onAdd={handleAddCategory}
            />

            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setEditingTask(null)
                }}
                onSave={handleSaveTask}
                taskData={editingTask}
            />

            <AnimatePresence>
                {isWelcomeModalOpen && (
                    <WelcomeModal
                        key="welcome-modal"
                        onAccept={handleAcceptPrivacy}
                    />
                )}
            </AnimatePresence>

            {
                !isWelcomeModalOpen && (
                    <div className="cookie-banner glass">
                        <span>We use cookies for login and preferences. <a href="/privacy" target="_blank" className="font-bold underline">Privacy Policy</a></span>
                        <button className="got-it-btn">Got it</button>
                    </div>
                )
            }

            {/* Column Context Menu */}
            <ContextMenu
                isOpen={columnContextMenu.isOpen}
                onClose={() => setColumnContextMenu({ ...columnContextMenu, isOpen: false })}
                position={{ x: columnContextMenu.x, y: columnContextMenu.y }}
                type="column"
                item={columns.find(c => c.id === columnContextMenu.columnId) || {}}
                onRename={() => handleRenameColumn(columnContextMenu.columnId)}
                onChangeColor={() => handleChangeColumnColor(columnContextMenu.columnId)}
                onDelete={() => handleDeleteColumn(columnContextMenu.columnId)}
                onMoveUp={() => handleMoveColumnUp(columnContextMenu.columnId)}
                onMoveDown={() => handleMoveColumnDown(columnContextMenu.columnId)}
                onArchive={() => handleArchiveColumn(columnContextMenu.columnId)}
            />

            {/* Edit Column Modal */}
            <EditColumnModal
                isOpen={isEditColumnModalOpen}
                onClose={() => {
                    setIsEditColumnModalOpen(false)
                    setEditingColumn(null)
                }}
                onSave={handleSaveColumnEdit}
                columnData={editingColumn || undefined}
            />

            {/* Task Context Menu */}
            <ContextMenu
                isOpen={taskContextMenu.isOpen}
                onClose={() => setTaskContextMenu({ ...taskContextMenu, isOpen: false })}
                position={{ x: taskContextMenu.x, y: taskContextMenu.y }}
                type="task"
                item={tasks[taskContextMenu.columnId]?.find((t: any) => t.id === taskContextMenu.taskId) || {}}
                onEdit={() => {
                    const task = tasks[taskContextMenu.columnId]?.find((t: any) => t.id === taskContextMenu.taskId)
                    if (task) {
                        setEditingTask(task)
                        setIsEditModalOpen(true)
                    }
                }}
                onDelete={() => handleCompleteTask(taskContextMenu.taskId)}
                onDuplicate={() => handleDuplicateTask(taskContextMenu.taskId)}
                onSetPriority={() => handleUrgentTask(taskContextMenu.taskId)}
            />

        </main >
    )
}
