import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import type { ILoginResponse, IUser } from "../types/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUserState] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");

        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);

        if (storedUser) {
            try {
                setUserState(JSON.parse(storedUser) as IUser);
            } catch {
                localStorage.removeItem("user");
            }
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        else localStorage.removeItem("accessToken");

        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        else localStorage.removeItem("refreshToken");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    }, [accessToken, refreshToken, user]);

    const login = (
        tokens: ILoginResponse,
    ) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUserState(null);
    };
    console.log(accessToken,refreshToken);
    

    const isAuthorized = Boolean(accessToken && refreshToken);

    const updateUser = (nextUser: IUser | null) => {
        setUserState(nextUser);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                user,
                isLoading,
                isAuthorized,
                login,
                logout,
                setUser: updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};