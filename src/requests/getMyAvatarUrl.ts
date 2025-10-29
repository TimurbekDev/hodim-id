// src/requests/avatar.ts
import { api } from "@/api";

export async function getMyAvatarUrl(token: string): Promise<string | null> {
    const { data } = await api.get<{ url: string | null }>(
        "client/avatar/url", // <- NO leading slash
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data?.url ?? null;
}

export async function uploadAvatar(file: File, token: string): Promise<boolean> {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post(
        "client/avatar", // <- NO leading slash
        form,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.status >= 200 && res.status < 300;
}
