import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Spending Tracker',
}

export default function SpendingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
