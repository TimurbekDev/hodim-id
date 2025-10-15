// login.js
import { api } from "../api";
import type { ILoginResponse } from "../types/auth";

export const login = async (userId: number) => {
    const { data } = await api.post<ILoginResponse>(
        `/auth/Login-hamroh?hamrohId=${userId}`,
        {},
        {
            headers: {
                Accept: "application/json",
                Authorization: "Basic aG9kaW1hZG1pbnVpOkhvZGltQWRtaW4xMjNA",
            },
            // withCredentials: true,
        }
    );
    return data
};
