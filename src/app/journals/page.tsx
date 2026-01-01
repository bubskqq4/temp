'use client'

import { Sidebar } from '@/components/Sidebar'
import { JournalBooks } from '@/components/JournalBooks'

export default function JournalsPage() {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <JournalBooks />
        </div>
    )
}
