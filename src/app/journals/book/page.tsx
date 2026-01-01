'use client'

import { Sidebar } from '@/components/Sidebar'
import { JournalEntries } from '@/components/JournalEntries'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function JournalBookContent() {
    const searchParams = useSearchParams()
    const bookId = searchParams.get('id') || 'default'

    return <JournalEntries bookId={bookId} key={bookId} />
}

export default function JournalBookPage() {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <Suspense fallback={<div className="flex-1 bg-[#050505]" />}>
                <JournalBookContent />
            </Suspense>
        </div>
    )
}
