'use client'

import React from 'react'
import { Sidebar } from '@/components/Sidebar'

export default function DesignLabPage() {
    return (
        <div className="layout-wrapper" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <main style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
                <iframe
                    src="http://localhost:9005"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#0f172a'
                    }}
                    title="Penpot Design Lab"
                    allow="clipboard-read; clipboard-write"
                />
            </main>
        </div>
    )
}
