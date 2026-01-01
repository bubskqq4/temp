import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'OSS Roadmap',
}

export default function GithubLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
