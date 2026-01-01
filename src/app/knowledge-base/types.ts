export type ResourceType = 'Note' | 'Link' | 'Document'

export interface Resource {
    id: string
    title: string
    type: ResourceType
    content?: string
    url?: string
    tags: string[]
    project: string
    isPinned: boolean
    createdAt: number
}
