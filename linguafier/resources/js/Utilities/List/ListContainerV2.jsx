// UTILITIES
import Navigation from "./Navigation";
import ItemBox from "./ItemBox";
import Pagination from "./Pagination";
import SortBar from "./SortBar";
import Progress from "../Progress";
import LoadingComp from "../Loading";
import Button from "../Button";
import { G_Search } from "./ListContainer";

// HOOKS
import { createContext, useState, useRef, useMemo, useCallback } from "react"
import { Fragment } from "react";



// //CreateContext
// export const G_Search = createContext(); This will take over from ListContainer Version 1

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

    //** Use State */
    const [c_listView, s_listView] = useState('wide');

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
    function LoadContents(){

        return ItemBoxContent.length > 0 ?
        ItemBoxContent.map((x, i)=>{
            if(c_listView == 'wide'){
                return <Fragment key={i}><ItemBox Content={x.wide}/></Fragment>
            }else if(c_listView == 'compact'){
                return <Fragment key={i}>
                    <div className="rounded border-t border-l border-b-4 border-r-4 border-my-green lg:col-span-2 md:col-span-3 sm:col-span-4 col-span-6 overflow-hidden">{x.compact}</div>
                </Fragment>
            }
        })
        : NoItemBox(0, NoItemMessage, NotItemSubMessage);

    }

    // Render
    return <main>
        <G_Search.Provider value={[Search[0], Search[1], Search[2], Filter, OtherButtons, Name]}>
            <Navigation />
        </G_Search.Provider>
        <div className="my-2 flex justify-between">
            { Sort?<SortBar Sort={Sort} />:<></>}
            <div className={` ${!Sort?'w-full':'shrink'}`}>
                <Button Icon={`${c_listView}_view`} Padding={'p-1'} Click={()=>{
                    s_listView(prev=>prev=='wide'?'compact':'wide');
                }} />
            </div>
        </div>
        <div className="my-2 md:px-5 sm:px-2 px-0 flex flex-wrap">
            { Loading && Loading[0] ? ProgressOrLoading() : <>
                <div className={`${c_listView == 'wide'?'flex flex-wrap':'grid grid-cols-12 auto-rows-max'} w-full gap-2`}>
                { LoadContents()}
                </div>
            </> }

        </div>
        {
            typeof PaginationData === "object" ? <div className="my-2">
                <Pagination Link={PaginationData}  />
            </div> :
            ""
        }
    </main>
}
