import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import BackIcon from "@/assets/icons/back_button.svg";

interface BackButtonProps{
    to?: string;
    label?: string;
    className?: ""; 
}

const BackButton: React.FC<BackButtonProps> = ({to}) =>{
    const navigate = useNavigate();

    const handleClick = () => {
        if(to){
            navigate(to);
        }
        else{
            navigate(-1);
        }
    };

    return(
        <Button
            className="w-11 !h-11 !bg-white !border-0 !p-0 !m-0 drop-shadow-sm"
            onClick={handleClick}>
                <div className="w-6 h-6 flex items-center justify-center">
                    <img src={BackIcon} alt="No"/>
                </div>
        </Button>
    );
};

export default BackButton;