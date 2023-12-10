// Utilities
import { useContext } from "react"

import Search from "../Search"
import { G_Search } from "./ListContainer"


export default ()=>{
    //** STRUCTURE */

    //** Use Context */
    const [ v_search, e_search, f_search, ButtonProps, OtherButtons, Name ] = useContext(G_Search);

    /*
    ButtonsProps
    1. Filter
    2. ItemSelection
    3. Delete
    */

    return <>
        {/* List Navigation*/}
        <div className='w-full bg-slate-800 h-1 mt-10'></div>
        <div className='flex sm:flex-nowrap flex-wrap gap-2 items-center mb-5'>
            <div className='p-2 border-l-2 border-b-2 border-r-2 rounded-b border-black font-semibold text-my-green shrink-0 sm:w-auto w-full break-keep'>{Name}</div>
            <div className='flex flex-wrap justify-end gap-2 w-full shrink'>
                <Search Handle={[v_search, e_search]} Click={f_search}  />
                {OtherButtons.map(x=>x)}
            </div>
        </div>
    </>
}
