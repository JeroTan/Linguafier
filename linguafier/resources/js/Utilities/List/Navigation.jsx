// Utilities
import { useContext } from "react"

import Search from "../Search"
import { G_Search } from "./ListContainer"


export default ()=>{
    //** STRUCTURE */

    //** Use Context */
    const [ v_search, e_search, ButtonProps, OtherButtons ] = useContext(G_Search);

    /*
    ButtonsProps
    1. Filter
    2. ItemSelection
    3. Delete
    */

    return <>
        {/* List Navigation*/}
        <div className='w-full bg-slate-800 h-1 mt-5'></div>
        <div className='flex flex-wrap justify-between items-center'>
            <div className='p-2 border-l-2 border-b-2 border-r-2 rounded-b border-black font-semibold text-my-green'>List of Roles</div>
            <div className='flex flex-wrap gap-2'>
                <Search Handle={[v_search, e_search]} Click={Option.Click}  />
                {OtherButtons.map(x=>x)}
            </div>
        </div>
    </>
}
