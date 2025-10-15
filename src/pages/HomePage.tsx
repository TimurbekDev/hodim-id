import React, { useState } from "react";
import { Card } from "antd";
import { PlayCircleFilled } from "@ant-design/icons";
import { Button, DatePills, RoleToggle } from "../components/ui";
import Header from "../components/common/Header";
import ScheduleCard from "../components/common/ScheduleCard";
import DisciplineCard from "../components/common/DisciplineCard";

const HomePage: React.FC = () => {

    const [selectedDay, setSelectedDay] = useState<number>(4);
    const [role, setRole] = useState<'employee' | 'manager'>('employee');
    const dayValues = [29, 30, 1, 2, 3, 4, 5];

    return (
        <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col justify-between">
            <div className="home-card-top shrink-0 p-2 flex flex-col">
                <Header
                    avatarSrc="https://i.pravatar.cc/100?img=5"
                    avatarRightSrc="https://i.pravatar.cc/100?img=12"
                    name="Yapona Mama"
                    branch="Филиал Юнусabad"
                />

                <DatePills days={dayValues} selected={selectedDay} onSelect={setSelectedDay} />
                <RoleToggle value={role} onChange={setRole} />
            </div>

            <div className="home-card-middle flex-1 min-h-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex h-full min-h-0 flex-col gap-3">
                    <ScheduleCard className="flex-1 min-h-0" />
                    <DisciplineCard className="flex-1 min-h-0" />
                </div>
            </div>

            <div className="home-card-bottom shrink-0 p-4 sm:p-5">
                <Button
                    className="home-cta w-full !h-[clamp(48px,12vw,56px)] !px-5 text-base sm:!px-6 sm:text-lg"
                    Icon={<PlayCircleFilled />}
                >
                    Начать смену
                </Button>
            </div>
        </Card>
    );
};

export default HomePage;