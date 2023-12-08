// UTILITIES
import Button from "./Button";
import Textbox from "./Textbox";

// HOOKS


export default function Search(Option){

    //** Funcitonality */


    return <div className="flex gap-2">
        <Textbox Handle={Option.Handle} Color={`bg-my-light`}/>
        <Button Icon="search" Click={Option.Click} Padding="py-1 px-2" IconOutClass="w-5 h-5" />
    </div>
}
