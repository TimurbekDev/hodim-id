
import React from "react"; 
import { Avatar, Card } from "antd";
import BackButton from "@/components/ui/BackButton";
import { Button } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getClientSchedule } from "@/requests/getClientSchedule";


const ClientDetailPage: React.FC = () =>{
    const { orgId , clientId} = useParams()
    const { accessToken } = useAuth()

    console.log(`org id from param: ${orgId}`)
    console.log(`CL id from param: ${clientId}`)
 
    const parsedOrgId = orgId ? Number(orgId) : undefined
    const parsedClientId = clientId ? Number(clientId) : undefined
    const organizationId = Number.isFinite(parsedOrgId) ? (parsedOrgId as number) : undefined
    const clId = Number.isFinite(parsedClientId) ? (parsedClientId as number) : undefined

    console.log(clId)
    console.log(organizationId)

    const {
            data: client,
            isLoading,
            isError
    } = useQuery({
            queryKey: ['ClientSchedule', orgId, clientId],
            queryFn: async () => {
                return await getClientSchedule({
                    orgId: organizationId as number,
                    clientId: clId as number,
                    token: accessToken as string
                })
            },
            enabled: typeof orgId === 'number' && !!accessToken,
    });

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

    if (isError) {
        return (
            <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-center items-center">
                <div className="text-center p-8">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                        Ошибка загрузки
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Не удалось загрузить данные организации
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="!bg-red-500 !text-white !border-red-500">
                        Попробовать снова
                    </Button>
                </div>
            </Card>
        );
    }



    const firstLetter =
    client?.full_name && client?.full_name.trim().length > 0
    ? client.full_name.charAt(0).toUpperCase()
    : "U";

    return(
         <Card className='home-card w-full !p-4 max-w-[520px] h-full rounded-3xl shadow-2xl border-1 overflow-hidden flex flex-col overflow-y-auto justify-between'>
            <div className="flex w-full justify-between items-center h-11">
                <BackButton />
                <Button
                    className="!h-full !bg-white !border-none !shadow-lg"
                >
                    <p className="text-black text-base font-medium text-">Изменить профиль</p>
                </Button>
            </div>
            <div className="flex flex-col">
                {client?.image_url ? (
                    <Avatar
                        size={80}
                        src={client.image_url}
                        alt={client.full_name || "User"}/>
                    ) : (
                        <Avatar 
                            size={80}
                            style={{
                                backgroundColor: "#1677ff",
                                color: "#fff",
                                fontSize: 28,
                                fontWeight: 600,
                            }}
                        >
                            {firstLetter}
                        </Avatar>

                    )}
            </div>
        </Card>
    )
}

export default ClientDetailPage;