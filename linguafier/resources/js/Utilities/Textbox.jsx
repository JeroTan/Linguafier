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
    let pressFunc = Option.PressFunc ?? (()=>true);
    let minmax = Option.MinMax ?? [undefined, undefined];
    let dynamic = Option.Dynamics ?? false;


    //** Functionality */
    function changeState(event){
        if(!dynamic){
            handler[1](event.target.value);
            return true;
        }
        function domainExpansion(energy, limitless, forge){ // Traverse through depth by 1 or infinitely;
            // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY BE CAREFUl
            //energy is the Full Object; limitless is the array to traverse; forge is the value to insert
            if(limitless.length < 1){
                return forge;
            }
            let newEnergy = energy[limitless[0]];
            let newLimit = [];
            limitless.forEach((x)=>{
                newLimit[newLimit.length] = x;
            })
            energy[limitless[0]] = domainExpansion(newEnergy, newLimit, forge);
            return energy;
        }
        handler[1]((prev)=>{
            let restructPrev = structuredClone(prev);
            restructPrev = domainExpansion( restructPrev, dynamic.split("."), event.target.value );
            return restructPrev;
        });

    }
    if(errorBag){
        stateColor = 'red-400';
    }else{
        stateColor = 'black';
    }
    function valueHandler(){
        if(!dynamic)
            return handler[0];

        function domainExpansion(energy, limitless){ // Traverse through depth by 1 or infinitely;
            //energy is the Full Object; limitless is the array to traverse
            if(limitless.length == 1){
                return energy[limitless[0]];
            }
            let newEnergy = energy[limitless[0]];
            let newLimit = [];
            limitless.forEach((x)=>{
                newLimit[newLimit.length] = x;
            })
            return domainExpansion(newEnergy, newLimit);
        }
        return domainExpansion(handler[0], dynamic.split("."));
    }

    return <div>
        <input
            type={type}
            className={`${padding} ${size} rounded outline outline-1 outline-${stateColor} outline-offset-0 shadow-myBox3 shadow-${stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${stateColor}/80  placeholder:font-light ${bgcolor} max-w-full shrink`}
            onChange={changeState}
            onKeyDown={pressFunc}
            placeholder={placeholder}
            value={valueHandler()}
            min={minmax[0]}
            max={minmax[1]}
        />
        {
            errorBag ?
            <div>
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }

    </div>

}
