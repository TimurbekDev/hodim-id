import { api } from "@/api"
import { getHeaderToken } from "@/utils/getHeaderToken"

interface ArriveProps {
    token: string
    arrivalImage: string
    organizationClientId: number
    longitude: number
    latitude: number
}

export const arrive = async ({
    token,
    arrivalImage,
    organizationClientId,
    longitude,
    latitude,
}: ArriveProps) => {
    const headers = getHeaderToken(token)

    const payload = {
        arrivalImage,
        organizationClientId,
        longitude,
        latitude,
    }

    return api.post("/work-times/arrive", payload, { headers })
}