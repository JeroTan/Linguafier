// UTILITIES
import Pop from "./Pop"

// HOOKS
import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react";

export default (Option)=>{
    //** STRUCT */
    let popButton = Option.Button;

    //** Use Page */
    const { popFlash } = usePage().props;

    //** Use State */
    const [ v_flash, e_flash ] = Option.Handle ?? useState(false);
    const [ v_flashData, e_flashData] = useState({
        popType:'none',
        popTitle:"",
        popMessage:"f",
    });

    //** Use Effect */
    useEffect(()=>{
        if(popFlash){
            e_flashData({
                popType:popFlash.Type,
                popTitle:popFlash.Title,
                popMessage:popFlash.Message,
            })
            e_flash(1);
        }

    }, [popFlash]);

    return <Pop Handle={[v_flash, e_flash]} Title={v_flashData.popTitle} Message={v_flashData.popMessage} Type={v_flashData.popType} Button={popButton} />
}
