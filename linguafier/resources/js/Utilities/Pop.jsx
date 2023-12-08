// REACT
import { useRef, useEffect } from "react";

// UTILITIES
import Icon from './Icon';
import Button from './Button';


export default function Pop(Option){
    //** Use Ref */
    const popId = useRef();

    //** Use Effect */
    //This will turn off and on the popup
    useEffect(()=>{
        if(Option.State[0] == true){ //Check if the state of PopUP
            popId.current.showModal(); //Activate by using showMadal();
        }else{
            popId.current.close(); //Activate Close if not true anymore;
        }
    }, [Option.State[0]]);
    useEffect(()=>{
        if(Option.Flash)
            Option.State[1](true);
    }, [Option.Flash]);


    //Design of UI
    const dialogStyling = {
        width: Option.Width ? Option.Width : "34rem",
    }

    //Types of PopUp in Colors
    let colorState = Option.ColorState ?? "black";

    //** Functionality */
    function close(){
        Option.State[1](false);
    }

    //This will return the ui of modal pop up
    return <>
        <dialog ref={popId} className='backdrop:backdrop-blur-sm backdrop:brightness-[.35] backdrop:contrast-75 p-5' style={dialogStyling}>
            <div className="flex justify-end ">
                <div className="cursor-pointer pl-2">
                    <Icon InClass={`fill-black`} OutClass="w-5 h-5" Name="close" />
                </div>
            </div>
            {
                Option.Icon ?
                <div className="flex justify-center">
                    <div>
                        <Icon InClass={`fill-${colorState}`} OutClass="w-32 h-32" Name={Option.Icon} />
                    </div>
                </div>
                : ''
            }

            <h2 className={`text-4xl text-center mb-5 text-${colorState}`}>{Option.Title} {Option.Flash ? Option.Flash.Title : ""} </h2>
            <p>{Option.Message} {Option.Flash ? Option.Flash.Message : ""} </p>
            <div className="flex flex-wrap justify-center">
            {
                Option.Button ?
                Option.Button.map((x, i)=>{
                    let buttonFunction = x.Func;
                    if(buttonFunction == 'close')
                        buttonFunction = close;
                    return <Button key={i} Type="button" Color={x.Color ?? undefined} Click={buttonFunction}  Name={x.Name} />
                }) :
                ''
            }
            </div>
        </dialog>
    </>
}
