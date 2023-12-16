import { useEffect, useRef, useState } from "react";

export default function TextboxDropDown(Option){
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

    //*** USE STATE */
    const [c_openBox, s_openBox] = useState(true);


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
    <div className="relative">

        <input
            type={type}
            className={`${padding} ${size} rounded outline outline-1 outline-${stateColor} outline-offset-0 shadow-myBox3 shadow-${stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${stateColor}/80  placeholder:font-light ${bgcolor} max-w-full shrink ${c_openBox ? "cursor-pointer hover:outline-4 bg-gray-300" :""}`}
            onChange={changeState}
            onKeyDown={pressFunc}
            placeholder={placeholder}
            value={handler[0]}
            readOnly={c_openBox}
            onFocus={()=>{
                s_openBox(undefined);
            }}
            onBlur={()=>{
                s_openBox(true);
            }}
        />
        {
            errorBag ?
            <div>
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }
        <div className="absolute top-[36px] rounded border border-slate-700 border-t-4 bg-my-light min-w-[25rem] max-h-96 overflow-y-auto custom_scroll_2 flex flex-col gap-2">
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
            <div className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white">
            HELLO
            </div>
        </div>
    </div>


    </>

}
