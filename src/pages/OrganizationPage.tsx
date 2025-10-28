import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { Button, DatePills, RoleToggle } from "@/components/ui";
import Header from "@/components/common/Header";
import ScheduleCard from "@/components/common/ScheduleCard";
import DisciplineCard from "../components/common/DisciplineCard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrganization } from "../requests/getOrganization";
import { useAuth } from "../hooks/useAuth";
import { usePopups } from "../store/usePopups";
import { Popups } from "../utils/popups";
import SelectOrganizationPopup from "../components/common/Popups/SelectOrganizationPopup";
import BehaviourCard from "../components/common/BehaviourCard";
import StaffsCard from "../components/common/StaffsCard";
import { getRoles } from "@/requests/getRoles";
import CameraCapture from "@/components/ui/Camera";
import { arrive } from "@/requests/arrive";


const OrganizationPage: React.FC = () => {
    const { orgId } = useParams()
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [role, setRole] = useState<string>('Employee');
    const { accessToken } = useAuth()
    const { setActivePopup } = usePopups()
    const [isOpen, setIsOpen] = useState(false);

    React.useEffect(() => {
        if (!orgId) {
            setActivePopup({ popup: Popups.POPUP_ORG_SELECT })
        }
    }, [orgId, setActivePopup]);

    const parsedOrgId = orgId ? Number(orgId) : undefined
    const organizationId = Number.isFinite(parsedOrgId) ? (parsedOrgId as number) : undefined

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ arrivalImage, longitude, latitude }: {
            arrivalImage: string
            longitude: number
            latitude: number
        }) => await arrive({
            token: accessToken as string,
            organizationClientId: organizationId as number,
            arrivalImage,
            longitude,
            latitude
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['work-time'] })
        }
    })
    const handleCapture = (img: string) => {
        mutation.mutate({
            arrivalImage: img,
            latitude: 111,
            longitude: 111
        })
    };

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

    const { data: organizationRoles } = useQuery({
        queryKey: ['getRoles', organizationId],
        queryFn: async () => await getRoles({ token: accessToken as string, orgId: organizationId as number }),
        enabled: typeof organizationId === 'number' && !!accessToken,
    })

    useEffect(() => {
        if (organizationRoles && organizationRoles.length > 0) {
            const availableRoles = organizationRoles.map(orgRole => orgRole.role).filter((role, index, self) => self.indexOf(role) === index);
            if (!availableRoles.includes(role) && availableRoles.length > 0) {
                setRole(availableRoles[0]);
            }
        }
    }, [organizationRoles, role]);

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

                <DatePills selected={selectedDate} onSelect={setSelectedDate} />
                <RoleToggle
                    value={role}
                    onChange={setRole}
                    roles={organizationRoles?.map(orgRole => orgRole.role).filter((role, index, self) => self.indexOf(role) === index).reverse() || []}
                />
            </div>

            <div className="home-card-middle flex-1 min-h-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex h-full min-h-0 flex-col gap-3">

                    {role === "Employee" ? (
                        <div>
                            <ScheduleCard day={selectedDate as Date} organizationId={organizationId} className="flex-1 min-h-0" />
                            <DisciplineCard className="flex-1 min-h-0" />
                        </div>

                    ) : (
                        <div className='flex flex-col h-full gap-3'>
                            <BehaviourCard></BehaviourCard>
                            <StaffsCard organizationId={organizationId as number} />
                        </div>

                    )}
                </div>
            </div>
            {role === "Employee" &&
                <div className="home-card-bottom shrink-0 p-4 sm:p-5" onClick={() => setIsOpen(true)}>
                    <Button
                        className="home-cta w-full !h-[clamp(48px,12vw,56px)] !px-5 text-base sm:!px-6 sm:text-lg"
                        Icon={<PlayCircleFilled />}>
                        Начать смену
                    </Button>
                </div>
            }
            <CameraCapture
                open={isOpen}
                onClose={() => setIsOpen(false)}
                onCapture={handleCapture}
            />
        </Card>
    );
};

export default OrganizationPage;