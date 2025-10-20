import { Button } from "../Button";
import personAdd from "@/assets/icons/Person Add.svg";

const ClientAddButton: React.FC =()=>{
    return(
        <Button
            className="rounded-full !border-0 !p-0 !bg-white drop-shadow-sm w-11 !h-11 flex items-center justify-center"
        
        >
            <img src={personAdd} alt="person" width={24} height={24}/>    
        </Button>        
    )
}
export default ClientAddButton;