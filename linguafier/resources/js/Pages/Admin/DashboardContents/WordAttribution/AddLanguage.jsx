// UTILITIES
import AdminMainUI from "../../Utilities/AdminMainUI";
import Button from "../../../../Utilities/Button";
import PopFlash from "../../../../Utilities/PopFlash";
import PopLoading from "../../../../Utilities/PopLoading";
import Textbox from "../../../../Utilities/Textbox";

// HOOKS
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default ()=>{

    //** Use Page */
    const { errors } = usePage().props;

    //** Use State */
    const [ v_name, e_name] = useState("");

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);

    //** Functionality */
    function resetData(){
        e_name('');
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_attribution?pgsw=Language')}}/>
        </div>
        {/* Add Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Language</h4>

            <div className="flex flex-col gap-1">
                <label className="">Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_name} />
            </div>

            <div className="mt-10 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Create" Click={()=>{
                    router.post('/admin/dashboard/word_attribution/add_language_submit', {
                        v_name:v_name,
                    }, {
                        onFinish:()=>{
                            e_popLoading(false);
                        }
                    });
                    e_popLoading(true);
                }}/>
                <Button Name="Reset" Click={resetData}/>
            </div>
        </form>

        {/* POP */}
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/word_attribution?pgsw=Language'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":()=>{e_popFlash(false); resetData();}, Color:'bg-slate-400'  },
        ]}} />
    </AdminMainUI>

}
