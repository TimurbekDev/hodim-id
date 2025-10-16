import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

export default function AppProvider({ children }: { children: ReactNode }) {
    return <ConfigProvider>
        <AuthProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </AuthProvider>
    </ConfigProvider>
}