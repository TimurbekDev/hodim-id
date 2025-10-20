import { useAuth } from "@/hooks/useAuth";
import { getClients } from "@/requests/getClients";
import { useQuery } from "@tanstack/react-query";
import { Card, List, Avatar } from "antd"
// import { useState } from "react";


const ClientBody: React.FC = () => {
    // const [, setSelectedId] = useState<number | null>(null)
    const { accessToken } = useAuth()

    const {data: clients = []} = useQuery({
        queryKey: ['getClients'],
        queryFn: async () => await getClients(accessToken as string),
        enabled: !!accessToken,
    })
    
    return(
        <Card className="home-card w-full !border-0 h-full overflow-y-auto" style={{
            scrollbarWidth: "none"
        }}>
              <List
                    className={`flex flex-col justify-between !border-0 h-full`}
                    itemLayout='horizontal'
                    dataSource={clients.flatMap((item) => [item, { ...item, id: `${item.id}-copy1` }, {...item, id: `${item.id}-copy2` }])}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            // onClick={() => setSelectedId(item.id)}
                            className='!border-top-1'
                            >
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 border-0 rounded-full p-0 m-0">
                                        <img src={item.image_url} className="w-10 h-10 rounded-full object-cover"/>
                                    </div>
                                    <div className="">
                                        <p>{item.full_name}</p>
                                        <p className="text-gray-400">{item.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">Вовремя</p>
                                    <div className="rounded-full bg-green-500 w-2 h-2" />
                                </div>
                            </List.Item>
                    )}
                    >
            </List>
        </Card>
    )
}

export default ClientBody;
