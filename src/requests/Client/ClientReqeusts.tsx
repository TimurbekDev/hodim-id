import { api } from "@/api"
import type { ClientResponse } from "@/types/client"
import type { Discipline } from "@/types/discipline"
import type { IOrganizationClient } from "@/types/org-client"
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

export const getDiscipline = async ({ organizationId, token }: IProps) => {
  const { data } = await api.get<Discipline>(
    `work-times/behaviour?organizationId=${organizationId}`,
    { headers: { ...getHeaderToken(token) } }
  )

  return data
}

export async function getMyAvatarUrl(token: string): Promise<string | null> {
    const { data } = await api.get<{ url: string | null }>(
        "client/avatar/url", 
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data?.url ?? null;
}

export async function uploadAvatar(file: File, token: string): Promise<boolean> {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post(
        "client/avatar", 
        form,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.status >= 200 && res.status < 300;
}

export const getRoles = async ({token , organizationId}:IProps) => {
    const { data } = await api.get<IOrganizationClient[]>(`/organization-client/roles/${organizationId}`,{
        headers:{
            ...getHeaderToken(token)
        }
    })
    return data
}
