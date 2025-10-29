import { api } from "@/api"
import { getHeaderToken } from "@/utils/getHeaderToken"

interface CreateSchedulePayload {
    startTime: string
    endTime: string
    workDays: number[]
    id?: number
}

export type IProps = {
    payload: CreateSchedulePayload
    token: string
    organizationId?: number
}

export const createSchedule = async ({ payload, token, organizationId }: IProps) => {
    const { data } = await api.post(
        `/schedules/create?organizationId=${organizationId}`,
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