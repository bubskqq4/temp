import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Journals',
}

export default function JournalsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
