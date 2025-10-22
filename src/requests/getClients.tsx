import { api } from "../api"
import type { ClientResponse } from "../types/client"
import { getHeaderToken } from "@/utils/getHeaderToken"

type IProps = {
    organizationId: number
    token: string
}

export const getClients = async ({organizationId, token}: IProps) => {

    const { data } = await api.get<ClientResponse>(`/organization-client/filter?organizationId=${organizationId}`,{
        headers: { ...getHeaderToken(token)}
    })
    
    return data
}