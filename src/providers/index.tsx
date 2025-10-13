import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

export default function AppProvider({ children }: { children: ReactNode }) {
    return <ConfigProvider>{children}</ConfigProvider>
}