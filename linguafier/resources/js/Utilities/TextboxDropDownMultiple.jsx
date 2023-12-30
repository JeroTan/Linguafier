// UTILITIES
import Icon from "./Icon";


// HOOKS
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { router } from "@inertiajs/react";

// ExtraFunction
function SelectPlate({data, index, removal, handler, open, withRef, textField, dynamic}){
    //** Use Ref */
    let plateRef = useRef();

    return <div tabIndex={0} ref={plateRef} className={`relative rounded bg-my-green90 ${"p-1"} tex-slate-100 group delay-75 hover:brightness-105`}>
        <h6 className={`text-white`}>{withRef ? data.name : data}</h6>

        {open ? <div className="absolute rounded hover:shadow shadow-white delay-75 cursor-pointer hover:drop-shadow-myDrop1 z-10" style={{right:`${0}px`, top:`${0}px`}} onClick={()=>{
            removal(index);
        }}>
            <Icon Name="close" OutClass={`w-2 h-2`} InClass={'fill-white'} />
        </div>
        : ""}

    </div>
}

//** MAIN */
export default function TextboxDropDownMultiple(Option){
    //** STRUCT */
    let padding = Option.Padding ?? "py-1 px-4";
    let size = Option.Size ?? "";
    let handler = Option.Handle;
    let placeholder = Option.Placeholder ?? '';
    let bgcolor = Option.Color ?? '';
    let errorBag = Option.Error ?? '';
    let pressFunc = Option.PressFunc ?? (()=>true);
    let dropTouch = Option.DropTouch ?? true;
    let selectSkip = Option.SelectSkip ?? false; //Select the closest data when move to other tab;
    let dropData = Option.DropData ?? false;
    let siteVisit = Option.Request ?? "#";
    let siteData = Option.RequestKey ?? "v_search";
    let withRef = Option.WithRef ?? false;
    let allowInputSelect = Option.AllowInputSelect ?? false;
    let allowRepeat = Option.AllowRepeat ?? false;
    let dynamic = Option.Dynamic ?? false;

    //*** USE STATE */
    const [v_inputText, e_inputText] = useState("");

    const [c_containerSize, s_containerSize] = useState([0,0]);
    const [c_textBox, s_textBox] = useState(undefined);
    const [c_dropBox, s_dropBox] = useState(false); //Use to tell if dropdown should be shown in the bottom of selection box
    const [c_stateColor, s_stateColor] = useState('black');

    //*** USE REF */
    const textField = useRef();

    //** USE EFFECT */
    useEffect(()=>{

    }, [c_textBox])
    useEffect(()=>{
        if(errorBag){
            s_stateColor('red-400');
        }else{
            s_stateColor('black');
        }
    }, [errorBag]);


    //** Functionality */
    const e_domainExpansion = useCallback((energy, limitless, voided)=>{// Traverse through depth by 1 or infinitely;
        // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
        // energy - the Full Object/Array; Limitless is the array to traverse; Voided is the value to insert at the end of limitless;
        if(limitless.length < 1){
            return voided;
        }
        //-------------------------------------Traverse Next Arr/Obj---Reduce the limitless by 1----ValueNeededToInsert
        energy[limitless[0]] = e_domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || [], voided);
        return energy;
    }, []);
    const v_domainExpansion = useCallback((energy, limitless)=>{// Traverse through depth by 1 or infinitely;
        // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
        // energy - the Full Object/Array; Limitless is the array to traverse;
        if(limitless.length == 1){
            return energy[limitless[0]]
        }
        //----------------Traverse Next Arr/Obj---Reduce the limitless by 1----
        v_domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || []);
        return energy;
    }, []);
    let handlerFixed = useMemo(()=>{ //Use This to get the handler[0] of the the with combination of dynamic
        if(!dynamic)
            return handler[0];
        return v_domainExpansion(handler[0], dynamic.split('.'));
    }, [dynamic, handler[0], handler]);
    function changeState(event){ //Check the site and try to input the data to Handler
        e_inputText(event.target.value)
        s_dropBox(true);
        requestDropData(event.target.value);//Send Request
    }
    function selectDropDown(data){ // USE TO SELECT FROM DROPDOWN; Unlike with the other textbox drop down, this one will not close the textbox and dropbox
        if(!dynamic){
            handler[1](prev=>{
                prev[prev.length] = withRef ? data : data.name;
                return structuredClone(prev);
            });
        }else{
            handler[1](prev=>{
                let finalEnd = v_domainExpansion(prev, dynamic.split('.'));
                finalEnd[finalEnd.length] = withRef ? data : data.name;
                return structuredClone(e_domainExpansion(prev, dynamic.split('.'), finalEnd));
            });
        }
        e_inputText("");
        textField.current.focus();
    }
    function removeSelected(index){
        handler[1](prev=>{
            let newData = [];
            if(!dynamic){
                for(let i = 0; i < prev.length; i++){
                    if(index == i)
                        continue;
                    newData[newData.length] = prev[i];
                }
                return newData;
            }
            let finalEnd = v_domainExpansion(prev, dynamic.split('.'));
            for(let i = 0; i < finalEnd.length; i++){
                if(index == i)
                    continue;
                newData[newData.length] = finalEnd[i];
            }
            return structuredClone(e_domainExpansion(prev, dynamic.split('.'), newData));
        });
        textField.current.focus();
    }
    const filterDropIfEver = useCallback(()=>{
        return dropData.filter((x, i)=>{
            if(allowRepeat || handlerFixed.length <= 0)
                return true;
            if(withRef){
                return !handlerFixed.some((y, j)=>{
                    return x.id == y.id;
                });
            }
            else{
                return !handlerFixed.some((y, j)=>{
                    return x.name ==  y;
                });
            }
        });
    }, [handlerFixed, handlerFixed.length, dropData, allowRepeat, withRef]);
    function requestDropData(search){
        let siteDataContainer = {};
        siteDataContainer[siteData] = search;
        router.post(siteVisit, siteDataContainer);//Send Request
    }

    //** RENDER */
    return <>
    <div tabIndex={0} className={`relative ${size}`}
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
                selectDropDown(dropData[0]);
            }
            s_textBox(false);
            s_dropBox(false);
            e_inputText("");
        }}

        >
        <div
            className={`${padding}  rounded outline outline-1 outline-${c_stateColor} outline-offset-0 shadow-myBox3 shadow-${c_stateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${c_stateColor}/80 ${bgcolor} flex flex-wrap gap-y-1 gap-x-2 shrink ${c_textBox ? "" :"cursor-pointer hover:outline-4 bg-gray-300"}`}

        >

            { handlerFixed.map((x, i)=>{ //Add Selected Data Here
                return <Fragment key={i}>
                    <SelectPlate data={x} index={i} removal={removeSelected} handler={handler} open={c_textBox} withRef={withRef} textField={textField} dynamic={dynamic} />
                </Fragment>
            }) }

            <div className="flex">
            <input
                ref={textField}
                type={`text`}
                className={` shrink w-full grow-0 outline-none focus:outline-none bg-white/0 placeholder:font-light placeholder:text-zinc-400 ${c_textBox ? "" :"cursor-pointer"}`}
                onChange={changeState}
                onKeyDown={(event)=>{
                    pressFunc(event);
                    if (event.key === 'Enter') {
                        if(allowInputSelect && !withRef && event.target.value){
                            selectDropDown({name:event.target.value});
                        }else{
                            if(allowRepeat)
                            selectDropDown(dropData[0]);
                            else if(!allowRepeat && filterDropIfEver().length >= 1)
                            selectDropDown(filterDropIfEver()[0]);
                        }
                    };
                    if( (event.key === "Backspace" || event.key === "Delete") && v_inputText.length < 1 && handlerFixed.length > 0 ){
                        //IF User backspace and the input length of this textbox is already none then delete the latest node
                        removeSelected(handlerFixed.length-1);
                    }
                }}
                placeholder={handlerFixed.length > 0 ? "|" : placeholder}
                value={v_inputText}
                readOnly={!c_textBox}
            />
            </div>

        </div>
        {
            errorBag ?
            <div>
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }

        { c_dropBox && dropData.length > 0 && filterDropIfEver().length > 0 ? <div tabIndex={0} className="absolute z-20 rounded border border-slate-700 border-t-4 bg-my-light min-w-[25rem] max-h-96 overflow-y-auto custom_scroll_2 flex flex-col gap-2"  style={{bottom:-4, transform: `translateY(100%)`}} >
            { filterDropIfEver().map((x, i)=>{
                return <div key={i} className=" p-2 cursor-pointer border-b-2 border-slate-500 hover:bg-slate-700 hover:text-white" onClick={()=>{selectDropDown(x)}}>
                    {x.name}
                </div>
            }) }
            </div> : ""
        }

    </div>


    </>

}
