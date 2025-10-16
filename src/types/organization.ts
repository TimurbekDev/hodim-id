export interface IOrgaqnization {
    name: string
    address: string
    contact: string
    latitude: number
    longitude: number
    organization_id: number | null
    parent_view: unknown | null
    file: unknown | null
    avatar: string | null
    id: number
    childrenViews: (unknown | null)[]
    organizationClientViews: (unknown | null)[]
}