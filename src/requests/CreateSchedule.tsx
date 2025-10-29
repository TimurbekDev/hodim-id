import { api } from "@/api"
import { getHeaderToken } from "@/utils/getHeaderToken"

interface CreateSchedulePayload {
    organizationUserId: number
    startTime: string
    endTime: string
    workDays: number[]
}

export const createSchedule = async (
    payload: CreateSchedulePayload,
    token: string
) => {
    const { data } = await api.post(
        "/schedules/create",
        payload,
        getHeaderToken(token)
    )
    return data
}