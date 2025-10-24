import React from 'react';
import { Card, Typography} from 'antd';
import DropdownButton from '../ui/DropdownButton';

interface BehaviourCardProps{
    worked?:number;
    late?:number;
    absent?:number;
    className?:string;
}

const BehaviourCard: React.FC<BehaviourCardProps> = ({
    worked = 12,
    late = 3, 
    absent = 1, 
    className = ''
}) => {
   const stats = [
    { label: 'Worked', value: worked },
    { label: 'Late', value: late },
    { label: 'Absent', value: absent },
  ];

    return(
        <Card className={`border-gray-100 rounded-2xl ${className}`}>
             <div className="flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
                <div className='flex flex-col gap-4'>
                    <div className="flex w-full items-center justify-between gap-3">
                        <Typography.Title level={4} className="!m-0 text-gray-900 !text-[clamp(18px,4.5vw,20px)]">
                            Общая сводка
                        </Typography.Title>
                        <DropdownButton 
                            className="rounded-full w-full !border-0 !bg-[#f3f4f6]"
                            width="90px"
                            height="36px">
                        </DropdownButton>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 h-[66px]">
                        {stats.map((item, index) => 
                            <div
                                key={index}
                                className="rounded-lg bg-[#f3f4f6] w-full h-full p-3 font-medium text-center">
                                <p className='text-xl p-0 m-0'>{item.value}</p>
                                <p className='text-sm leading-4'>{item.label}</p>
                            </div>
                        )}
                    </div>
                
                </div>
             </div>

            
        </Card>
    )
};

export default BehaviourCard;