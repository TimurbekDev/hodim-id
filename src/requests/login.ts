import { api } from "../api";

export const login = (userId: number) => api.post('/login', { userId })