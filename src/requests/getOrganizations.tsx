import { api } from "../api"
import type { IOrgaqnization } from "../types/organization"
import { getHeaderToken } from "../utils/getHeaderToken"


export const getOrganizations = async (token:string) => {
    console.log('Bearer',token);
    
    const { data } = await api.get<IOrgaqnization[]>(`/organization`, {
        headers: {
            ...getHeaderToken(token)
        }
    })

    return data
}