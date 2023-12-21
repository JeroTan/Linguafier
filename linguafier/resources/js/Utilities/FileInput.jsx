import { useRef, useState } from "react";

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
    let errorBag = Option.Error ?? '';


    //** STYLE */
    let UploadStyle = {
        width:Size+"px",
    }


    //** Use State */
    const [d_prevFile, e_prevFile] = Option.Preview ?? useState(false);
    const [c_popSwitch, e_popSwitch] =  useState(false);

    //** Use Ref */
    const inputRef = useRef();

    //** Functionality */
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
                { Handler[0].name.length < Size*.25 ? Handler[0].name : Handler[0].name.slice(0, Size*.25)+"..." }
            </div>
            <div className="w-full h-full absolute flex justify-center items-center delay-75 opacity-0 group-hover:opacity-100 overflow-hidden" >
                <Icon Name="eye" OutClass="w-10 h-10" InClass="fill-my-green" />
            </div>
            <div className="absolute rounded opacity-25 group-hover:opacity-100 delay-75 hover:drop-shadow-myDrop1" style={{left:`${Size-2}px`, bottom:`${Size}px`}} onClick={()=>{
                Handler[1]("");
                e_prevFile("");
            }}>
                <Icon Name="close" OutClass={`w-5 h-5`} />
            </div>
            <img className="w-full h-full object-cover group-hover:opacity-20 delay-75" src={d_prevFile ?? "#"} onClick={()=>{
                e_popSwitch(true);
            }}/>
        </div>
    }

    function PopUpDesign(){
        return <div className="relative h-full w-fit mt-3">
            <img className="w-full h-full object-contain" src={d_prevFile} />
        </div>
    }

    return <div>
        { Handler[0] && d_prevFile ? PreviewDesign() : UploadDesign() }
        <input ref={inputRef} type="file" className={`hidden`}  onChange={(event)=>{
            Handler[1](event.target.files[0]);
            e_prevFile(URL.createObjectURL(event.target.files[0]));
        }} accept={Accept} />
        {
            errorBag ?
            <div>
                <small className='font-light text-red-500'>{errorBag}</small>
            </div>
            : ''
        }
        <Pop Switch={[c_popSwitch, e_popSwitch]} BlankPlate={PopUpDesign()} Width={`fit-content`} />
    </div>
}
