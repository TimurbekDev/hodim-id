import { api } from "@/api"
import type { IOrganizationClient } from "@/types/org-client"
import { getHeaderToken } from "@/utils/getHeaderToken"

type IParams = {
    token:string,
    orgId:number
}

export const getRoles = async ({token , orgId}:IParams) => {
    const { data } = await api.get<IOrganizationClient[]>(`/organization-client/roles/${orgId}`,{
        headers:{
            ...getHeaderToken(token)
        }
    })
    return data
}