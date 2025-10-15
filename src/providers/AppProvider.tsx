import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
    return <ConfigProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </ConfigProvider>
}