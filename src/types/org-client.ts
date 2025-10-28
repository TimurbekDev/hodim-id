import type { Client } from "./client-detail"
import type { IOrgaqnization } from "./organization"

export interface IOrganizationClient {
  organizationId: number
  organizationView: IOrgaqnization | null
  userId: number
  clientView: Client | null
  role: string
  position: string | null
  id: number
}