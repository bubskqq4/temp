import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Focus Room',
}

export default function FocusRoomLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
