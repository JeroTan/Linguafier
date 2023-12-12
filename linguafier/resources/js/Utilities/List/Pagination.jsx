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
    let eachSide = Link.each_side;
    let path = Link.path+`?page=`;

    //** Functionality */
    function paginationPlate(content, link = false){
        return <div className="bg-my-green min-w-[10px] py-2 text-center rounded shadow-myBox1 cursor-pointer" onClick={()=>{
            if(link){
                router.get(link);
            }
        }}>
            {content}
        </div>
    }
    function paginationSpread(){
        let paginate = [];
        if(firstLink){
            paginate[paginate.length] = paginationPlate("|<", firstLink);
        }
        if(prevLink){
            paginate[paginate.length] = paginationPlate("<", prevLink);
        }
        if(currentPage > 1){
            for(let i = currentPage - eachSide; i < currentPage; i++){
                if(i > 0){
                    paginate[paginate.length] = paginationPlate(i, `${path}${i}`);
                }
            }
        }
        paginate[paginate.length] = paginationPlate(currentPage);
        if(currentPage < lastPage){
            for(let i = currentPage; i < currentPage+2;i++){
                if(i <= lastPage){
                    paginate[paginate.length] = paginationPlate(i, `${path}${i}`);
                }
            }
        }
        if(nextLink){
            paginate[paginate.length] = paginationPlate(">", nextLink);
        }
        if(prevLink){
            paginate[paginate.length] = paginationPlate(">|", lastLink);
        }
        return paginate;
    }
    return <div className="flex w-full justify-center gap-2">
        {paginationSpread().map((x, i)=><Fragment key={i}>{x}</Fragment>)}
    </div>
}
