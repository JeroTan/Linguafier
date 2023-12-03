import { useEffect, useState } from "react"

export default (Option)=>{
    //0 = Only 1 Path Color; 1 = ViewBox Is Different; 2 = Custom Path inside SVG; 3 = All custom
    const iconList = {
        'person':[0, "M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z" ],
        'close':[1, {d:"M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z",viewBox:"0 0 1024 1024"}],
    }
    // Store the Icon Data from icons parameter; Check if use state or not
    let iconData;
    if(useState.isPrototypeOf(Option.IconName)){
        iconData = iconList[Option.IconName[0]];
    }else{
        iconData = iconList[Option.IconName];
    }

    //** Functionality */
    //Create a function that will templated the svg format
    const svgFrame = (frame, content)=>{
        switch(frame){
            case 0:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox="0 0 24 24"><path className={Option.InClass} d={content}></path></svg></>
            break;
            case 1:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox={content.viewBox}><path className={Option.InClass} d={content.d}></path></svg></>
            break;
            case 2:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox={content.viewBox}>{content.d}</svg></>
            break;
            case 3:
                return <>{content}</>
            break;
        };
    };

    //** RETURN */
    return <>
        <div className={Option.OutClass ?? "w-4 h-4"} ref={Option.Ref ? Option.Ref : undefined}>
            {svgFrame( iconData[0], iconData[1] )}
        </div>
    </>
}
