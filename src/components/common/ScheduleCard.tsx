import React, { useMemo, useEffect } from 'react';
import { Card, Typography, Progress } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getWorkTime } from '@/requests/WorkTime/WorkTimeRequests';
import { useAuth } from '@/hooks/useAuth';
import { WorkTimeStatus, WorkTimeArrivalStatus, WorkTimeDepartureStatus } from '@/types/workTime';

interface ScheduleCardProps {
    organizationId?: number;
    day?: Date;
    className?: string;
    setWorkTimeId: (workTimeId: number | undefined) => void;
    setWorkTimeStatus: (status: WorkTimeStatus | undefined) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
    organizationId, 
    day, 
    className = '',
    setWorkTimeId, 
    setWorkTimeStatus 
}) => {

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

    useEffect(() => {
        if (!data) {
            setWorkTimeStatus(undefined);
            return;
        }

        const arrived =
            data.arrival_status === WorkTimeArrivalStatus.AtWork ||
            data.arrival_status === WorkTimeArrivalStatus.Late ||
            Boolean(data.arrived_at);
      
        const departed =
            data.departed_status === WorkTimeDepartureStatus.Worked ||
            data.departed_status === WorkTimeDepartureStatus.LeftEarly ||
            Boolean(data.departed_at);

        if (arrived && departed) {
            setWorkTimeStatus(WorkTimeStatus.arrived_and_deported);
        } else if (arrived) {
            setWorkTimeStatus(WorkTimeStatus.arrived_not_deported);
        } else {
            setWorkTimeStatus(WorkTimeStatus.not_arrived);
        }
        setWorkTimeId(data.id)
    }, [data, setWorkTimeStatus]);

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

    const timeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const isToday = (date?: Date): boolean => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const formatTime = (value?: string | null, fallback = '-:-') => parseTime(value) ?? fallback;

    const start = formatTime(data?.start_time, '09:00');
    const end = formatTime(data?.end_time, '15:00');
    const checkIn = formatTime(data?.arrived_at);
    const checkOut = formatTime(data?.departed_at);

    // Calculate segmented progress
    const progressSegments = useMemo(() => {
        if (!data || !data.start_time || !data.end_time) {
            return { percent: 0, strokeColor: '#d9d9d9' };
        }

        const startMinutes = timeToMinutes(formatTime(data.start_time, '09:00'));
        const endMinutes = timeToMinutes(formatTime(data.end_time, '15:00'));
        const totalWorkMinutes = endMinutes - startMinutes;

        // If both arrived and departed
        if (data.arrived_at && data.departed_at) {
            const arrivedMinutes = timeToMinutes(formatTime(data.arrived_at));
            const departedMinutes = timeToMinutes(formatTime(data.departed_at));

            const lateMinutes = Math.max(0, arrivedMinutes - startMinutes);
            const workedMinutes = departedMinutes - arrivedMinutes;
            const earlyLeaveMinutes = Math.max(0, endMinutes - departedMinutes);

            const latePercent = (lateMinutes / totalWorkMinutes) * 100;
            const workedPercent = (workedMinutes / totalWorkMinutes) * 100;
            const earlyLeavePercent = (earlyLeaveMinutes / totalWorkMinutes) * 100;

            // Create gradient for segmented colors
            const segments = [];
            let currentPercent = 0;

            if (latePercent > 0) {
                segments.push(`#ff4d4f ${currentPercent}%`);
                currentPercent += latePercent;
                segments.push(`#ff4d4f ${currentPercent}%`);
            }

            if (workedPercent > 0) {
                segments.push(`#52c41a ${currentPercent}%`);
                currentPercent += workedPercent;
                segments.push(`#52c41a ${currentPercent}%`);
            }

            if (earlyLeavePercent > 0) {
                segments.push(`#ff4d4f ${currentPercent}%`);
                currentPercent += earlyLeavePercent;
                segments.push(`#ff4d4f ${currentPercent}%`);
            }

            return {
                percent: 100,
                strokeColor: segments.length > 2 ? `linear-gradient(to right, ${segments.join(', ')})` : '#52c41a'
            };
        }

        // If only arrived (still working)
        if (data.arrived_at && !data.departed_at) {
            if (isToday(day)) {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const arrivedMinutes = timeToMinutes(formatTime(data.arrived_at));

                const lateMinutes = Math.max(0, arrivedMinutes - startMinutes);
                const workedMinutes = Math.max(0, currentMinutes - arrivedMinutes);

                const latePercent = (lateMinutes / totalWorkMinutes) * 100;
                const workedPercent = (workedMinutes / totalWorkMinutes) * 100;
                const totalPercent = Math.min(100, latePercent + workedPercent);

                if (latePercent > 0) {
                    const segments = [
                        `#ff4d4f 0%`,
                        `#ff4d4f ${latePercent}%`,
                        `#52c41a ${latePercent}%`,
                        `#52c41a ${totalPercent}%`
                    ];
                    return {
                        percent: totalPercent,
                        strokeColor: `linear-gradient(to right, ${segments.join(', ')})`
                    };
                } else {
                    return {
                        percent: totalPercent,
                        strokeColor: '#52c41a'
                    };
                }
            } else {
                return { percent: 50, strokeColor: '#52c41a' };
            }
        }

        // If not arrived yet
        if (!data.arrived_at && isToday(day)) {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            
            if (currentMinutes > startMinutes) {
                const lateMinutes = currentMinutes - startMinutes;
                const latePercent = Math.min(100, (lateMinutes / totalWorkMinutes) * 100);
                return {
                    percent: latePercent,
                    strokeColor: '#ff4d4f'
                };
            }
        }

        return { percent: 0, strokeColor: '#d9d9d9' };
    }, [data, day]);

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
                        <Progress 
                            percent={Math.round(progressSegments.percent)} 
                            showInfo={false} 
                            strokeLinecap="round"
                            size={[330, 12]}
                            strokeColor={progressSegments.strokeColor}
                            trailColor="#f0f0f0"
                        />
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
