import React, { useEffect, useState } from "react";
import { Modal, List, Avatar, Typography, Radio, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { usePopups } from "../../../store/usePopups";
import { Popups } from "../../../utils/popups";
import { useQuery } from '@tanstack/react-query';
import { getOrganizations } from "@/requests/Organization/OrganizationRequests";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from 'react-router-dom';

const SelectOrganizationPopup: React.FC = () => {

    const { activePopup, setActivePopup } = usePopups()
    const [ selectedId, setSelectedId] = useState<number | null>(null);
    const { accessToken } = useAuth()
    const navigate = useNavigate()

    const visible = activePopup == Popups.POPUP_ORG_SELECT

    const { data: organizations = [] } = useQuery({
        queryKey: ['organizations'],
        queryFn: async () => await getOrganizations(accessToken as string),
        enabled: !!accessToken,
    })

    useEffect(()=>{
        if(organizations.length == 1){
            navigate(`/organization/${organizations[0].id}`)
            setActivePopup()
        }
    },[organizations])

    React.useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [visible]);

    return (
        <Modal
            open={visible}
            footer={null}
            closable={false}
            width="100vw"
            className="!top-0 !left-0 !right-0 !bottom-0 !p-0 !max-w-screen !m-0"
            styles={{
                body: {
                    padding: 0,
                    borderRadius: 0,
                    height: "100vh",
                    width: "100vw",
                    maxWidth: "100vw",
                    background: "#fff",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                },
                mask: {
                    background: "#fff"
                }
            }}
            wrapClassName="full-screen-modal"
            modalRender={(node) => (
                <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen overflow-hidden bg-white z-[1000]">
                    {node}
                </div>
            )}
        >
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="px-2.5 pt-6 relative flex-shrink-0">
                    <Button
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => setActivePopup()}
                        className="!absolute right-2.5 top-4 !shadow-md !bg-white !border-none z-[2]"
                    />
                    <Typography.Title level={2} className="!my-4 !mt-6 !font-bold !text-[28px]">
                        Рабочие места
                    </Typography.Title>
                </div>
                <div className="flex-1 overflow-auto px-2.5">
                    <Radio.Group
                        value={selectedId}
                        size="middle"
                        onChange={e => setSelectedId(e.target.value)}
                        className="w-full"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={organizations}
                            renderItem={item => (
                                <List.Item
                                    className={`flex items-center gap-3 py-4 px-0 border-b border-gray-100 cursor-pointer ${selectedId === item.id ? "bg-gray-50" : "bg-white"
                                        }`}
                                    onClick={() => setSelectedId(item.id)}
                                >
                                    <Avatar src={item.avatar} size={44} className="flex-shrink-0" />
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-[500]! text-lg text-gray-900">{item.name}</span>
                                        {item.address && (
                                            <span className="text-gray-400 text-sm">{item.address}</span>
                                        )}
                                    </div>
                                    <Radio value={item.id} className="flex-shrink-0 custom-radio" />
                                </List.Item>
                            )}
                        />
                    </Radio.Group>
                    <div className="p-4">
                        <Button
                            type="primary"
                            block
                            disabled={selectedId === null}
                            onClick={() => {
                                if (selectedId == null) return
                                navigate(`/organization/${selectedId}`)
                                setActivePopup(null)
                            }}
                        >
                            Выбрать
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SelectOrganizationPopup;