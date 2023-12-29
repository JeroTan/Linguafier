import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";

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
    let dropTouch = Option.DropTouch ?? true;
    let selectSkip = Option.SelectSkip ?? false;
    let dropData = Option.DropData ?? false;
    let siteVisit = Option.Request ?? "#";
    let siteData = Option.RequestKey ?? "v_search";
    let withRef = Option.withRef ?? false;

    //*** USE STATE */
    const [c_textBox, s_textBox] = useState(undefined);
    const [c_dropBox, s_dropBox] = useState(false);

    //*** USE REF */
    const textField = useRef();
    const dropField = useRef();

    //** USE EFFECT */
    useEffect(()=>{

    }, [c_textBox])


    //** Functionality */
    function changeState(event){ //Check the site and try to input the data to Handler
        handler[1](event.target.value);
        s_dropBox(true);
        requestDropData(event.target.value);//Send Request
    }
    if(errorBag){
        stateColor = 'red-400';
    }else{
        stateColor = 'black';
    }
    function selectDropDown(data){ // USE TO SELECT FROM DROPDOWN and once pick close all box and render textbox not editable
        if(withRef){
            handler[1](data);
        }else{
            handler[1](data.name);
        }
        textField.current.blur();
        s_dropBox(false);
        s_textBox(false);
    }
    function requestDropData(search){
        let siteDataContainer = {};
        siteDataContainer[siteData] = search;
        router.post(siteVisit, siteDataContainer);//Send Request
    }

    //** RENDER */
    return <>
    <div tabIndex={0} className={`relative flex flex-wrap ${size}`}
        onFocus={()=>{
            s_textBox(true);
            if(dropTouch)
                s_dropBox(true);
            textField.current.focus();
        }}
        onBlur={(event)=>{
            if(event.currentTarget.contains(event.relatedTarget)){
                return true;
            }
            if(selectSkip == true && dropData.length > 0){
                handler[1](dropData[0].name);
            }
            s_textBox(false);
            s_dropBox(false);
        }}
        >

        <input
            ref={textField}
            type={type}
            className={`${padding} w-full rounded outline outline-1 outline-${stateColor} outline-offset-0 shadow-myBox3 shadow-${stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${stateColor}/80  placeholder:font-light ${bgcolor} shrink grow-0 placeholder:text-zinc-400 ${c_textBox ? "" :"cursor-pointer hover:outline-4 bg-gray-300"}`}
            onChange={changeState}
            onKeyDown={(event)=>{
                pressFunc(event);
                if (event.key === 'Enter') {
                    if(dropData.length > 0){
                        selectDropDown(dropData[0]);
                    }else{
                        s_textBox(false);
                        s_dropBox(false);
                        textField.current.blur();
                    }
                }
            }}
            placeholder={placeholder}
            value={withRef ? handler[0].name : handler[0]}
            readOnly={!c_textBox}
        />
        {
            errorBag ?
            <div className="block">
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }

        { c_dropBox && dropData.length > 0 ? <div ref={dropField} tabIndex={0} className="absolute z-20 top-[36px] rounded border border-slate-700 border-t-4 bg-my-light min-w-[25rem] max-h-96 overflow-y-auto custom_scroll_2 flex flex-col gap-2" >
            { dropData.map((x, i)=>{
                return <div key={i} className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white" onClick={()=>{selectDropDown(x)}}>
                    {x.name}
                </div>
            }) }
            </div> : ""
        }

    </div>


    </>

}
