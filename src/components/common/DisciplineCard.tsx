import React from 'react';
import { Card, Typography, Progress } from 'antd';

interface DisciplineCardProps {
    percent?: number;
    className?: string;
}

const DisciplineCard: React.FC<DisciplineCardProps> = ({ percent = 92, className = '' }) => {
    return (
        <Card className={`rounded-2xl border-gray-100 ${className}`} >
            <div className="flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
                <div>
                    <div className="flex w-full items-center justify-between gap-3">
                        <Typography.Title level={4} className="!m-0 text-gray-900 !text-[clamp(18px,4.5vw,20px)]">Дисциплина</Typography.Title>
                        <Typography.Text className="text-sm font-semibold text-gray-900 sm:text-base">{percent}%</Typography.Text>
                    </div>
                    <Typography.Text className="mt-1 block text-xs text-gray-400 sm:mt-2 sm:text-sm">За август</Typography.Text>
                    <Progress percent={percent} showInfo={false} strokeColor={{ '0%': '#20d789', '100%': '#ff4d4f' }} strokeLinecap="round" className="!mt-3 sm:!mt-4" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 sm:mt-4 sm:text-sm">
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-green-500" />Вовремя: 12</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />Пропуск: 1</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />Опоздание: 3</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" />Ранний уход: 0</span>
                </div>
            </div>
        </Card>
    );
};

export default DisciplineCard;
