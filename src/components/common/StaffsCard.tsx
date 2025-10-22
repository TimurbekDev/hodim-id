import React, { useState } from 'react';
import { Button, Card, List} from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '../../requests/getClients';
import { useNavigate } from 'react-router-dom';

const StaffsCard = ({organizationId}:{organizationId:number}) =>{
    const [, setSelectedId] = useState<number | null>(null)
    const { accessToken } = useAuth()
    const navigate = useNavigate();
    
    const { data: clients} = useQuery({
        queryKey: ['clients'],
        queryFn: async () => await getClients({
            organizationId,
            token: accessToken as string 
        }),
        enabled: !!accessToken,
    })

   return (
        <Card className="!border-0">
            <div className="flex flex-col gap-4 !border-1 border-gray-100 rounded-3xl w-full h-full p-4">
            <div>
                <p className='text-xl font-medium h-6'>Сотрудники</p>
            </div>
            <List
                className="flex flex-col gap-4 w-full h-[168px] text-center"
                itemLayout="horizontal"
                dataSource={clients?.items.slice(-3)}
                renderItem={(item) => (
                <List.Item
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className="!border-0 flex flex-row items-center !p-0 h-14 cursor-pointer"
                >
                    <div className='w-1/2 flex items-center gap-4'>
                        <img
                            src={item.image_url}
                            alt={item.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{item.full_name}</span>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <p className='font-medium text-sm'>Опоздание</p>
                        <div className='w-2.5 h-2.5 rounded-full bg-yellow-400'></div>
                    </div>
                </List.Item>
                )}
            />
                <Button 
                    onClick={() => navigate('clients')}
                    className='w-full !h-11 rounded-full !border-0 !bg-gray-100'>
                    <p className='font-medium text-black text-[15px]'>Все сотрудники</p>    
                </Button>
            </div>
        </Card>
    );

}

export default StaffsCard;