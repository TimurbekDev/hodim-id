import { api } from "@/api"
import type { IUserResponse } from "@/types/me"

export const getMe = async () => {
    const { data } = await api.get<IUserResponse>('/me')
    return data
}