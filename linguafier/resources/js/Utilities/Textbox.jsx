import { useEffect, useRef, useState } from "react";

export default function Textbox(Option){
    //

    let type = Option.Type ?? "text" ;
    let padding = Option.Padding ?? "py-1 px-4";
    let size = Option.Size ?? "";
    let handler = Option.Handle;
    let placeholder = Option.Placeholder ?? '';
    let bgcolor = Option.Color ?? '';
    let stateColor = 'black'
    let errorBag = Option.Error ?? '';


    //** Functionality */
    function changeState(event){
        handler[1](event.target.value);
    }
    if(errorBag){
        stateColor = 'red-400';
    }else{
        stateColor = 'black';
    }

    return <>
        <input
            type={type}
            className={`${padding} ${size} rounded outline outline-1 outline-${stateColor} outline-offset-0 shadow-myBox3 shadow-${stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${stateColor}/80  placeholder:font-light ${bgcolor} max-w-full shrink`}
            onChange={changeState}
            placeholder={placeholder}
        />
        {
            errorBag ?
            <div>
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }

    </>

}
