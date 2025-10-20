import React, { useState } from 'react';
import { Card, List } from 'antd';
import ClientHeader from '@/components/common/StaffPageComponents/ClientHeader';
import ClientBody from '@/components/common/StaffPageComponents/ClientBody';

const ClientPage: React.FC = () => {

    return(
        <Card className='home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-between'>
            <div className='home-card-top shrink-0 p-4 h-[100vh] flex flex-col gap-4'>
                <ClientHeader className='!border-0'/>
                <ClientBody/>
            </div>
        </Card>
    )
}

export default ClientPage;