'use client'

import { Sidebar } from '@/components/Sidebar'
import { Inbox } from '@/components/Inbox'

export default function InboxPage() {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <Inbox />
        </div>
    )
}
