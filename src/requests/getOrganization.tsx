import { api } from "../api"
import type { IOrgaqnization } from "../types/organization"
import { getHeaderToken } from "../utils/getHeaderToken"

type IProps = {
    orgId: number
    token: string
}

export const getOrganization = async ({ orgId, token }: IProps) => {

    const { data } = await api.get<IOrgaqnization>(`/organization/${orgId}`, {
        headers: { ...getHeaderToken(token) }
    })

    return data
}