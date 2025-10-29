import { useState } from "react";
import { Card, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/requests/getMe";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentUserBillingPlan } from "@/requests/billing";
import type { CurrentPlan } from "@/requests/billing";


import backIcon from "@/assets/icons/icon-navbar.svg";
import chevronRight from "@/assets/icons/Chevron.svg";
import themeIcon from "@/assets/icons/Dark Theme.svg";
import langIcon from "@/assets/icons/Local Language.svg";
import bellIcon from "@/assets/icons/Alert.svg";
import planIcon from "@/assets/icons/Document Checkmark.svg";
import orgIcon from "@/assets/icons/Briefcase.svg";
import supportIcon from "@/assets/icons/Person Support.svg";
import policyIcon from "@/assets/icons/Document Bullet List.svg";

type RowProps = {
    title: string;
    subtitle?: string;
    subtitleInline?: boolean;   // 👈 NEW
    iconSrc?: string;
    end?: React.ReactNode;
    onClick?: () => void;
};



const Row = ({ title, subtitle, subtitleInline, iconSrc, end, onClick }: RowProps) => {
    const clickable = Boolean(onClick);

    return (
        <div
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : -1}
            onClick={onClick}
            onKeyDown={(e) => {
                if (!clickable) return;
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); }
            }}
            className={[
                "w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-white text-left",
                clickable ? "cursor-pointer active:bg-gray-50" : "",
            ].join(" ")}
        >
            {iconSrc && <img src={iconSrc} alt="" className="w-5 h-5 opacity-70" />}

            {/* Title + Subtitle */}
            {subtitleInline ? (
                // ---- inline: title + subtitle on one line
                <div className="flex-1 flex items-center justify-between">
                    <div
                        className="text-[17px] leading-[22px] font-normal"
                        style={{ color: "#262633", fontFamily: '"Google Sans", sans-serif' }}
                    >
                        {title}
                    </div>

                    {subtitle && (
                        <div
                            className="text-[15px] leading-[18px] font-medium ml-2"
                            style={{ color: "#85889E", fontFamily: '"Google Sans", sans-serif' }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>


            ) : (
                // ---- stacked: title on first line, subtitle below (default)
                <div className="flex-1">
                    <div
                        className="text-[17px] leading-[22px] font-normal"
                        style={{ color: "#262633", fontFamily: '"Google Sans", sans-serif' }}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div
                            className="mt-0.5 text-[13px] leading-[18px] font-normal"
                            style={{ color: "#85889E", fontFamily: '"Google Sans", sans-serif' }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>
            )}

            {/* Right side */}
            {end ? (
                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    {end}
                </div>
            ) : (
                <img src={chevronRight} alt="" className="w-6 h-6 opacity-50" />
            )}
        </div>
    );
};



export default function ProfileSettingsPage() {
    const nav = useNavigate();
    const { accessToken, signOut } = useAuth();
    const { data: me } = useQuery({
        queryKey: ["getMe"],
        queryFn: () => getMe(accessToken!),
        enabled: !!accessToken,
    });

    const { data: myAvatar } = useQuery({
        queryKey: ["my-avatar-url", !!accessToken],
        enabled: !!accessToken,
        staleTime: 60_000,
        queryFn: async () => {
            const res = await fetch("/api/client/avatar/url", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) return null;
            const { url } = await res.json();
            return url as string | null;
        },
    });


    const userId = me?.id;
    // local UI state (you likely have a theme/lang store—these are placeholders)
    const [dark, setDark] = useState(false);
    const [notifications, setNotifications] = useState(true);

    // CURRENT PLAN
    const {
        data: plan,
        isLoading: loadingPlan,
    } = useQuery<CurrentPlan | null>({
        queryKey: ["current-plan", !!accessToken],
        queryFn: () => getCurrentUserBillingPlan(accessToken ?? undefined),
        enabled: !!accessToken,
        staleTime: 60_000,
        retry: false,
    });



    const fullName = me?.full_name || me?.username || "—";

    const avatar = myAvatar ?? (me?.image_url?.startsWith("http") ? me.image_url : "/img/avatar-fallback.png");

    return (
        <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col">
            {/* Header: back + centered title + logout */}
            <div className="relative flex items-center justify-center pt-4 pb-9">
                <button
                    onClick={() => nav(-1)}
                    className="absolute left-1 flex items-center justify-center"
                    aria-label="Назад"
                >
                    <img src={backIcon} alt="" className="w-25 h-25" />
                </button>

                <h1 className="text-[18px] font-medium text-gray-900">Профиль</h1>

                <button
                    onClick={signOut}
                    className="absolute right-4 px-3 h-9 rounded-full bg-white shadow-sm border text-red-500 text-[14px]"
                >
                    Выйти
                </button>
            </div>

            {/* Top: avatar + name + link */}
            <div className="px-4 sm:px-5">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar}
                        alt={fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div className="flex flex-col">
                        <div className="text-[16px] font-medium text-gray-900">
                            {fullName}
                        </div>
                        <button
                            onClick={() => nav(`/profile/${userId}/edit`)}
                            className="underline"
                            style={{ fontSize: 15, lineHeight: "18px", color: "#007BFF", fontFamily: '"Google Sans", sans-serif' }}
                        >
                            Изменить профиль
                        </button>

                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="flex-1 min-h-0 overflow-auto px-4 pb-4 sm:px-5 sm:pb-5">
                {/* Настройки */}
                <div
                    className="mt-8 mb-2 text-[17px] leading-[22px] font-medium"
                    style={{ color: "#85889E", fontFamily: '"Google Sans", sans-serif' }}
                >
                    Настройки
                </div>

                <div className="flex flex-col gap-0">
                    <Row
                        title="Тема"
                        iconSrc={themeIcon}
                        end={
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500">
                                    {dark ? "Тёмная" : "Светлая"}
                                </span>
                                <Switch checked={dark} onChange={setDark} />
                            </div>
                        }
                    />
                    <Row
                        title="Язык приложения"
                        iconSrc={langIcon}
                        subtitle="Русский"
                        onClick={() => nav("/settings/language")}
                    />
                    <Row
                        title="Уведомления"
                        iconSrc={bellIcon}
                        end={<Switch checked={notifications} onChange={setNotifications} />}
                    />
                </div>

                {/* Подписка */}
                <div className="mt-5 mb-2 text-[17px] font-medium text-gray-400">
                    Подписка
                </div>
                <div className="flex flex-col gap-0">
                    <Row
                        title="Текущий тариф"
                        iconSrc={planIcon}
                        subtitleInline
                        subtitle={loadingPlan ? "..." : plan?.name ?? "—"}
                        onClick={() => nav("/billing/plan")}
                    />


                    <Row
                        title="Мои организации"
                        iconSrc={orgIcon}
                        onClick={() => nav("/organizations")}
                    />
                </div>

                {/* О приложении */}
                <div className="mt-5 mb-2 text-[17px] font-medium text-gray-400">
                    О приложении
                </div>
                <div className="flex flex-col gap-0">
                    <Row
                        title="Поддержка"
                        iconSrc={supportIcon}
                        onClick={() => nav("/support")}
                    />
                    <Row
                        title="Политика конфиденциальности"
                        iconSrc={policyIcon}
                        onClick={() => nav("/policy")}
                    />
                </div>

                {/* Version */}
                <div
                    className="mt-6 text-[17px] leading-[22px] font-medium"
                    style={{ color: "#85889E", fontFamily: '"Google Sans", sans-serif' }}
                >
                    Версия 1.0.1
                </div>

            </div>
        </Card>
    );
}
