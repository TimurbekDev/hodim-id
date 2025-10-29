import { api } from "@/api"
import { WorkTimeStatus } from "@/types/workTime"
import { getHeaderToken } from "@/utils/getHeaderToken"

interface ArriveProps {
    token: string
    image: string
    organizationClientId: number
    longitude: number
    latitude: number
    workTimeStatus:WorkTimeStatus
}

const base64ToFile = (base64: string, fileName = "arrival.jpg"): File => {
    const arr = base64.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[arr.length - 1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
}

export const arriveAndDeparture = async ({
    token,
    image,
    organizationClientId,
    longitude,
    latitude,
    workTimeStatus
}: ArriveProps) => {
    const headers = getHeaderToken(token)

    const file = base64ToFile(image)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("organizationClientId", organizationClientId.toString())
    formData.append("longitude", longitude.toString())
    formData.append("latitude", latitude.toString())

    if(workTimeStatus == WorkTimeStatus.not_arrived)
        return api.post("/work-times/arrive", formData, { headers })
    else if(workTimeStatus == WorkTimeStatus.arrived_not_deported)
        return api.post("/work-times/departure", formData, { headers })
}