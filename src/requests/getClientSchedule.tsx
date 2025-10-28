import { api } from "../api"
import type { Client } from "@/types/client-detail"
import { getHeaderToken } from "../utils/getHeaderToken"

type IProps = {
    orgId: number
    clientId: number
    token: string
}

export const getClientSchedule = async ({orgId, clientId, token}: IProps) => {
    const { data } = await api.get<Client>(`client/detail?clientId=${clientId}&organizationId=${orgId}`, {
        headers: { ...getHeaderToken(token)}
    })
    
    return data
}