// UTILITIES
import Button from "./Button";
import Textbox from "./Textbox";

// HOOKS


export default function Search(Option){

    //** Funcitonality */


    return <div className="flex gap-2">
        <Textbox Handle={Option.Handle} Color={`bg-my-light`} Size="w-full shrink" PressFunc={
            (event)=>{
                if (event.key === 'Enter') {
                    Option.Click();
                }
            }
        }/>
        <Button Icon="search" Click={Option.Click} Padding="py-1 px-2 shirnk-0 " IconOutClass="w-5 h-5" />
    </div>
}
