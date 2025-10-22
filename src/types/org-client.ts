import type { IClient } from "./client"
import type { IOrgaqnization } from "./organization"

export interface IOrganizationClient {
  organizationId: number
  organizationView: IOrgaqnization | null
  userId: number
  clientView: IClient | null
  role: string
  position: string | null
  id: number
}