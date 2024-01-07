// UTILITIES
import Icon from "./Icon";

// CSS
import './Navbar.css';

// HOOKS
import { useState, useMemo, useCallback } from "react";
import { usePage, Link, router  } from "@inertiajs/react";


export default ()=>{
    //** Use Page */
    const { asset, popFlash, pageUser, specialAccount } = usePage().props;

    //** Use State */
    const [c_profile, e_profile] = useState(false);

    //** Helper */
    const firstNav = useMemo(()=>{
        const des = {
            Special:<>
                <h4 className="text-2xl font-sniglet text-my-yellow drop-shadow-myDrop1">Admin Realm</h4>
            </>,
            User:<>
                <h4 className="text-2xl font-sniglet text-my-yellow drop-shadow-myDrop1 cursor-pointer hover:brightness-110 hover:scale-105" onClick={()=>{
                    router.get('dictionary');
                }}>Dictionary</h4>
                <h4 className="text-2xl font-sniglet text-my-yellow drop-shadow-myDrop1 cursor-pointer hover:brightness-110 hover:scale-105" onClick={()=>{
                    router.get('study');
                }}>Study</h4>
            </>
        }
        return des[pageUser] ?? <></>;
    }, [pageUser]);

    const profileNav = useMemo(()=>{
        const des = {
            Special:<>
                <Icon OutClass={`w-7 h-7`} Name="person" />
            </>,
            User:<>

            </>
        }
        return des[pageUser] ?? <></>;
    }, [pageUser]);

    const profileDropDown = useMemo(()=>{
        if(specialAccount){
            return <>
            <div className={`${c_profile ? "absolute" : "hidden"} w-max top-[60px] p-2 bg-my-green shadow-myBox3 outline outline-2 outline-black text-white z-[100]`}>
                <div className="pb-2 border-b border-slate-800 flex flex-col items-end">
                    <h4 className="text-2xl font-bold text-my-light drop-shadow-myDrop1">{specialAccount.username}</h4>
                    <small className="mt-[-8px] font-light"> <span className=" italic">role:</span> <span className="font-semibold">{specialAccount.rolename}</span> </small>
                </div>
                <div className="flex flex-col items-center">
                    <Link href="#" className="block hover:text-my-yellow text-slate-100">Settings</Link>
                    <div className="hover:text-my-yellow cursor-pointer text-slate-100" onClick={()=>{router.post('/admin/logout')}}>
                        Log Out
                    </div>
                </div>
            </div>
            </>
        }else if(true){
            return <></>
        }
    }, [pageUser, specialAccount, c_profile]);

    const redirectToHome = useCallback(()=>{
        if(pageUser == 'Special'){
            router.get('/admin');
        }else if(pageUser == 'User'){
            router.get('/');
        }
    }, [pageUser])



return <>
    <header className="bg-my-green block py-1 px-2">
        <nav className="flex justify-between max-w-[90rem] mx-auto h-[4.2rem]">
            <div className="flex items-center gap-6">
                <div className="bg-my-light px-4 py-2 rounded-bl-3xl rounded-tr-3xl rounded-tl-[3rem] rounded-br-[3rem] cursor-pointer drop-shadow-myDrop1 delay-100 hover:drop-shadow-myDrop3 hover:brightness-125">
                    <div className="h-10" onClick={redirectToHome}>
                        <img className="object-cover w-full h-full" src={asset+"linguafier_logo.svg"}/>
                    </div>
                </div>
                <div className="sm:flex hidden flex-wrap gap-y-2 gap-x-4 ">
                    {firstNav}
                </div>
            </div>

            <div className="flex items-center justify-center gap-6">
                <div className="relative flex 2xl:justify-center justify-end">
                    <div className="relative bg-my-light rounded-full h-12 aspect-square drop-shadow-myDrop1 cursor-pointer overflow-hidden flex justify-center items-center delay-100 hover:drop-shadow-myDrop3 hover:brightness-125" onClick={ ()=>{
                        if(specialAccount)
                            e_profile(prev=>!prev);
                    } }>
                        {profileNav}
                    </div>
                    {/** Drop Down of Pofile */}
                    {profileDropDown}
                </div>
            </div>

        </nav>
    </header>
    <div className="w-full h-[5px] bg-black">

    </div>
</>
}
