'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { RouteGuard } from '@/components/RouteGuard'
import {
    Plus,
    Search,
    LayoutGrid,
    StretchHorizontal,
    Eye,
    MoreHorizontal,
    Calendar,
    CheckSquare,
    FileText,
    FolderKanban,
    ArrowRight,
    X,
    Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateProjectModal } from '@/components/CreateProjectModal'
import Link from 'next/link'

interface Project {
    id: string
    title: string
    description: string
    status: string
    dueDate: string
    progress: number
    taskCount: number
    docCount: number
    coverColor: string
}

export default function ProjectsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const isLoaded = useRef(false)

    // Load projects from localStorage
    useEffect(() => {
        const savedProjects = localStorage.getItem('lifepath_projects')
        let loadedProjects: Project[] = []

        if (savedProjects) {
            try {
                loadedProjects = JSON.parse(savedProjects)
            } catch (e) {
                console.error("Failed to parse saved projects", e)
            }
        } else {
            loadedProjects = [
                {
                    id: '1',
                    title: 'Website Redesign',
                    description: 'Complete overhaul of company website with modern design',
                    status: 'Active',
                    dueDate: 'Jan 5, 2026',
                    progress: 35,
                    taskCount: 12,
                    docCount: 3,
                    coverColor: '#8b5cf6'
                },
                {
                    id: '2',
                    title: 'Mobile App Launch',
                    description: 'Finalizing the iOS and Android application releases',
                    status: 'Strategic',
                    dueDate: 'Feb 10, 2026',
                    progress: 60,
                    taskCount: 8,
                    docCount: 5,
                    coverColor: '#10b981'
                }
            ]
        }

        const enrichedProjects = loadedProjects.map(p => {
            const savedTasks = localStorage.getItem(`lifepath_project_tasks_${p.id}`)
            if (savedTasks) {
                const tasks = JSON.parse(savedTasks)
                const total = tasks.length
                const done = tasks.filter((t: any) => t.status === 'Done').length
                const progress = total > 0 ? Math.round((done / total) * 100) : 0
                return { ...p, taskCount: total, progress }
            }
            return p
        })

        setProjects(enrichedProjects)
        isLoaded.current = true
    }, [])

    useEffect(() => {
        if (isLoaded.current) {
            localStorage.setItem('lifepath_projects', JSON.stringify(projects))
        }
    }, [projects])

    const handleCreateProject = (newProject: any) => {
        setProjects(prev => [...prev, {
            ...newProject,
            taskCount: 0,
            docCount: 0
        }])
    }

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <RouteGuard featureName="Projects">
            <div className="layout-wrapper">
                <Sidebar />
                <main className="projects-main" style={{ padding: '2rem', overflowY: 'auto' }}>
                    {/* Header Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
                                    <FolderKanban size={24} color="#3b82f6" />
                                </div>
                                <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'white' }}>
                                    Empire Projects
                                </h1>
                            </div>
                            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                                Manage your active and upcoming visions.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '50px',
                                        padding: '0.75rem 1rem 0.75rem 3rem',
                                        color: 'white',
                                        width: '300px',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="submit-task-btn"
                                style={{
                                    background: 'white',
                                    color: 'black',
                                    padding: '0.75rem 1.75rem',
                                    borderRadius: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 20px -5px rgba(255,255,255,0.1)'
                                }}
                            >
                                <Plus size={20} />
                                Create Vision
                            </button>
                        </div>
                    </div>

                    {/* Filter & View Toggles */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={14} /> All Projects
                            </button>
                            <button style={{ background: 'none', border: 'none', color: '#52525b', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500 }}>
                                Active
                            </button>
                            <button style={{ background: 'none', border: 'none', color: '#52525b', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500 }}>
                                Archived
                            </button>
                        </div>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <button style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '0.4rem', borderRadius: '8px', border: 'none' }}><LayoutGrid size={18} /></button>
                            <button style={{ background: 'none', color: '#52525b', padding: '0.4rem', borderRadius: '8px', border: 'none' }}><StretchHorizontal size={18} /></button>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <Link href={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="project-card"
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            padding: '2.5rem 2rem',
                                            borderRadius: '28px',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        whileHover={{ y: -8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    color: project.coverColor,
                                                    background: project.coverColor + '15',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    marginBottom: '0.75rem',
                                                    display: 'inline-block'
                                                }}>
                                                    {project.status}
                                                </span>
                                                <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'white' }}>{project.title}</h3>
                                            </div>
                                            <button className="icon-btn-small"><MoreHorizontal size={18} /></button>
                                        </div>

                                        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>
                                            {project.description}
                                        </p>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#71717a', marginBottom: '0.5rem' }}>
                                                <span>Completion</span>
                                                <span style={{ color: 'white', fontWeight: 600 }}>{project.progress}%</span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                                <div style={{ width: `${project.progress}%`, height: '100%', background: project.coverColor, borderRadius: '10px', boxShadow: `0 0 10px ${project.coverColor}40` }} />
                                            </div>
                                        </div>

                                        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#71717a', fontSize: '0.85rem' }}>
                                                    <CheckSquare size={14} /> <span>{project.taskCount}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#71717a', fontSize: '0.85rem' }}>
                                                    <FileText size={14} /> <span>{project.docCount}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa', fontSize: '0.8rem' }}>
                                                <Calendar size={14} /> <span>{project.dueDate}</span>
                                            </div>
                                        </footer>

                                        {/* Bottom Accent */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: `linear-gradient(90deg, transparent, ${project.coverColor}, transparent)`, opacity: 0.3 }} />
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateProject}
            />

            <style jsx global>{`
                .project-card:hover {
                    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6);
                }
                
                .icon-btn-small {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: #71717a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn-small:hover {
                    background: rgba(255,255,255,0.08);
                    color: white;
                    transform: translateY(-1px);
                }
            `}</style>
        </RouteGuard>
    )
}
