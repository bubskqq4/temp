import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Companion',
}

export default function AICompanionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
