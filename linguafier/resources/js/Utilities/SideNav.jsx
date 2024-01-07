import { Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

// UTILITIES
import Icon from "./Icon";

export default function SideNav(Option){
    let LinkData = Option.Link ?? [{Name:"Example", Link:"#", Selected: true, Func:false}];

    //** Use State */
    const isSelecting = useState(false);

    function wideScreen(){
        return LinkData ? LinkData.map((x, i)=>{

            let baseCSS = "rounded-md ";
            if(x.Selected){
                baseCSS+= " lg:p-2 p-1 bg-my-light/25 text-my-yellow my-textshadow1";
            }else{
                baseCSS+= " lg:px-2 px-1 py-0 cursor-pointer hover:outline hover:outline-2 hover:outline-green-800/50 myhover-textshadow1 hover:text-my-yellow";
            }
            if(x.Func){
                return <div key={i} className={baseCSS} onClick={(e)=>{
                    if(x.Link){
                        router.get(x.Link);
                    }
                    x.Func(e);
                }}>
                    {x.Name}
                </div>
            }
            return <Link href={x.Link} key={i} className={baseCSS}>
                {x.Name}
            </Link>

        }) : '';
    }

    function smallScreen(){
        let listLink = [];
        let MainSelect = "No Selected";
        LinkData.forEach((x, i) => {
            if(x.Selected){
                MainSelect = x.Name;
                return;
            }
            listLink[listLink.length] = <div key={i} className="rounded-md lg:px-2 px-1 py-0 cursor-pointer hover:outline hover:outline-2 hover:outline-green-800/50 myhover-textshadow1 hover:text-my-yellow" onClick={()=>{
                if(x.Link){
                    router.get(x.Link);
                }
                if(x.Func)
                    x.Func(e);
                isSelecting[1](false);
            }}>
                {x.Name}
            </div>
        });


        return <>
            <div className={`w-full flex justify-between p-2 cursor-pointer`} onClick={()=>{
                isSelecting[1](prev=>!prev);
            }}>
                <h4 className="text-my-yellow my-textshadow1">{MainSelect}</h4>
                <Icon Name={`${isSelecting[0]?"up":"down"}`} OutClass={`w-5 h-5`} InClass={`fill-white`} />
            </div>
            <div className={`max-h-screen overflow-y-auto custom_scroll ${isSelecting[0]?"flex":"hidden"} flex-col gap-2 bg-green-900/50 p-2`}>
                {listLink}
            </div>
        </>
    }

    //Remember That it needs to have a parent with flex-wrap at md so that it can be responsive
    return <>
        <aside className="lg:w-[20rem] md:w-[13rem] w-full shrink-0 sticky top-0 z-50">
            <div className="bg-my-green min-h-fit border-2 border-black rounded shadow-myBox1_3 shadow-black text-white font-sniglet lg:text-xl text-base">
                <div className="lg:p-4 p-1 md:flex flex-wrap flex-col lg:gap-2 gap-1 hidden">
                { wideScreen() }
                </div>
                <div className="md:hidden flex flex-col w-full ">
                    {smallScreen()}
                </div>

            </div>
        </aside>

    </>
}
