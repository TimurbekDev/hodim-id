import React from 'react';
import { Card } from 'antd';
import ClientHeader from '@/components/common/StaffPageComponents/ClientHeader';
import ClientComponent from '@/components/common/StaffPageComponents/ClientComponent';
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import { Spin, Alert } from "antd";
import { getClients } from '@/requests/Client/ClientReqeusts';

const ClientPage: React.FC = () => {
    const { accessToken } = useAuth()
    const { orgId } = useParams()

    const parsedOrgId = orgId ? Number(orgId) : undefined
    const organizationId = Number.isFinite(parsedOrgId) ? (parsedOrgId as number) : undefined

    const { data: clients, isLoading, isError } = useQuery({
        queryKey: ["clients", orgId],
        queryFn: async () => {
            return await getClients({
                organizationId: organizationId as number,
                token: accessToken as string
            })
        },
        enabled: !!accessToken && !!orgId, 
    });

    
    if (isLoading) return (<Spin tip="Loading clients..." />);
    if (isError) return <Alert message="Failed to load clients" type="error" />;

    return(
        <Card className='home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-between'>
            <div className='home-card-top shrink-0 p-4 h-[100vh] flex flex-col gap-4'>
                <ClientHeader 
                    all={clients?.totalItems}
                    atWork={clients?.atWork}
                    absent={clients?.absent} 
                    className='!border-0'/>

                <ClientComponent items={clients?.items ?? []}/>
            </div>
        </Card>
    )
}

export default ClientPage;