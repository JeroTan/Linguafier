export default (Option)=>{

    return <label className="relative inline-block w-11 h-6 cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={Option.Handle[0]} onChange={()=>{ Option.Handle[1]((p)=>!p) }}/>
        <div className="w-full h-full bg-my-light delay-100 outline outline-black outline-1 rounded shadow-black shadow-myBox3 flex items-center justify-center
        before:w-5 before:h-5 before:bg-slate-500 before:translate-x-[-9px] before:rounded
        hover:brightness-110 hover:outline-2 hover:outline-slate-800
        peer peer-checked:before:translate-x-[9px] peer-checked:before:bg-my-green peer-checked:outline-my-green peer-checked:outline-2
        "></div>
    </label>
/*
    return <div className="relative inline-block w-11 h-6">
        <input type="checkbox" value={""} className="sr-only peer" checked={Option.Handle[0]} onChange={()=>{ Option.Handle[1]((p)=>!p); console.log(Option.Handle[0]) }}></input>
        <div className="absolute delay-100 top-0 bottom-0 left-0 right-0 outline outline-black outline-1 rounded shadow-black shadow-myBox3
            cursor-pointer bg-my-light flex items-center justify-center
            before:w-5 before:h-5 before:bg-slate-500 before:translate-x-[-9px] before:rounded
            hover:brightness-110 hover:outline-2 hover:outline-slate-800
            peer peer-checked:before:translate-x-[9px] peer-checked:before:bg-my-green
        "></div>
    </div>

    return <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer"/>
        <div class="w-11 h-6 bg-gray-200
        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
        rounded-full
        peer
        dark:bg-gray-700
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </label>
*/
}
