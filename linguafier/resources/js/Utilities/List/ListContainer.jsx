// UTILITIES
import Navigation from "./Navigation";
import ItemBox from "./ItemBox";
import Pagination from "./Pagination";
import SortBar from "./SortBar";
import Progress from "../Progress";
import LoadingComp from "../Loading";

// HOOKS
import { createContext } from "react"
import { Fragment } from "react";



//CreateContext
export const G_Search = createContext();

//COMPONENTS
function NoItemBox(Option, NoItemMessage, NoItemSubMessage){
    return <div className="w-full md:p-5 p-2 bg-my-light shadow-myBox1 outline outline-2 outline-offset-[-2px] outline-black rounded  text-slate-600 flex flex-col">
        <h3 className="md:text-3xl text-xl font-bold">{NoItemMessage}</h3>
        <small className="md:text-lg text-sm font-light mt-[-2px]">{NoItemSubMessage}</small>
    </div>
}

export default (Option)=>{
    //** STRUCTURE */

    let Search = Option.Search;
    let ButtonProps = Option.ButtonProps ?? {};
    let OtherButtons = Option.OtherButtons ?? [];
    let ItemBoxContent = Option.Contents ?? [];
    let NoItemMessage = Option.NoItemMessage ?? "Nothing Found!";
    let NotItemSubMessage = Option.NoItemSubMessage ?? "Please Add More Item to the List.";
    let Name = Option.Name ?? "List of Items";
    let PaginationData = Option.Pagination ?? false;
    let Sort = Option.Sort ?? false;
    let Filter = Option.Filter ?? false;
    let Loading = Option.Loading ?? undefined;

    // Functionality
    function ProgressOrLoading(){
        if(Loading[0] === true || Loading[0] === false){
            return <div className="w-full flex justify-center">
                < LoadingComp />
            </div>
        }else{
            return <Progress Handler={Loading} />
        }
    }

    // Render
    return <main>
        <G_Search.Provider value={[Search[0], Search[1], Search[2], Filter, OtherButtons, Name]}>
            <Navigation />
        </G_Search.Provider>
        {
            Sort ? <div className="my-2">
                <SortBar Sort={Sort} />
            </div> : ""
        }
        <div className="my-2 md:pl-5 sm:pl-2 pl-0 flex flex-wrap gap-2">
            {
                Loading && Loading[0] ? ProgressOrLoading() : <>
                { ItemBoxContent.length > 0 ?
                    ItemBoxContent.map((x, i)=><Fragment key={i}><ItemBox Content={x}/></Fragment> )
                    : NoItemBox(0, NoItemMessage, NotItemSubMessage)
                }
                </>
            }

        </div>
        {
            typeof PaginationData === "object" ? <div className="my-2">
                <Pagination Link={PaginationData}  />
            </div> :
            ""
        }
    </main>
}
