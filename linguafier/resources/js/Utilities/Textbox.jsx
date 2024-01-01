import { useCallback, useEffect, useRef, useState } from "react";

export default function Textbox(Option){
    //** Struct */
    let type = Option.Type ?? "text" ;
    let padding = Option.Padding ?? "py-1 px-4";
    let size = Option.Size ?? "";
    let handler = Option.Handle;
    let placeholder = Option.Placeholder ?? '';
    let bgcolor = Option.Color ?? '';
    let errorBag = Option.Error ?? '';
    let pressFunc = Option.PressFunc ?? 'noEnter';
    let minmax = Option.MinMax ?? [undefined, undefined];
    let dynamic = Option.Dynamic ?? false;

    //** Use State */
    const [c_stateColor, e_stateColor] = useState('black');


    //** Use Effect */
    useEffect(()=>{
        if(errorBag){
            e_stateColor('red-400');
        }else{
            e_stateColor('black');
        }
    }, [errorBag]);

    //** Functionality */
    function changeState(event){
        if(dynamic === false){
            handler[1](event.target.value);
            return true;
        }
        function domainExpansion(energy, limitless, voided){ // Traverse through depth by 1 or infinitely;
            // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY BE CAREFUl
            //energy is the Full Object; limitless is the array to traverse; voided is the value to insert
            if(limitless.length < 1){
                return voided;
            }
            energy[limitless[0]] = domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || [], voided);
            return energy;
        }
        handler[1]((prev)=>{
            let restructPrev = structuredClone(prev);
            restructPrev = domainExpansion( restructPrev, dynamic.split("."), event.target.value );
            return restructPrev;
        });

    }

    const valueHandler = useCallback(()=>{
        if(dynamic === false)
            return handler[0];

        function domainExpansion(energy, limitless){ // Traverse through depth by 1 or infinitely;
            //energy is the Full Object; limitless is the array to traverse
            if(limitless.length == 1){
                return energy[limitless[0]];
            }
            return domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) );
        }

        return domainExpansion(handler[0], dynamic.split("."));
    }, (Option.Handle));

    return <div className={`${size} inline-block`}>
        <input
            type={type}
            className={`${padding} rounded outline outline-1 outline-${c_stateColor} outline-offset-0 shadow-myBox3 shadow-${c_stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${c_stateColor}/80  placeholder:font-light ${bgcolor} w-full`}
            onChange={changeState}
            onKeyDown={(event)=>{
                if(typeof pressFunc === "function" ){
                    pressFunc(event);
                    return true;
                }
                switch(pressFunc){
                    case 'noEnter':{
                        if(event.key == 'Enter'){
                            event.preventDefault();
                        }
                    break;}
                    default:{

                    }
                }



            }}
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
