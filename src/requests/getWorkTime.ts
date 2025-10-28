import { api } from "@/api"
import type { IWorkTime } from "@/types/workTime"
import { getHeaderToken } from "@/utils/getHeaderToken"

type IProps = {
    day: string
    organizationId: number
    token: string
}

export const getWorkTime = async ({ day, organizationId, token }: IProps) => {
    const { data } = await api.get<IWorkTime>('/work-times/daily', {
        params: { day, organizationId },
        headers: {
            ...getHeaderToken(token),
        },
    })

    return data
}
