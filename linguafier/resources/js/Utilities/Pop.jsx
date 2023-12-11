// REACT
import { useRef, useEffect } from "react";

// UTILITIES
import Icon from './Icon';
import Button from './Button';


export default function Pop(Option){
    //** STRUCT */
    let Title = Option.Title;
    let Message = Option.Message;
    let popButton = Option.Button ?? "";
    let Handle = Option.Handle;

    let popTypeList = {
        success:{
            icon:"check",
            color:"my-green",
        },
        error:{
            icon:"cross",
            color:"red-500",
        },
        warning:{
            icon:"warning",
            color:"yellow-500",
        },
        notice:{
            icon:"i",
            color:"sky-400",
        },
        none:{
            icon:false,
            color:"black",
        }
    };
    let popTypePick = popTypeList[Option.Type ? Option.Type : 'none'];
    let popIcon = Option.Icon ?? popTypePick.icon;
    let s_Color = Option.Color ?? popTypePick.color;
    let s_Width = Option.Width ?? "34rem";


    //** Use Ref */
    const popId = useRef();

    //** Use Effect */
    //This will turn off and on the popup
    useEffect(()=>{
        if(Handle[0] == true){ //Check if the state of PopUP
            popId.current.showModal(); //Activate by using showMadal();
        }else{
            popId.current.close(); //Activate Close if not true anymore;
        }
    }, [Handle[0]]);

    //Design of UI
    const dialogStyling = {
        width: s_Width,
    }

    //** Functionality */
    function close(){
        Handle[1](false);
    }

    //This will return the ui of modal pop up
    return <>
        <dialog ref={popId} className='backdrop:backdrop-blur-sm backdrop:brightness-[.35] backdrop:contrast-75 p-5 drop-shadow-myDrop3' style={dialogStyling}>
            <div className="flex justify-end ">
                <div className="cursor-pointer pl-2" onClick={close}>
                    <Icon InClass={`fill-black`} OutClass="w-5 h-5" Name="close" />
                </div>
            </div>
            {
                popIcon ?
                <div className="flex justify-center">
                    <div>
                        <Icon InClass={`fill-${s_Color}`} OutClass="w-32 h-32 " Name={popIcon} />
                    </div>
                </div>
                : ''
            }

            <h2 className={`text-4xl text-center text-${s_Color}`}>{Title} </h2>
            <p className="mb-10 text-center">{Message}</p>
            <div className="flex flex-wrap md:gap-4 gap-2 justify-center">
            {
                popButton ?
                popButton.map((x, i)=>{
                    let buttonFunction = x.Func;
                    if(buttonFunction === 'close')
                        buttonFunction = close;
                    return <Button key={i} Type="button" Color={x.Color ?? undefined} Click={buttonFunction}  Name={x.Name} />
                }) :
                ''
            }
            </div>
        </dialog>
    </>
}
