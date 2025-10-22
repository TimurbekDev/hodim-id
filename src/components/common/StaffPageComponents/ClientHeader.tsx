import React, { useState } from "react";
import {Card} from "antd";
import BackButton from "../../ui/BackButton";
import ExportTableButton from "@/components/ui/ClientPageButtons/ExportTableButton";
import ClientAddButton from "@/components/ui/ClientPageButtons/ClientAddButton";
import FilterToggle from "@/components/ui/ClientPageButtons/FilterToggle";
import SearchInput from "@/components/ui/ClientPageButtons/SearchInput";

interface ClientHeaderProps {
    className?: string;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({className = ''}) => {

    const [filter, setFilter] = useState<'vse' | 'naRabote' | 'nePriwel'>('vse');

    return(
        <Card className={`!border-0 ${className}`}>
            <div className="flex flex-col items-center justify-between w-full gap-4">
                <div className="flex w-full justify-between items-center">    
                    <BackButton/>
                    <div className="flex items-center gap-2">
                        <ExportTableButton/>
                        <ClientAddButton />
                    </div>
                </div>
                <FilterToggle 
                    onChange={(v) => setFilter(v)}
                    value={filter}
                />
                <SearchInput />
            </div>
        </Card>
    )
}

export default ClientHeader;
