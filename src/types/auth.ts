export interface IUser {
    full_name: string
    image: string | null
}

export interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: IUser | null;
    isLoading: boolean;
    isAuthorized: boolean;
    setUser: (user: IUser | null) => void;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
}

export interface ILoginResponse {
    accessToken: string
    refreshToken: string
}

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  signOut: () => void; // 👈 add this line
}
