import { Button } from "@/components/ui"
import React from "react"

const ExportTableButton: React.FC = () =>{
    return(
        <Button className="w-35 !h-11 !bg-white !border-0 rounded-full drop-shadow-sm">
            <p className="text-[15px] text-black font-medium">Экспорт табеля</p>
        </Button>
    )
}

export default ExportTableButton;