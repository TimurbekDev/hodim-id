import { api } from "@/api"
import type { Client } from "@/types/client-detail"
import { getHeaderToken } from "@/utils/getHeaderToken"

export type IProps = {
    orgId: number
    clientId?: number
    token: string
    scheduleId?: number
    payload: CreateSchedulePayload
}

interface CreateSchedulePayload {
    startTime: string
    endTime: string
    workDays: number[]
    id?: number
    client_id: number
}

type GetClientScheduleProps = {
  orgId: number
  clientId: number
  token: string
}

export const getClientSchedule = async ({orgId, clientId, token}: GetClientScheduleProps) => {
    const { data } = await api.get<Client>(`client/detail?clientId=${clientId}&organizationId=${orgId}`, {
        headers: { ...getHeaderToken(token)}
    })
    
    return data
}



export const createSchedule = async ({ payload, token, orgId }: IProps) => {
    const { data } = await api.post(
        `/schedules/create?organizationId=${orgId}`,
        payload,
        {
            headers: {
                ...getHeaderToken(token)
            }
        }
    )

    return data
}

export const updateSchedule = async (payload: CreateSchedulePayload, token: string) => {
  const { data } = await api.put(`/schedules/modify`, payload, {
    headers: {
      ...getHeaderToken(token)
    }
  })

  return data
}

// export const deleteClientSchedule = async ({scheduleId, token}: IProps) => {
//     const { data } = await api.delete(`ch`)
// }