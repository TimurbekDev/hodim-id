import { Button } from "@/components/ui";
import type { Schedule } from "@/types/client-detail";
import { Card, List } from "antd";
import pen from "@/assets/icons/pen.svg";
import ScheduleModal from "../Schedule/ScheduleModal";
import { useState } from "react";

interface ScheduleEditCardProps{
    schedules?: Schedule[];
}

const ScheduleEditCard: React.FC<ScheduleEditCardProps> = ({schedules}) => {
    const dayMap: Record<number, string> = {
        1: "пн,",
        2: "вт,",
        3: "ср,",
        4: "чт,",
        5: "пт,",
        6: "сб,"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleClick = () => {
        setIsModalOpen(true);
        console.log("handle click is pressed")

    };
    const handleClose = () =>{
        setIsModalOpen(false);
        console.log("handle close is pressed")
    };

    return(
        <div className="flex flex-col gap-4">
            <Card className="!border-1 !rounded-3xl !p-2 w-full">
                <List
                    className="w-full !p-0 !m-0" 
                    dataSource={schedules}
                    renderItem={(item) =>(
                        <List.Item
                            className="flex gap-0 !p-0 ">
                            <div className="h-full w-full p-2 flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <p className="font-medium text-xl">{item.name}</p>
                                    <Button className="w-9 !h-9 !bg-gray-200 !border-0 !p-0">
                                        <img src={pen} width={24} height={24}/>
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Рабочие дни</p>
                                        <div className="flex">
                                            {item.workDays.map((x) => (
                                                <p className="mr-1 text-lg" key={x}>{dayMap[x]}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Часы</p>
                                        <div className="flex">
                                            <p className="text-lg">{item.startTime}</p>
                                            <p className="text-xl">-</p>
                                            <p className="text-lg">{item.endTime}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </List.Item>
                    )}>
                </List>
                {<ScheduleModal isOpen={isModalOpen} handleClose={handleClose} /> }
                <Button 
                    onClick={handleClick}
                    className="w-full !h-11 !bg-gray-100 mb-2 !border-0 shadow-none">
                        <p className="font-medium font-xl text-black">Добавить график</p>
                </Button>
            </Card>
            <Button
                className="w-full !h-11">
                <p className="text-[15px] font-medium">Экспорт табеля сотрудника</p>
            </Button>
    
        </div>
    
    )
}
export default ScheduleEditCard;