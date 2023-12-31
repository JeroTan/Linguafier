// UTILITIES
import Pop from "./Pop"

// HOOKS
import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react";

export default (Option)=>{
    //** STRUCT */
    let popButton = Option.Button;
    let CloseFunc = Option.CloseFunc;

    //** Use Page */
    const { popFlash } = usePage().props;

    //** Use State */
    const [ v_switch, e_switch ] = Option.Switch ?? useState(false);
    const [ v_flashData, e_flashData] = useState({
        popType:'none',
        Title:"",
        Message:"",
        Button:popButton[Object.keys(popButton)[0]],
    });

    //** Use Effect */
    useEffect(()=>{
        if(popFlash){
            e_flashData({
                Title:popFlash.Title,
                Message:popFlash.Message,
                Button:popButton[popFlash.Pick?? Object.keys(popButton)[0]],
                popType:popFlash.Type,
            })
            e_switch(1);
        }
    }, [popFlash]);

    return <Pop Switch={[ v_switch, e_switch ]} Pick={0} Content={ {0:v_flashData} } Type={v_flashData.popType} CloseFunc={CloseFunc}/>
}
