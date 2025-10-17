import React, { useState } from "react";
import { Card } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { Button, DatePills, RoleToggle } from "../components/ui";
import Header from "../components/common/Header";
import ScheduleCard from "../components/common/ScheduleCard";
import DisciplineCard from "../components/common/DisciplineCard";
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { getOrganization } from "../requests/getOrganization";
import { useAuth } from "../hooks/useAuth";
import { usePopups } from "../store/usePopups";
import { Popups } from "../utils/popups";
import SelectOrganizationPopup from "../components/common/Popups/SelectOrganizationPopup";
import BehaviourCard from "../components/common/BehaviourCard";
import StaffsCard from "../components/common/StaffsCard";


const OrganizationPage: React.FC = () => {
    const { orgId } = useParams()
    const [selectedDay, setSelectedDay] = useState<number>(4);
    const [role, setRole] = useState<'employee' | 'manager'>('employee');
    const dayValues = [29, 30, 1, 2, 3, 4, 5];
    const { accessToken } = useAuth()
    const { setActivePopup } = usePopups()

    React.useEffect(() => {
        if (!orgId) {
            setActivePopup({ popup: Popups.POPUP_ORG_SELECT })
        }
    }, [orgId,setActivePopup]);

    const parsedOrgId = orgId ? Number(orgId) : undefined
    const organizationId = Number.isFinite(parsedOrgId) ? (parsedOrgId as number) : undefined

    const {
        data: organization,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: async () => {
            return await getOrganization({
                orgId: organizationId as number,
                token: accessToken as string
            })
        },
        enabled: typeof organizationId === 'number' && !!accessToken,
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

    return (
        <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-between">
            <SelectOrganizationPopup />

            <div className="home-card-top shrink-0 p-2 flex flex-col">
                <Header
                    avatarSrc={organization?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA75MqsVqzyE7GY65mw8TxzuRmEhSZHBG0Yz4RqnOu6nLYU2wr1xSPHtImuznevPqxKHI&usqp=CAU"}
                    avatarRightSrc="https://i.pravatar.cc/100?img=12"
                    name={organization?.name || "Загрузка..."}
                    branch={organization?.address || "Адрес не указан"}
                />

                <DatePills days={dayValues} selected={selectedDay} onSelect={setSelectedDay} />
                <RoleToggle value={role} onChange={setRole} />
            </div>

            <div className="home-card-middle flex-1 min-h-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex h-full min-h-0 flex-col gap-3">
    
                    {role === "employee" ? (
                        <div>
                            <ScheduleCard className="flex-1 min-h-0" />
                            <DisciplineCard className="flex-1 min-h-0" />
                        </div>
                      
                    ) : (
                        <div className='flex flex-col h-full gap-3'>
                            <BehaviourCard></BehaviourCard> 
                            <StaffsCard />
                        </div>
                        
                    )}
                </div>
            </div>
            {role === "employee" &&
                <div className="home-card-bottom shrink-0 p-4 sm:p-5">
                    <Button
                        className="home-cta w-full !h-[clamp(48px,12vw,56px)] !px-5 text-base sm:!px-6 sm:text-lg"
                        Icon={<PlayCircleFilled />}>
                        Начать смену
                    </Button>
                </div>
            }
        </Card>
    );
};

export default OrganizationPage;