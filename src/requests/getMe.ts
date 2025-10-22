// import { api } from "@/api"
// import type { IUserResponse } from "@/types/me"

// export const getMe = async () => {
//     const { data } = await api.get<IUserResponse>('/client/me')
//     return data
// }

import { api } from "@/api";
import type { IUserResponse } from "@/types/me";

export const getMe = async (token?: string) => {
  const { data } = await api.get<IUserResponse>("/client/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
};
