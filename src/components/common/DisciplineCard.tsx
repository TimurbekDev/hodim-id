import React from 'react';
import { Card, Typography, Progress } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getDiscipline } from '@/requests/Client/ClientReqeusts';

interface DisciplineCardProps {
    className?: string;
    organizationId: number
    accessToken: string
}

const DisciplineCard: React.FC<DisciplineCardProps> = ({ className = '', organizationId, accessToken}) => {
    
    const { data, isLoading } = useQuery({
        queryKey: ['discipline', organizationId],
        queryFn: () =>
            getDiscipline({
                organizationId,
                token: accessToken as string
            }),
        enabled: !!accessToken && !!organizationId
    })

    if (isLoading) {
        return (
            <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-center items-center">
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-500">Загрузка организации...</p>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className={`rounded-2xl border-gray-100 ${className}`} >
            <div className="flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
                <div>
                    <div className="flex w-full items-center justify-between gap-3">
                        <Typography.Title level={4} className="!m-0 text-gray-900 !text-[clamp(18px,4.5vw,20px)]">Дисциплина</Typography.Title>
                        <Typography.Text className="text-sm font-semibold text-gray-900 sm:text-base">{data?.discipline}%</Typography.Text>
                    </div>
                    <Typography.Text className="mt-1 block text-xs text-gray-400 sm:mt-2 sm:text-sm">За август</Typography.Text>
                    <Progress percent={data?.discipline} showInfo={false} size={[330, 12]} strokeColor={{ '0%': '#20d789', '100%': '#ff4d4f' }} strokeLinecap="round" className="!mt-3 sm:!mt-4" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 sm:mt-4 sm:text-sm">
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-green-500" />Вовремя: {data?.onTime}</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />Пропуск: {data?.absent}</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />Опоздание: {data?.delay}</span>
                    <span className="flex items-center gap-1.5 sm:gap-2"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" />Ранний уход: {data?.early_departed}</span>
                </div>
            </div>
        </Card>
    );
};

export default DisciplineCard;
