'use client'

import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'

export default function DashboardPage() {
    return (
        <div className="layout-wrapper">
            <Sidebar />
            <Dashboard />
        </div>
    )
}
