// REACT
import { useRef, useEffect, useState } from "react";

// UTILITIES
import Icon from './Icon';
import Button from './Button';
import Loading from "./Loading";


export default function PopLoading(Option){
    //** STRUCT */
    let Title = Option.Title;
    let Message = Option.Message ?? "Processing . . .";
    let popButton = Option.Button ?? "";
    let Switch = Option.Switch ?? useState();
    let CloseButton = Option.Close ?? false;
    let popTypeList = {
        success:{
            color:"my-green",
        },
        error:{
            color:"red-500",
        },
        warning:{
            color:"yellow-500",
        },
        notice:{
            color:"sky-400",
        },
        none:{
            color:"black",
        }
    };
    let popTypePick = popTypeList[Option.Type ? Option.Type : 'none'];
    let s_Color = Option.Color ?? popTypePick.color;
    let s_Width = Option.Width ?? "20rem";


    //** Use Ref */
    const popId = useRef();

    //** Use Effect */
    //This will turn off and on the popup
    useEffect(()=>{
        if(Switch[0] == true){ //Check if the state of PopUP
            popId.current.showModal(); //Activate by using showMadal();
        }else{
            popId.current.close(); //Activate Close if not true anymore;
        }
    }, [Switch[0]]);

    //Design of UI
    const dialogStyling = {
        width: s_Width,
    }

    //** Functionality */
    function close(){
        Switch[1](false);
    }

    //This will return the ui of modal pop up
    return <>
        <dialog ref={popId} className='backdrop:backdrop-blur-sm backdrop:brightness-[.35] backdrop:contrast-75 p-5 drop-shadow-myDrop3' style={dialogStyling}>
            {
                CloseButton ? <div className="flex justify-end ">
                    <div className="cursor-pointer pl-2" onClick={close}>
                        <Icon InClass={`fill-black`} OutClass="w-5 h-5" Name="close" />
                    </div>
                </div> :
                ""
            }

            <Loading />
            {
                Title ? <h2 className={`text-4xl text-center text-${s_Color}`}>{Title} </h2> : ""
            }
            <p className="text-center">{Message}</p>

            {
                popButton ? <>
                <div className="mt-5 flex flex-wrap md:gap-4 gap-2 justify-center">
                    { popButton.map((x, i)=>{
                        let buttonFunction = x.Func;
                        if(buttonFunction === 'close')
                            buttonFunction = close;
                        return <Button key={i} Type="button" Color={x.Color ?? undefined} Click={buttonFunction}  Name={x.Name} />
                    }) }
                </div>
                </> : ''
            }

        </dialog>
    </>
}
