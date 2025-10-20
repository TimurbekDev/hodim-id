import { Button } from "@/components/ui"
import { getMe } from "@/requests/getMe"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

const ProfilePage = () => {

    const { userId } = useParams()

    const { data:user,isLoading } = useQuery({
        queryKey:['getMe'],
        queryFn: async () => await getMe()
    })
     
    return <div>
        Profile Page : {userId} {user?.name}
        {isLoading && "Loading "}
        <Button className="bg-red!">Hello</Button>
    </div>
}
export default ProfilePage