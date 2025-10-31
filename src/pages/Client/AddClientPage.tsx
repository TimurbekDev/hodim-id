import BackButton from "@/components/ui/BackButton"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { createClient, createOrgClient, getUserInfo } from "@/requests/Client/ClientReqeusts"
import type { EgovClientResponse } from "@/types/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, Spin, Select, message } from "antd"
import { useEffect, useState } from "react"
import type { ClientView } from "@/types/client"
import { useNavigate, useParams } from "react-router-dom"

const AddClientPage: React.FC = () => {
    const [pinfl, setPinfl] = useState("");
    const [position, setPosition] = useState("");
    const { orgId } = useParams()    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<EgovClientResponse | null>(null);
    const {accessToken } = useAuth();
    const [role, setRole] = useState<number>(0)

    const navigate = useNavigate();
    
    const parsedOrgId = orgId ? Number(orgId) : undefined
    const Roles = [
        { label: "BranchManager", value: 1 },
        { label: "Employee", value: 2}
    ]

    useEffect(() => {
        if (!pinfl.trim()) {
            setError(null);
            setUserInfo(null);
            return;
        }
        if (pinfl.length < 14) {
            setError(null);
            setUserInfo(null);
            return;
        }

        const timeout = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getUserInfo({
                    token: accessToken as string,
                    pinfl,
                });

                setUserInfo(data);
                setError(null);
            } catch (err: any) {
                setUserInfo(null);
                setError("Client not found or invalid PINFL");
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [pinfl, accessToken]);

 
    const queryClient = useQueryClient()

    const { mutate: createClientMutation, isPending: isCreating } = useMutation({
        mutationFn: (payload: ClientView) =>
            createClient({token: accessToken as string, payload}),
        
        onSuccess: async (createdClient) =>{
            await queryClient.invalidateQueries({queryKey: ["clients"]})
    
            await createOrgClient({
                token: accessToken as string,
                payload: {
                    user_id: createdClient.id,
                    org_user_role: role, 
                    organization_id: parsedOrgId as number,
                    position: position
                }
            })
            message.success("Client successfully created!");
            
            setTimeout(() => {
                navigate(-1); 
            }, 1000);
        },
        onError: (error: any) => {
            console.error("Failed to create client:", error)

            const errorMessage =
                Array.isArray(error?.response?.data?.errors)
                    ? error.response.data.errors.join(", ")
                    : error?.response?.data?.message || error?.message || "Unknown error";

            message.error(`${errorMessage}`);
        },
    })


    const handleAddClient = () => {
        if (!userInfo) {
            setError("No user info found, please enter the PINFL first")
            return;
        }

        const payload: ClientView = {
            full_name: userInfo.full_name,
            birth_date: userInfo.birth_date,
            pinfl: pinfl,
            password: pinfl,
            username: pinfl,
        }

         createClientMutation(payload);
    }


    return (
        <Spin spinning={isCreating} tip="Creating client...">
            <Card className="home-card w-full max-w-[520px] h-full rounded-3xl shadow-2xl border-none !p-4 overflow-hidden flex flex-col">
                <div className="flex flex-col gap-2 w-full h-full ">
                    <BackButton />
                    <div className="w-full !justify-center flex flex-col gap-2">
                        <input
                            value={pinfl}
                            onChange={(e) => setPinfl(e.target.value)}
                            className="w-full text-[17px] rounded-3xl h-14 bg-gray-100 py-2 px-4 focus:outline-none focus:ring-0" placeholder="enter the PINFL" />

                        {isLoading && (
                            <div className="flex items-center justify-center py-2">
                                <Spin size="small" />
                                <p className="ml-2 text-gray-500 text-sm">Fetching user info...</p>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm px-2">{error}</p>
                        )}

                        {userInfo && !error && (
                            <div className="flex flex-col gap-2 mt-2">
                                <input
                                    type="text"
                                    value={`${userInfo.full_name}`}
                                    className="w-full text-[17px] focus:outline-none focus:ring-0 rounded-3xl h-14 bg-gray-50 py-2 px-4 bg-gray-100 text-gray-500"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    value={userInfo.birth_date}
                                    className="w-full text-[17px] focus:outline-none focus:ring-0 rounded-3xl h-14 bg-gray-50 py-2 px-4 bg-gray-100 text-gray-500"
                                    readOnly
                                />
                                <input
                                    type="text"
                                    className="w-full text-[17px] focus:outline-none focus:ring-0 placeholder:text-gray-500 rounded-3xl h-14 bg-gray-50 py-2 px-4 bg-gray-100"
                                    placeholder="Position"
                                    onChange={(e) => setPosition(e.target.value)}
                                    required={true}
                                />
                                <Select
                                    className="w-full !h-14 !rounded-3xl"
                                    value={role || undefined}
                                    onChange={(value) => setRole(value)}
                                    options={Roles}
                                    size="large"
                                />
                            </div>
                        )}

                        <Button
                            className="w-full !h-14 mt-2"
                            onClick={handleAddClient}
                            disabled={isCreating || !userInfo}
                        >
                            {isCreating ? (
                                <p className="text-lg font-medium">Saving...</p>
                            ) : (
                                <p className="text-lg font-medium">Add</p>
                            )}
                        </Button>

                    </div>
                </div>
            </Card>
        </Spin>
    )

}

export default AddClientPage