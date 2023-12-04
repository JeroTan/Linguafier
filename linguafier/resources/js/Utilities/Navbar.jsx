import { usePage } from "@inertiajs/react";

// UTILITIES
import Icon from "./Icon";

// CSS
import './Navbar.css';

// HOOKS
import { useState } from "react";


export default ()=>{
    //** Use Page */
    const { asset, popFlash } = usePage().props;

    //** Use State */
    const [s_profile, se_profile] = useState(false);



return <>
    <header className="bg-my-green block py-1 px-2">
        <nav className="flex justify-between max-w-[90rem] mx-auto h-[4.2rem]">
            <div className="flex items-center gap-6">
                <div className="bg-my-light px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-[3rem] rounded-br-[3rem] cursor-pointer drop-shadow-myDrop1 delay-100 hover:drop-shadow-myDrop3 hover:brightness-125">
                    <div className="h-10">
                        <img className="object-cover w-full h-full" src={asset+"linguafier_logo.svg"}/>
                    </div>
                </div>
                <div>
                    <h4 className="text-2xl font-sniglet text-my-yellow drop-shadow-myDrop1">Admin Realm</h4>
                </div>
            </div>
            <div className="flex items-center justify-center gap-6">
                <div className="relative flex justify-center">
                    <div className="relative bg-my-light rounded-full h-12 aspect-square drop-shadow-myDrop1 cursor-pointer overflow-hidden flex justify-center items-center delay-100 hover:drop-shadow-myDrop3 hover:brightness-125" onClick={ ()=>se_profile(prev=>prev?false:true) }>
                        <Icon OutClass={`w-7 h-7`} IconName="person" />
                    </div>
                    <div className={`${s_profile ? "absolute" : "hidden"} top-[60px] p-2 bg-my-green shadow-myBox3 outline outline-2 outline-black text-white`}>
                        <div className="cursor-pointer">Settings</div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <div className="w-full h-[5px] bg-black">

    </div>
</>
}
