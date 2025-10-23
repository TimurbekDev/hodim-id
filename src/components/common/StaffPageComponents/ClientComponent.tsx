import React from "react"
import { List, Avatar } from "antd";
import type { ClientItem } from "@/types/client";


interface UserListProps{
    items: ClientItem[];
    onUserClick?: (id:number) => void;
}

const ClientComponent: React.FC<UserListProps> = ({items, onUserClick}) => {

    const getStatusBadge = (status?: number | null) => {
        switch (status) {
            case 1: 
                return (
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Вовремя</p>
                        <div className="rounded-full w-3 h-3 bg-green-400"></div>
                    </div>
                );
            case 2: 
                return (
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Опоздание</p>
                        <div className="rounded-full w-3 h-3 bg-yellow-400"></div>
                    </div>
                );
            case 20: 
                return (
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Пропуск</p>
                        <div className="rounded-full w-3 h-3 bg-red-400"></div>
                    </div>
                );
            default:
            return null;
        }
    };

    console.log(items)

    return(
        <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item) => (
                <List.Item
                    onClick={() => onUserClick?.(item.id)}
                    className="cursor-pointer w-full h-16 hover:bg-gray-50 rounded-lg !m-0 !p-0 transition-all">
                    <List.Item.Meta
                        className="!m-0 !flex !items-center justify-center"
                        avatar={
                            <Avatar 
                                size={40} 
                                style={{backgroundColor:"#87d068"}}>
                                {item.full_name?.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                            title={<p className="font-medium">{item.full_name}</p>}
                            description={`User ID: ${item.id}`}
                        />

                        {getStatusBadge(item.status)}
                </List.Item>
            )}>

        </List>
    )
}

export default ClientComponent;
