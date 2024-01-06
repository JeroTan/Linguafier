// UTILITIES
import Icon from "../Icon";

//HOOKS
import { router } from "@inertiajs/react";
import { Fragment } from "react";

export default (Option)=>{
    //** STRUCT */
    let Link = Option.Link;
    let prevLink = Link.prev_page_url;
    let nextLink = Link.next_page_url;
    let firstLink = Link.first_page_url;
    let lastLink = Link.last_page_url;
    let currentPage = Link.current_page;
    let lastPage = Link.last_page;
    let eachSide = Link.each_side ?? 2;
    let addGet = Link.add_get ?? false;
    let path = Link.path+`?page=`;

    //console.log(prevLink, nextLink, firstLink, lastLink, currentPage, lastPage, eachSide, path);

    //** Functionality */
    function paginationPlate(content, link = false, current = false){
        return <div className={`${current? "bg-green-300 text-slate-700" : "bg-my-green text-slate-100"} min-w-[10px] py-[.5px] px-[6px] text-center rounded shadow-myBox1 cursor-pointer outline outline-1 outline-slate-700 flex items-center justify-center`} onClick={()=>{
            if(link){
                if(addGet){
                    addGet.forEach(x => {
                        link = link + "&" + x;
                    });
                }
                router.get(link);
            }
        }}>
            {content}
        </div>
    }
    function paginationSpread(){
        let paginate = [];
        if(currentPage > 2){
            paginate[paginate.length] = paginationPlate(<Icon Name={'first_prev'} OutClass={`w-3 h-3`} InClass={"fill-white"} />, firstLink);
        }
        if(prevLink){
            paginate[paginate.length] = paginationPlate(<Icon Name={'prev'} OutClass={`w-3 h-3`} InClass={"fill-white"} />, prevLink);
        }
        if(currentPage > 1){
            for(let i = currentPage - eachSide; i < currentPage; i++){
                if(i > 0){
                    paginate[paginate.length] = paginationPlate(i, `${path}${i}`);
                }
            }
        }
        paginate[paginate.length] = paginationPlate(currentPage, false, true);
        if(currentPage < lastPage){
            for(let i = currentPage+1; i <= currentPage+eachSide;i++){
                if(i <= lastPage){
                    paginate[paginate.length] = paginationPlate(i, `${path}${i}`);
                }
            }
        }
        if(nextLink){
            paginate[paginate.length] = paginationPlate(<Icon Name={'next'} OutClass={`w-3 h-3`} InClass={"fill-white"} />, nextLink);
        }
        if(currentPage < lastPage-1){
            paginate[paginate.length] = paginationPlate(<Icon Name={'last_next'} OutClass={`w-3 h-3`} InClass={"fill-white"} />, lastLink);
        }
        return paginate;
    }
    return <div className="flex w-full justify-center gap-2">
        {paginationSpread().map((x, i)=><Fragment key={i}>{x}</Fragment>)}
    </div>
}
