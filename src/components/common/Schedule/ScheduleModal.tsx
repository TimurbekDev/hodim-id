import React, { useEffect, useState } from "react";
import { Modal, Switch } from "antd"
import { createSchedule, type IProps } from "@/requests/CreateSchedule";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Schedule } from "@/types/client-detail";

interface ScheduleModalProps {
    isOpen: boolean;
    handleClose: () => void;
    schedule?: Schedule;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, handleClose, schedule }) => {
    const weekDays: Record<number, string> = {
        1: "Monday", 2: "Tuesday", 3: "Wednesday",
        4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"
    }
    
    const { orgId } = useParams()
    const parsedOrgId = orgId ? Number(orgId) : undefined
    const { accessToken } = useAuth()
    const [name, setName] = useState(schedule?.name ?? "График 1")
    const [startTime, setStartTime] = useState(
        schedule?.startTime?.substring(0, 5) ?? "09:00"
    )
    const [endTime, setEndTime] = useState(
        schedule?.endTime?.substring(0, 5) ?? "18:00"
    )
    const [selectedDays, setSelectedDays] = useState<number[]>(
        schedule?.workDays ?? [1, 2, 3, 4, 5]
    )

    const handleDayToggle = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    useEffect(() => {
        if (schedule) {
            setName(schedule.name)
            setStartTime(schedule.startTime.substring(0, 5))
            setEndTime(schedule.endTime.substring(0, 5))
            setSelectedDays(schedule.workDays)
        }
    }, [schedule, isOpen])

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
    const handleSubmit = () => {
        const payload = {
            name,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
            workDays: selectedDays,
        }

        if (schedule?.id) {
            mutation.mutate({
                payload: { ...payload, id: schedule.id },
                token: accessToken as string,
                organizationId: parsedOrgId as number,
                isEdit: true
            })
        } else {
            mutation.mutate({
                payload,
                token: accessToken as string,
                organizationId: parsedOrgId as number
            })
        }

        handleClose()
    }



    return (
        <Modal
            open={isOpen}
            footer={null}
            onCancel={handleClose}
            width="100vw"
            height="100vh"
            style={{ top: 0, padding: 0 }}
            styles={{ body: { height: "100vh" } }}
        >
            <div className="flex flex-col gap-1 items-end py-10">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-6">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="p-2 bg-gray-100 text-xl rounded-xl "
                        />

                        <div className="flex gap-6">
                            <input
                                type="time"
                                defaultValue="09:00:00"

                                className="w-27 h-14 bg-gray-100 rounded-3xl text-black text-3xl py-2 px-3"
                                onChange={e => setStartTime(`${e.target.value}:00`)}
                            />

                            <input
                                type="time"
                                defaultValue="18:00:00"
                                className="w-27 h-14 bg-gray-100 rounded-3xl text-black text-3xl py-2 px-3"
                                onChange={e => setEndTime(`${e.target.value}:00`)}
                            />
                        </div>
                    </div>

                    <div  className="flex flex-col gap-3 "> 
                        <div>
                            <h3 className="font-medium text-[22px]">Рабочие дни</h3>
                            {Object.keys(weekDays).map(key => {
                                const d = Number(key)
                                return (
                                    <div key={d} className="flex justify-between items-center border-b border-gray-200 h-14">
                                        <p className="text-[17px]">{weekDays[d]}</p>
                                        <Switch
                                            checked={selectedDays.includes(d)}
                                            onChange={() => handleDayToggle(d)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                         <Button title="create" onClick={handleSubmit} className="w-full !h-11">
                                <p className="text-white text-lg font-medium">Save</p>
                        </Button>
                    </div>
                </div>

            </div>

        </Modal>
    )
}

export default ScheduleModal;