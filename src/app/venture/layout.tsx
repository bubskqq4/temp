import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Venture Command',
}

export default function VentureLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
