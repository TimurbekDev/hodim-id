import type { Discipline } from "@/types/discipline"
import { api } from "../api"
import { getHeaderToken } from "@/utils/getHeaderToken"

 type IProps = {
    organizationId: number
    token: string
}

export const getDiscipline = async ({ organizationId, token }: IProps) => {
  const { data } = await api.get<Discipline>(
    `work-times/behaviour?organizationId=${organizationId}`,
    {
      headers: { ...getHeaderToken(token) }
    }
  )

  return data
}