import { api } from "@/api"
import type { IOrgaqnization } from "@/types/organization"
import { getHeaderToken } from "@/utils/getHeaderToken"

type IProps = {
    orgId: number
    token: string
}


export const getOrganization = async ({ orgId, token }: IProps) => {
    console.log("auth succ")
    const { data } = await api.get<IOrgaqnization>(`/organization/${orgId}`, {
        headers: { ...getHeaderToken(token) }
    })

    return data
}

export const getOrganizations = async (token:string) => {
    console.log('Bearer',token);
    
    const { data } = await api.get<IOrgaqnization[]>(`/organization`, {
        headers: {
            ...getHeaderToken(token)
        }
    })

    return data
}


