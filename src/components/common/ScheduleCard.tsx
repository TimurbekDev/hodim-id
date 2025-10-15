import React from 'react';
import { Card, Typography, Progress } from 'antd';

interface ScheduleCardProps {
    start?: string;
    end?: string;
    statusText?: string;
    className?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ start = '09:00', end = '18:00', statusText = 'Смена не началась', className = '' }) => {
    return (
        <Card className={`rounded-2xl border-gray-100 ${className}`}>
            <div className="h-full flex flex-col justify-between gap-3 p-4 sm:p-5">
                <div>
                    <Typography.Title level={4} className="!m-0 text-gray-900 !text-[clamp(18px,4.5vw,20px)]">{`${start} – ${end}`}</Typography.Title>
                    <Typography.Text className="text-xs text-gray-400 sm:text-sm">График работы</Typography.Text>

                    <div className="">
                        <div className="flex-1">
                            <Progress percent={0} showInfo={false} strokeLinecap="round" />
                            <div className='flex justify-end'>
                                <Typography.Text className="text-[12px]! text-gray-500! whitespace-nowrap sm:text-sm">{statusText}</Typography.Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-2 items-center gap-4 sm:gap-6">
                        <div className="flex flex-col items-center text-center">
                            <Typography.Title level={5} className="!mt-1 !mb-0 text-gray-300 !text-[clamp(18px,4.5vw,20px)]">-:-</Typography.Title>
                            <Typography.Text className="text-xs text-gray-400 sm:text-sm">Вход</Typography.Text>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Typography.Title level={5} className="!mt-1 !mb-0 text-gray-300 !text-[clamp(18px,4.5vw,20px)]">-:-</Typography.Title>
                            <Typography.Text className="text-xs text-gray-400 sm:text-sm">Выход</Typography.Text>
                        </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1 h-12 border-l-2 border-gray-200" aria-hidden="true" />
                </div>
            </div>
        </Card>
    );
};

export default ScheduleCard;
