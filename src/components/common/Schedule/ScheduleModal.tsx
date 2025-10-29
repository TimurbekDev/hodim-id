import React, { useState } from "react";
import { Modal, Switch } from "antd"
import BackButton from "@/components/ui/BackButton";
import { createSchedule } from "@/requests/CreateSchedule";

interface ScheduleModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, handleClose }) => {
    const weekDays: Record<number, string> = {
        1: "Monday", 2: "Tuesday", 3: "Wednesday",
        4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"
    }


    const [name, setName] = useState("График 1")
    const [startTime, setStartTime] = useState("09:00:00")
    const [endTime, setEndTime] = useState("18:00:00")
    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])

    const handleDayToggle = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token") || ""
            const payload = {
                organizationUserId: 2,
                startTime,
                endTime,
                workDays: selectedDays
            }

            const res = await createSchedule(payload, token)
            console.log("Schedule created:", res)
            handleClose()
        } catch (err) {
            console.error("Error creating schedule:", err)
        }
    }




    return (
        <Modal open={isOpen} footer={null} onCancel={handleClose}>
            <div className="flex flex-col gap-6">
                <BackButton isX />

                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="p-2 bg-gray-100 text-xl rounded-xl"
                />

                <div className="flex gap-6">
                    <input
                        type="time"
                        defaultValue="09:00:00"
                        onChange={e => setStartTime(`${e.target.value}:00`)}
                    />

                    <input
                        type="time"
                        defaultValue="18:00:00"
                        onChange={e => setEndTime(`${e.target.value}:00`)}
                    />
                </div>

                <h3>Рабочие дни</h3>
                {Object.keys(weekDays).map(key => {
                    const d = Number(key)
                    return (
                        <div key={d} className="flex justify-between border-b py-3">
                            <span>{weekDays[d]}</span>
                            <Switch
                                checked={selectedDays.includes(d)}
                                onChange={() => handleDayToggle(d)}
                            />
                        </div>
                    )
                })}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white rounded-lg py-3"
                >
                    Создать
                </button>
            </div>
        </Modal>
    )
}

export default ScheduleModal;