import { api } from "@/api"
import type { ClientResponse, ClientView, ClientViewResponse, EgovClientResponse, OrgClientView } from "@/types/client"
import type { Discipline } from "@/types/discipline"
import type { IOrganizationClient } from "@/types/org-client"
import { getHeaderToken } from "@/utils/getHeaderToken"

type IProps = {
    organizationId: number
    token: string
}

type IEgovClientProps = {
    token: string
    pinfl: string
}

interface CraateClientProps {
    token: string
    payload: ClientView
}

interface CreateOrgClientProps {
    token: string
    payload: OrgClientView
}

export const createOrgClient = async ({token, payload}: CreateOrgClientProps) => {
    const { data } = await api.post(`/organization/member`, payload,{
        headers:{
            ...getHeaderToken(token)
        }
    }) 

    return data
}

export const createClient = async ({ token, payload }: CraateClientProps): Promise<ClientViewResponse> => {
  const { data } = await api.post<ClientViewResponse>("/client", payload, {
    headers: {
      ...getHeaderToken(token),
    },
  })

  return data
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

export const getUserInfo = async ({ token, pinfl }: IEgovClientProps) => {
    const { data } = await api.get<EgovClientResponse>(`/client/by-pinfl?pinfl=${pinfl}`,
        {headers:{...getHeaderToken(token)}}
    )

    return data;
};