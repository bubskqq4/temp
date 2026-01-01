import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Performance Analytics',
}

export default function PerformanceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
