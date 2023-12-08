// UTILITIES
import Navigation from "./Navigation";
import ItemBox from "./ItemBox";

// HOOKS
import { createContext } from "react"
import { Fragment } from "react";



//CreateContext
export const G_Search = createContext();

//COMPONENTS
function NoItemMessage(Option){
    return <></>
}

export default (Option)=>{
    //** STRUCTURE */
    let Search = Option.Search;
    let ButtonProps = Option.ButtonProps ?? {};
    let OtherButtons = Option.OtherButtons ?? [];
    let ItemBoxContent = Option.Contents ?? [];

    //<Navigation />
    return <main>
        <G_Search.Provider value={[Search[0], Search[1], ButtonProps, OtherButtons]}>
            <Navigation />
        </G_Search.Provider>
        <div className="my-2 md:pl-5 pl-2 flex flex-wrap gap-2">
            { ItemBoxContent.length > 0 ?
                ItemBoxContent.map((x, i)=><Fragment key={i}><ItemBox Content={x}/></Fragment> )
                : NoItemMessage(0)}
        </div>
    </main>
}
