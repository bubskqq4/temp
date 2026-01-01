'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Edit2, Trash2, Copy, Pin, Star, Archive, Eye, Download,
    Share2, Lock, Unlock, RefreshCw, Check, X, MoreVertical,
    Palette, Move, ArrowUp, ArrowDown, Zap, Clock, Flag,
    FolderOpen, Tag, Users, MessageSquare, ExternalLink, Settings
} from 'lucide-react'

export type ContextMenuItem = {
    label: string
    icon: any
    action: () => void
    variant?: 'default' | 'danger' | 'success'
    divider?: boolean
}

export type ContextMenuType =
    | 'column'
    | 'task'
    | 'project'
    | 'journal-book'
    | 'journal-entry'
    | 'resource'
    | 'inbox-item'
    | 'ritual'
    | 'client'
    | 'issue'
    | 'inspiration'
    | 'tag'

interface ContextMenuProps {
    isOpen: boolean
    onClose: () => void
    position?: { x: number; y: number }
    type: ContextMenuType
    item: any
    onEdit?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onPin?: () => void
    onArchive?: () => void
    onShare?: () => void
    onMove?: () => void
    onRename?: () => void
    onChangeColor?: () => void
    onExport?: () => void
    onMarkComplete?: () => void
    onSetPriority?: () => void
    onAddToProject?: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    isOpen,
    onClose,
    position = { x: 0, y: 0 },
    type,
    item,
    ...actions
}) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    const getMenuItems = (): ContextMenuItem[] => {
        switch (type) {
            case 'column':
                return [
                    { label: 'Rename Column', icon: Edit2, action: actions.onRename || (() => { }) },
                    { label: 'Change Color', icon: Palette, action: actions.onChangeColor || (() => { }) },
                    { label: 'Move Up', icon: ArrowUp, action: actions.onMoveUp || (() => { }) },
                    { label: 'Move Down', icon: ArrowDown, action: actions.onMoveDown || (() => { }) },
                    { label: 'Archive Column', icon: Archive, action: actions.onArchive || (() => { }), divider: true },
                    { label: 'Delete Column', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'task':
                return [
                    { label: 'Edit Task', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Mark Urgent', icon: Zap, action: actions.onSetPriority || (() => { }) },
                    { label: 'Duplicate', icon: Copy, action: actions.onDuplicate || (() => { }) },
                    { label: 'Move to...', icon: Move, action: actions.onMove || (() => { }) },
                    { label: 'Add to Project', icon: FolderOpen, action: actions.onAddToProject || (() => { }), divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'project':
                return [
                    { label: 'Open Project', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit Details', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Duplicate', icon: Copy, action: actions.onDuplicate || (() => { }) },
                    { label: item.isPinned ? 'Unpin' : 'Pin', icon: Pin, action: actions.onPin || (() => { }) },
                    { label: 'Share', icon: Share2, action: actions.onShare || (() => { }) },
                    { label: 'Export', icon: Download, action: actions.onExport || (() => { }), divider: true },
                    { label: 'Archive', icon: Archive, action: actions.onArchive || (() => { }) },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'journal-book':
                return [
                    { label: 'Open Book', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit Book', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Change Cover', icon: Palette, action: actions.onChangeColor || (() => { }) },
                    { label: 'Export Entries', icon: Download, action: actions.onExport || (() => { }), divider: true },
                    { label: 'Delete Book', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'journal-entry':
                return [
                    { label: 'View Entry', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit Entry', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: item.isPinned ? 'Unpin' : 'Pin to Top', icon: Pin, action: actions.onPin || (() => { }) },
                    { label: 'Duplicate', icon: Copy, action: actions.onDuplicate || (() => { }) },
                    { label: 'Move to Book...', icon: Move, action: actions.onMove || (() => { }) },
                    { label: 'Add Tags', icon: Tag, action: () => { }, divider: true },
                    { label: 'Delete Entry', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'resource':
                return [
                    { label: 'View Resource', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: item.isPinned ? 'Unpin' : 'Pin', icon: Pin, action: actions.onPin || (() => { }) },
                    { label: 'Open Link', icon: ExternalLink, action: () => { } },
                    { label: 'Add Tags', icon: Tag, action: () => { } },
                    { label: 'Share', icon: Share2, action: actions.onShare || (() => { }), divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'inbox-item':
                return [
                    { label: 'Edit', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Mark Urgent', icon: Flag, action: actions.onSetPriority || (() => { }) },
                    { label: 'Duplicate', icon: Copy, action: actions.onDuplicate || (() => { }) },
                    { label: 'Convert to Task', icon: Check, action: () => { } },
                    { label: 'Move to Project', icon: FolderOpen, action: actions.onMove || (() => { }), divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'ritual':
                return [
                    { label: item.completed ? 'Mark Incomplete' : 'Mark Complete', icon: Check, action: actions.onMarkComplete || (() => { }), variant: 'success' },
                    { label: 'Edit Ritual', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Set Reminder', icon: Clock, action: () => { } },
                    { label: 'Reorder', icon: Move, action: actions.onMove || (() => { }), divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'client':
                return [
                    { label: 'View Details', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit Client', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'View Projects', icon: FolderOpen, action: () => { } },
                    { label: 'Add Note', icon: MessageSquare, action: () => { } },
                    { label: 'Mark as Active', icon: Star, action: () => { }, divider: true },
                    { label: 'Archive', icon: Archive, action: actions.onArchive || (() => { }) },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'issue':
                return [
                    { label: 'Resolve Issue', icon: Check, action: actions.onMarkComplete || (() => { }), variant: 'success' },
                    { label: 'Edit Issue', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: 'Change Priority', icon: Flag, action: actions.onSetPriority || (() => { }) },
                    { label: 'Assign to...', icon: Users, action: () => { } },
                    { label: 'Add Comment', icon: MessageSquare, action: () => { }, divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'inspiration':
                return [
                    { label: 'View Details', icon: Eye, action: actions.onEdit || (() => { }) },
                    { label: 'Edit', icon: Edit2, action: actions.onEdit || (() => { }) },
                    { label: item.isPinned ? 'Unpin' : 'Pin', icon: Pin, action: actions.onPin || (() => { }) },
                    { label: 'Add Tags', icon: Tag, action: () => { } },
                    { label: 'Share', icon: Share2, action: actions.onShare || (() => { }) },
                    { label: 'Export', icon: Download, action: actions.onExport || (() => { }), divider: true },
                    { label: 'Delete', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            case 'tag':
                return [
                    { label: 'Rename Tag', icon: Edit2, action: actions.onRename || (() => { }) },
                    { label: 'Change Color', icon: Palette, action: actions.onChangeColor || (() => { }) },
                    { label: 'View All Items', icon: Eye, action: () => { } },
                    { label: 'Merge with...', icon: RefreshCw, action: () => { }, divider: true },
                    { label: 'Delete Tag', icon: Trash2, action: actions.onDelete || (() => { }), variant: 'danger' },
                ]

            default:
                return []
        }
    }

    if (!isOpen) return null

    const menuItems = getMenuItems()

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="context-menu"
                style={{
                    position: 'fixed',
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    zIndex: 9999,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.divider && index > 0 && <div className="context-menu-divider" />}
                        <button
                            className={`context-menu-item ${item.variant || 'default'}`}
                            onClick={() => {
                                item.action()
                                onClose()
                            }}
                        >
                            <item.icon size={14} className="context-menu-icon" />
                            <span>{item.label}</span>
                        </button>
                    </React.Fragment>
                ))}

                <style jsx>{`
                    .context-menu {
                        background: rgba(18, 18, 18, 0.92);
                        backdrop-filter: blur(60px) saturate(180%);
                        -webkit-backdrop-filter: blur(60px) saturate(180%);
                        border: 1px solid rgba(255, 255, 255, 0.18);
                        border-radius: 16px;
                        padding: 0.6rem;
                        min-width: 220px;
                        box-shadow: 
                            0 30px 60px -15px rgba(0, 0, 0, 0.95),
                            0 0 0 1px rgba(255, 255, 255, 0.08),
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                            inset 0 -1px 0 0 rgba(0, 0, 0, 0.3);
                    }

                    .context-menu-item {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.65rem 0.85rem;
                        border-radius: 8px;
                        font-size: 0.875rem;
                        font-weight: 500;
                        transition: all 0.15s ease;
                        border: none;
                        background: transparent;
                        cursor: pointer;
                        text-align: left;
                    }

                    .context-menu-item.default {
                        color: #d4d4d8;
                    }

                    .context-menu-item.default:hover {
                        background: rgba(255, 255, 255, 0.05);
                        color: white;
                    }

                    .context-menu-item.danger {
                        color: #f87171;
                    }

                    .context-menu-item.danger:hover {
                        background: rgba(248, 113, 113, 0.1);
                        color: #fca5a5;
                    }

                    .context-menu-item.success {
                        color: #4ade80;
                    }

                    .context-menu-item.success:hover {
                        background: rgba(74, 222, 128, 0.1);
                        color: #86efac;
                    }

                    .context-menu-icon {
                        flex-shrink: 0;
                    }

                    .context-menu-divider {
                        height: 1px;
                        background: rgba(255, 255, 255, 0.05);
                        margin: 0.4rem 0;
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    )
}
