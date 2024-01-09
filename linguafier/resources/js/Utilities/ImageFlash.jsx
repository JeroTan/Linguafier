// UTilities
import PopContainer from "./Pop";
import Icon from "./Icon";

// HOOKS
import { useState } from "react";

export default function ImageFlash(Option){
    //** STRUCT */
    let Src = Option.Src ?? "#";

    let Size = Option.Size ?? "5rem";
    let Outline = Option.Outline ?? false;
    let Active = Option.Active ?? false;
    let Ratio = Option.Ratio ?? "1/1";
    let Fit = Option.Fit ?? "cover";
    let Pop = Option.Pop ?? false;
    let Border = Option.Border ?? false;
    let Round = Option.Round ?? "rounded"



    //** Use State */
    const [c_popSwitch, e_popSwitch] =  useState(false);

    //** Functionality */
    function PopUpDesign(){
        return <div className="relative h-full w-fit mt-3">
            <img className="w-full h-full object-contain" src={Src} />
        </div>
    }

    return <>
        <div className={`relative ${Outline?"outline":""} ${Active?"hover:outline-4 cursor-pointer delay-75":""} group ${Round} ${Border ? 'border-2' : ""} relative overflow-hidden`}
        style={{outlineColor: ((Outline!==true&&Outline!==false)?Outline:'#AAAAAA'), outlineWidth:"2px", width: Size, aspectRatio: Ratio}}>
            {
                Pop ?<div className="w-full h-full absolute flex justify-center items-center delay-75 opacity-0 group-hover:opacity-100 overflow-hidden" >
                    <Icon Name="eye" OutClass="w-10 h-10" InClass="fill-my-green" />
                </div> :""
            }
            <img className={`relative w-full h-full object-cover ${Pop?"group-hover:opacity-20 delay-75":""}`} src={Src} style={{objectFit:Fit}} onClick={()=>{
                if(Pop)
                    e_popSwitch(true);
            }} />
            {
                Pop ? <PopContainer Switch={[c_popSwitch, e_popSwitch]} BlankPlate={ PopUpDesign() } Width={`fit-content`} /> : <></>
            }
        </div>

    </>
}
