import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface IUser {
    full_name: string
    image: string | null
}

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: IUser | null;
    setUser: (user: IUser) => void;
    login: (tokens: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedAccess && storedRefresh) {
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
        }
    }, []);

    useEffect(() => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        else localStorage.removeItem("accessToken");

        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        else localStorage.removeItem("refreshToken");

        if(user) localStorage.setItem("user",JSON.stringify(user));
        else localStorage.removeItem("user");

    }, [accessToken, refreshToken, user]);

    const login = (
        tokens: { accessToken: string; refreshToken: string },
    ) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                user,
                login,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside an AuthProvider");
    return context;
};
