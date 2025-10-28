import React, { useMemo } from 'react';
import { Card, Typography, Progress } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getWorkTime } from '@/requests/getWorkTime';
import { useAuth } from '@/hooks/useAuth';

interface ScheduleCardProps {
    organizationId?: number;
    day?: Date;
    className?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ organizationId, day, className = '' }) => {

    const { accessToken } = useAuth()

    const queryDate = useMemo(
        () => (day ? day.toISOString().split('T')[0] : undefined),
        [day],
    );

    const { data, isLoading } = useQuery({
        queryKey: ['work-time', organizationId, queryDate],
        queryFn: () =>
            getWorkTime({
                organizationId: organizationId!,
                day: queryDate as string,
                token: accessToken as string
            }),
        enabled: Boolean(organizationId && queryDate),
    });

    const parseTime = (value?: string | null) => {
        if (!value) {
            return null;
        }

        const normalized = value.trim();
        const amPmMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (amPmMatch) {
            let hours = Number(amPmMatch[1]) % 12;
            const minutes = amPmMatch[2];
            if (amPmMatch[3].toUpperCase() === 'PM') {
                hours += 12;
            }
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }

        const hhmmMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
        if (hhmmMatch) {
            const hours = Number(hhmmMatch[1]) % 24;
            const minutes = hhmmMatch[2];
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }

        const parsed = new Date(normalized);
        if (!Number.isNaN(parsed.getTime())) {
            return new Intl.DateTimeFormat('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).format(parsed);
        }

        return null;
    };

    const formatTime = (value?: string | null, fallback = '-:-') => parseTime(value) ?? fallback;

    const start = formatTime(data?.start_time, '09:00');
    const end = formatTime(data?.end_time, '15:00');
    const checkIn = formatTime(data?.arrived_at);
    const checkOut = formatTime(data?.departed_at);
    const percent = 0

    const statusText = useMemo(() => {
        if (!organizationId || !queryDate) {
            return 'Выберите организацию и дату';
        }
        if (isLoading) {
            return 'Загрузка...';
        }
        if (!data) {
            return 'Смена не началась';
        }
        if (data?.arrived_at && data?.departed_at) {
            return 'Смена завершена';
        }
        if (data?.arrived_at) {
            return 'Смена в процессе';
        }
        return 'Смена не началась';
    }, [organizationId, queryDate, isLoading, data?.arrived_at, data?.departed_at]);

    return (
        <Card className={`rounded-2xl border-gray-100 ${className}`}>
            <div className="flex h-full flex-col justify-between gap-3 p-4 sm:p-5">
                <div>
                    <Typography.Title
                        level={4}
                        className="!m-0 text-gray-900 !text-[clamp(18px,4.5vw,20px)]"
                    >
                        {`${start} – ${end}`}
                    </Typography.Title>
                    <Typography.Text className="text-xs text-gray-400 sm:text-sm">
                        График работы
                    </Typography.Text>

                    <div className="mt-2 flex-1">
                        <Progress percent={percent} showInfo={false} strokeLinecap="round" />
                        <div className="flex justify-end">
                            <Typography.Text className="text-[12px] text-gray-500 whitespace-nowrap sm:text-sm">
                                {statusText}
                            </Typography.Text>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-2 items-center gap-4 sm:gap-6">
                        <div className="flex flex-col items-center text-center">
                            <Typography.Title
                                level={5}
                                className="!mt-1 !mb-0 text-gray-700 !text-[clamp(18px,4.5vw,20px)]"
                            >
                                {checkIn}
                            </Typography.Title>
                            <Typography.Text className="text-xs text-gray-400 sm:text-sm">
                                Вход
                            </Typography.Text>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Typography.Title
                                level={5}
                                className="!mt-1 !mb-0 text-gray-700 !text-[clamp(18px,4.5vw,20px)]"
                            >
                                {checkOut}
                            </Typography.Title>
                            <Typography.Text className="text-xs text-gray-400 sm:text-sm">
                                Выход
                            </Typography.Text>
                        </div>
                    </div>
                    <div
                        className="absolute left-1/2 top-1/2 h-12 -translate-x-1/2 -translate-y-1/2 transform border-l-2 border-gray-200"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </Card>
    );
};

export default ScheduleCard;
