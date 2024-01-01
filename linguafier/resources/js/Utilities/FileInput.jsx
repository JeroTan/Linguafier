import { useRef, useState, useEffect, useMemo, useCallback } from "react";

//UTILTIES
import Icon from "./Icon";
import Pop from "./Pop";

export default function FIleInput(Option){
    //** STRUCT */
    let Handler = Option.Handler;
    let StateColor = 'black'
    let Progress = Option.Progress;
    let Size = Option.Size ?? 100;
    let Accept = Option.Accept ?? "image/*";
    let ErrorBag = Option.Error ?? '';
    let Dynamic = Option.Dynamic ?? false;

    // console.log(Option.Preview);
    // console.log(Handler[0]);

    //**>> Helper */
    const intergerCheckUp = useCallback((str)=>{
        return !isNaN(parseInt(str, 10)) && /^\d+$/.test(str);
    }, []);
    const e_domainExpansion = useCallback((energy, limitless, voided)=>{// Traverse through depth by 1 or infinitely;
        // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
        // energy - the Full Object/Array; Limitless is the array to traverse; Voided is the value to insert at the end of limitless;
        if(limitless.length < 1){
            return voided;
        }
        if(energy === null || energy === undefined){
            if(intergerCheckUp(limitless[0])){
                energy = [];
            }else{
                energy = {};
            }
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
    //**<< Helper */


    //** STYLE */
    let UploadStyle = {
        width:Size+"px",
    }

    //** Use State */
    const [d_prevFile, e_prevFile] = Option.Preview ?? useState(Dynamic === false ? undefined : e_domainExpansion(undefined, Dynamic.split('.'), undefined));
    const [c_popSwitch, e_popSwitch] =  useState(false);

    //** Use Ref */
    const inputRef = useRef();

    //** Functionality */

    const HandlerFixed = useMemo(()=>{
        if(Dynamic === false)
            return Handler[0];
        return v_domainExpansion(Handler[0], Dynamic.split('.'));
    }, [Dynamic, Handler[0]]);
    const PreviewFixed = useMemo(()=>{
        // console.log(d_prevFile);
        if(Dynamic === false)
            return d_prevFile;
        return v_domainExpansion(d_prevFile, Dynamic.split('.'));
    }, [d_prevFile]);
    function UploadDesign(){
        return <div className={`aspect-square rounded outline outline-1 outline-${StateColor} outline-offset-0 shadow-myBox3 cursor-pointer bg-my-green hover:outline-4 hover:brightness-105 border-2 border-slate-700 border-dashed  flex flex-col justify-center items-center  delay-75`}
            onClick={()=>{
                inputRef.current.click();
            }}
            style={UploadStyle}
            >
            <Icon Name="upload" OutClass="w-8 h-8" InClass="fill-slate-100"></Icon>
            <h6 className="text-slate-100 font-semibold">Upload</h6>
        </div>
    }
    function PreviewDesign(){
        return <div className={`group relative aspect-square rounded outline outline-1 outline-${StateColor} hover:outline-slate-800 hover:outline-4 outline-offset-0 shadow-myBox3 bg-my-light cursor-pointer delay-75`}
        style={UploadStyle} >
            <div className="w-full h-full absolute break-words delay-75 opacity-0 group-hover:opacity-100 text-slate-500 overflow-hidden">
                { HandlerFixed.name.length < Size*.25 ? HandlerFixed.name : HandlerFixed.name.slice(0, Size*.25)+"..." }
            </div>
            <div className="w-full h-full absolute flex justify-center items-center delay-75 opacity-0 group-hover:opacity-100 overflow-hidden" >
                <Icon Name="eye" OutClass="w-10 h-10" InClass="fill-my-green" />
            </div>
            <div className="absolute rounded opacity-25 group-hover:opacity-100 delay-75 hover:drop-shadow-myDrop1" style={{left:`${Size-2}px`, bottom:`${Size}px`}} onClick={()=>{
                if(Dynamic === false){
                    Handler[1]("");
                    e_prevFile("");
                }else{
                    Handler[1](prev=>{
                        return structuredClone(e_domainExpansion(prev, Dynamic.split('.'), ""));
                    });
                    e_prevFile(prev=>{
                        prev = structuredClone(prev);
                        return e_domainExpansion(prev, Dynamic.split('.'), "");
                    });
                }

            }}>
                <Icon Name="close" OutClass={`w-5 h-5`} />
            </div>
            <img className="w-full h-full object-cover group-hover:opacity-20 delay-75" src={PreviewFixed ? PreviewFixed: "#"} onClick={()=>{
                e_popSwitch(true);
            }}/>
        </div>
    }
    function PopUpDesign(){
        return <div className="relative h-full w-fit mt-3">
            <img className="w-full h-full object-contain" src={PreviewFixed} />
        </div>
    }


    //** RENDER */
    return <div>
        { HandlerFixed && PreviewFixed ? PreviewDesign() : UploadDesign() }
        <input ref={inputRef} type="file" className={`hidden`}  onChange={(event)=>{

            if(Dynamic === false){
                Handler[1](event.target.files[0]);
                e_prevFile(URL.createObjectURL(event.target.files[0]));
            }else{

                Handler[1](prev=>{
                    return structuredClone(e_domainExpansion(prev, Dynamic.split('.'), event.target.files[0]));
                });
                e_prevFile( prev=>{
                    prev = structuredClone(prev);
                    return  e_domainExpansion(prev, Dynamic.split('.'), URL.createObjectURL(event.target.files[0]));
                } );
            }
        }} accept={Accept} />
        {
            ErrorBag ?
            <div>
                <small className='font-light text-red-500'>{ErrorBag}</small>
            </div>
            : ''
        }
        <Pop Switch={[c_popSwitch, e_popSwitch]} BlankPlate={PopUpDesign()} Width={`fit-content`} />
    </div>
}
