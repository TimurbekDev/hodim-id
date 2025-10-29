import React, { useState } from "react";
import { Modal, Switch } from "antd"
import BackButton from "@/components/ui/BackButton";
import { createSchedule, type IProps } from "@/requests/CreateSchedule";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ScheduleModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, handleClose }) => {
    const weekDays: Record<number, string> = {
        1: "Monday", 2: "Tuesday", 3: "Wednesday",
        4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"
    }

    
    const { orgId } = useParams()
    const parsedOrgId = orgId ? Number(orgId) : undefined
    const { accessToken } = useAuth()
    const [name, setName] = useState("График 1")
    const [startTime, setStartTime] = useState("09:00:00")
    const [endTime, setEndTime] = useState("18:00:00")
    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5])

    const handleDayToggle = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (data: IProps) => await createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ClientSchedule'] })
            console.log("invalidated")
        },
        onError: () => {
            console.log("invalidated err")
        }
    })
    const handleSubmit = async () => {
        const payload = {
            startTime,
            endTime,
            name,
            workDays: selectedDays
        }

        mutation.mutate({
            payload,
            token: accessToken as string,
            organizationId: parsedOrgId as number
        })
        handleClose()
    }



    return (
        <Modal 
            open={isOpen}
            footer={null}
            onCancel={handleClose}
            width="100vw"
            styles =
            {
                { body: 
                    { 
                        height: "100vh" 
                    } 
                }
            }
        >
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

                <Button title="create" onClick={handleSubmit} className="w-full"/>
            </div>
            
        </Modal>
    )
}

export default ScheduleModal;