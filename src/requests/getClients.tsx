import { api } from "../api"
import type { IClient } from "../types/client"
import { getHeaderToken } from "../utils/getHeaderToken"

export const getClients = async (token:string) =>{
    console.log('Bearer',token);

    const { data } = await api.get<IClient[]>(`/client`, {
        headers: {
            ...getHeaderToken(token)
        }
    })

    return data
}