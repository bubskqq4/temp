'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Plus,
    ChevronRight,
    MoreVertical,
    Check,
    Calendar,
    Image as ImageIcon,
    BookOpen,
    PenTool,
    Upload,
    ArrowUpDown,
    Edit3,
    Trash2,
    Copy,
    ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
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
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { AddResourceModal } from '@/components/AddResourceModal'
import { NewReflectionModal } from '@/components/NewReflectionModal'
import { AddTaskModal } from '@/components/AddTaskModal'
import { EditTaskModal } from '@/components/EditTaskModal'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface ProjectTask {
    id: string
    title: string
    status: 'To Do' | 'In Progress' | 'Done'
    dueDate: string
    category: string
    projectId: string
}

function ProjectDetailContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [project, setProject] = useState<any>(null)
    const [inspirations, setInspirations] = useState<any[]>([])
    const [resources, setResources] = useState<any[]>([])
    const [reflections, setReflections] = useState<any[]>([])
    const [tasks, setTasks] = useState<ProjectTask[]>([])

    const [activeId, setActiveId] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const initialized = useRef(false)

    // Modal states
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
    const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false)
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<any>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        if (!id) return

        const savedProjects = localStorage.getItem('lifepath_projects')
        if (savedProjects) {
            const projects = JSON.parse(savedProjects)
            const p = projects.find((proj: any) => proj.id === id)
            if (p) setProject(p)
        }

        const savedInspirations = localStorage.getItem('lifepath_inspirations')
        if (savedInspirations) {
            const all = JSON.parse(savedInspirations)
            setInspirations(all.filter((ins: any) => ins.projectId === id))
        }

        const savedTasks = localStorage.getItem(`lifepath_project_tasks_${id}`)
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks))
        } else if (id) {
            // Seed tasks for specific project
            setTasks([
                { id: 't1', title: 'Finalize Homepage Copy', status: 'To Do', dueDate: 'Dec 29', category: 'Personal', projectId: id },
                { id: 't2', title: 'Approve Wireframes', status: 'In Progress', dueDate: 'No due date', category: 'Personal', projectId: id }
            ])
        }

        const savedResources = localStorage.getItem(`lifepath_project_resources_${id}`)
        if (savedResources) setResources(JSON.parse(savedResources))

        const savedReflections = localStorage.getItem(`lifepath_project_reflections_${id}`)
        if (savedReflections) setReflections(JSON.parse(savedReflections))

        setIsLoaded(true)
        initialized.current = true
    }, [id])

    useEffect(() => {
        if (initialized.current && id) {
            localStorage.setItem(`lifepath_project_tasks_${id}`, JSON.stringify(tasks))
        }
    }, [tasks, id])

    useEffect(() => {
        if (initialized.current && id) {
            localStorage.setItem(`lifepath_project_resources_${id}`, JSON.stringify(resources))
        }
    }, [resources, id])

    useEffect(() => {
        if (initialized.current && id) {
            localStorage.setItem(`lifepath_project_reflections_${id}`, JSON.stringify(reflections))
        }
    }, [reflections, id])

    if (!id) return <div className="layout-wrapper"><Sidebar /><main className="projects-main"><h1 className="font-serif text-white">No project selected.</h1></main></div>
    if (!isLoaded) return null
    if (!project) return <div className="layout-wrapper"><Sidebar /><main className="projects-main"><h1 className="font-serif text-white">Project not found.</h1></main></div>

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string

        const activeTask = tasks.find(t => t.id === activeId)
        const overTask = tasks.find(t => t.id === overId)

        if (!activeTask) return

        // If dropping over a column
        const columnStatus = ['To Do', 'In Progress', 'Done'].find(s => s === overId)

        if (columnStatus && activeTask.status !== columnStatus) {
            setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: columnStatus as any } : t))
        } else if (overTask && activeTask.status !== overTask.status) {
            setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overTask.status } : t))
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) {
            setActiveId(null)
            return
        }

        if (active.id !== over.id) {
            const oldIndex = tasks.findIndex(t => t.id === active.id)
            const newIndex = tasks.findIndex(t => t.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
                setTasks(prev => arrayMove(prev, oldIndex, newIndex))
            }
        }
        setActiveId(null)
    }

    const addTask = (title: string, category: string, dueDate?: Date) => {
        // Format the date
        const formatDate = (date: Date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return `${months[date.getMonth()]} ${date.getDate()}`
        }

        const newTask: ProjectTask = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            status: 'To Do',
            dueDate: dueDate ? formatDate(dueDate) : 'No due date',
            category,
            projectId: id
        }
        setTasks(prev => [newTask, ...prev])
    }

    const addResource = (res: any) => setResources(prev => [res, ...prev])
    const addReflection = (ref: any) => setReflections(prev => [ref, ...prev])

    // Progress Calculation
    const totalTasks = tasks.length
    const doneTasks = tasks.filter(t => t.status === 'Done').length
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
    const dashArray = 2 * Math.PI * 40
    const dashOffset = dashArray - (dashArray * progress) / 100

    return (
        <>
            <main className="projects-main">
                <header className="project-detail-header">
                    <div className="project-header-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h1 className="font-serif text-white">{project.title}</h1>
                            <span className="project-status-pill active" style={{ fontSize: '0.7rem' }}>{project.status}</span>
                            <Edit3 size={16} className="text-muted" style={{ cursor: 'pointer' }} />
                        </div>
                        <p className="project-header-description">{project.description}</p>
                    </div>

                    <div className="project-progress-circle-container">
                        <svg className="progress-circle-svg" viewBox="0 0 100 100">
                            <circle className="progress-circle-bg" cx="50" cy="50" r="40" />
                            <circle
                                className="progress-circle-fill"
                                cx="50"
                                cy="50"
                                r="40"
                                style={{
                                    strokeDasharray: dashArray,
                                    strokeDashoffset: dashOffset,
                                    transition: 'stroke-dashoffset 0.5s ease'
                                }}
                            />
                        </svg>
                        <div className="progress-percentage">{progress}%</div>
                        <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.7rem', color: '#52525b', fontWeight: '700' }}>PROGRESS</span>
                    </div>
                </header>

                <div className="project-action-bar">
                    <button
                        className="submit-task-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px' }}
                        onClick={() => setIsAddTaskModalOpen(true)}
                    >
                        <Plus size={18} />
                        <span>Add Task to Project</span>
                    </button>
                </div>

                <div className="project-widgets-grid">
                    <div className="project-widget-card">
                        <div className="project-widget-header">
                            <h3 className="project-widget-title">
                                <ImageIcon size={18} className="text-muted" />
                                <span className="font-serif">Mood Board</span>
                            </h3>
                            <div className="project-widget-actions">
                                <span className="action-link"><Upload size={14} /> Upload</span>
                                <span className="action-link" onClick={() => (window as any).location.href = '/creative-studio'}><Plus size={14} /> From Studio</span>
                            </div>
                        </div>
                        {inspirations.length > 0 ? (
                            <div className="mood-board-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                                {inspirations.slice(0, 4).map((ins, idx) => (
                                    <div key={idx} className="mood-item" style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <img src={ins.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="project-widget-empty" style={{ minHeight: '140px' }}>
                                <ImageIcon size={48} className="empty-icon" />
                                <p className="empty-text">No inspirations yet. Upload an image or add from your Creative Studio.</p>
                            </div>
                        )}
                    </div>

                    <div className="project-widget-card">
                        <div className="project-widget-header">
                            <h3 className="project-widget-title">
                                <BookOpen size={18} className="text-muted" />
                                <span className="font-serif">Resources</span>
                            </h3>
                            <div className="project-widget-actions">
                                <span className="action-link" onClick={() => setIsResourceModalOpen(true)}><Plus size={14} /> Add</span>
                            </div>
                        </div>
                        {resources.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {resources.map(res => (
                                    <div key={res.id} className="resource-item" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{res.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#52525b' }}>{res.type} • {res.date}</div>
                                        </div>
                                        <ExternalLink size={14} className="text-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="project-widget-empty" style={{ minHeight: '140px' }}>
                                <BookOpen size={48} className="empty-icon" />
                                <p className="empty-text">No resources yet. Add notes, links, or documents.</p>
                            </div>
                        )}
                    </div>

                    <div className="project-widget-card">
                        <div className="project-widget-header">
                            <h3 className="project-widget-title">
                                <PenTool size={18} className="text-muted" />
                                <span className="font-serif">Project Journal</span>
                            </h3>
                            <div className="project-widget-actions">
                                <span className="action-link" onClick={() => setIsReflectionModalOpen(true)}><Plus size={14} /> New Reflection</span>
                            </div>
                        </div>
                        {reflections.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                {reflections.map(ref => (
                                    <div key={ref.id} className="reflection-preview" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: '3px solid #71717a' }}>
                                        <div className="font-serif" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{ref.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#52525b' }}>{ref.date}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="project-widget-empty" style={{ minHeight: '140px' }}>
                                <PenTool size={48} className="empty-icon" />
                                <p className="empty-text">No reflections yet. Start journaling about this project.</p>
                            </div>
                        )}
                    </div>
                </div>

                <section className="project-tasks-section">
                    <h2 className="section-title font-serif">Project Tasks</h2>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="project-task-columns-grid">
                            {['To Do', 'In Progress', 'Done'].map(status => (
                                <ProjectSortableColumn
                                    key={status}
                                    id={status}
                                    title={status}
                                    tasks={tasks.filter(t => t.status === status)}
                                    onEdit={setEditingTask}
                                />
                            ))}
                        </div>

                        <DragOverlay>
                            {activeId ? (
                                <div style={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
                                    <SimpleTaskCard
                                        task={tasks.find(t => t.id === activeId)!}
                                        onEdit={() => { }}
                                        isDragging
                                    />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </section>
            </main>

            <AddResourceModal
                isOpen={isResourceModalOpen}
                onClose={() => setIsResourceModalOpen(false)}
                onAdd={addResource}
                projectName={project.title}
            />

            <NewReflectionModal
                isOpen={isReflectionModalOpen}
                onClose={() => setIsReflectionModalOpen(false)}
                onAdd={addReflection}
            />

            <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
                onAdd={addTask}
            />

            {editingTask && (
                <EditTaskModal
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    taskData={editingTask}
                    onSave={(updated) => {
                        setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t))
                        setEditingTask(null)
                    }}
                />
            )}
        </>
    )
}

export default function ProjectDetailPage() {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <Suspense fallback={<div className="flex-1 bg-[#050505]" />}>
                <ProjectDetailContent />
            </Suspense>
        </div>
    )
}

function ProjectSortableColumn({ id, title, tasks, onEdit }: { id: string, title: string, tasks: ProjectTask[], onEdit: (t: any) => void }) {
    return (
        <div className="project-task-column">
            <div className="column-header-lite">
                <span className="column-title-lite">{title}</span>
                <span className="column-count-lite">{tasks.length}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', color: '#3f3f46' }}>
                    <Plus size={14} style={{ cursor: 'pointer' }} />
                    <ArrowUpDown size={14} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            <div className="column-content-lite" style={{ minHeight: '100px' }}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableTaskCard key={task.id} task={task} onEdit={onEdit} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}

function SortableTaskCard({ task, onEdit }: { task: ProjectTask, onEdit: (t: any) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <SimpleTaskCard task={task} onEdit={onEdit} />
        </div>
    )
}

const SimpleTaskCard = ({ task, onEdit, isDragging }: { task: ProjectTask, onEdit: (t: any) => void, isDragging?: boolean }) => {
    return (
        <div className={cn("task-card", isDragging && "dragging-overlay")} style={{ padding: '1rem', gap: '0.75rem', cursor: 'grab' }}>
            <div className="task-main">
                <div className="task-checkbox" />
                <div className="task-content">
                    <div className="task-title-row">
                        <span className="task-title" style={{ fontSize: '0.95rem' }}>{task.title}</span>
                        <div onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                            <MoreVertical size={14} className="text-muted" style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <span className="task-due" style={{ fontSize: '0.75rem' }}>{task.dueDate === 'No due date' ? task.dueDate : `Due ${task.dueDate}`}</span>
                </div>
            </div>
            <div className="task-footer">
                <div className="task-user-tag" style={{ width: '24px', height: '24px', fontSize: '0.65rem' }}>ET</div>
            </div>
        </div>
    )
}
