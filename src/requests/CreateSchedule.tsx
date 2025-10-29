import { api } from "@/api"
import { getHeaderToken } from "@/utils/getHeaderToken"

interface CreateSchedulePayload {
    startTime: string
    endTime: string
    workDays: number[]
}

export type IProps = {
    payload: CreateSchedulePayload
    token: string
    organizationId: number
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
