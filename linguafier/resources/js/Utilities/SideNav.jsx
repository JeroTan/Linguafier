import { Link } from "@inertiajs/react";

export default function SideNav(Option){

    //Remember That it needs to have a parent with flex-wrap at md so that it can be responsive
    return <>
        <aside className="lg:w-[20rem] w-[13rem] shrink-0">
            <div className="flex flex-wrap flex-col lg:gap-2 gap-1 lg:p-4 p-1 bg-my-green min-h-fit border-2 border-black rounded shadow-myBox3 shadow-black text-white font-sniglet lg:text-xl text-base">
                { Option.Link ? Option.Link.map((x, i)=>{
                    let baseCSS = "rounded-md ";
                    if(x.Selected){
                        baseCSS+= " lg:p-2 p-1 bg-my-light/25 text-my-yellow my-textshadow1";
                    }else{
                        baseCSS+= " lg:px-2 px-1 py-0 cursor-pointer hover:outline hover:outline-2 hover:outline-green-800/50 myhover-textshadow1 hover:text-my-yellow";
                    }
                    return <Link href={x.Link} key={i} className={baseCSS}>
                        {x.Name}
                    </Link>

                }) : ''  }
            </div>
        </aside>

    </>
}
