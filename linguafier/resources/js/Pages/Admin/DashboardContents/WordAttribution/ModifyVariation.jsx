// UTILITIES
import AdminMainUI from "../../Utilities/AdminMainUI";
import Button from "../../../../Utilities/Button";
import Textbox from "../../../../Utilities/Textbox";
import FIleInput from "../../../../Utilities/FileInput";
import Pop from "../../../../Utilities/Pop";
import PopFlash from "../../../../Utilities/PopFlash";
import PopLoading from "../../../../Utilities/PopLoading";

// HOOKS
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default ()=>{
    //** Use Page */
    const { errors, data, storage } = usePage().props

    //**>> Use State */
    const [ v_name, e_name ] = useState(data.name);
    const [ v_image, e_image ] = useState({name:data.image});
    const [ v_preview, e_preview] = useState(storage+data.image);

    const [ c_disabled, e_disabled ] = useState(true);

    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    //**>> STRUCT */
    let popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this? Are you sure?",
            Type: "warning",
            Button: [
                {Name: "Yes", Func:()=>{ e_popPick('ConfirmDelete'); }, Color:'bg-red-500'  },
                {Name: "No! Of course not", Func:"close", Color:'bg-slate-500'  },
            ]
        },
        ConfirmDelete:{
            Title: "Delete Confirmation",
            Message: `Click "Yes" to proceed?`,
            Type: `notice`,
            Button: [
                {Name: "YES!", Func:()=>{
                    router.post('/admin/dashboard/word_attribution/delete_variation/'+data.id, {}, {onFinish:()=>{
                        e_popLoading(false);
                    }});
                    e_popLoading(true);
                    e_popSwitch(false);

                }, Color:'bg-red-500'  },
                {Name: "I've Changed my mind", Func:"close", Color:'bg-slate-500'  },
            ]
        },
        ConfirmSubmit:{
            Title: `Confirm Modifications`,
            Message: `Click "Yes" to modify the role.`,
            Type: 'notice',
            Button : [
                {Name: "Yes", "Func":()=>{
                    router.post('/admin/dashboard/word_attribution/modify_variation_submit/'+data.id, {
                       v_name:v_name,
                       v_image:v_image,
                    }, {onFinish:()=>{
                        e_popLoading(false);
                    }});
                    e_popLoading(true);
                    e_popSwitch(false);
                }, Color:'bg-my-green' },
                {Name: "Continue Editing", Func:"close", Color:'bg-slate-500'  },
            ]

        },
    };
    //**<< STRUCT */

    //** Use Effect */
    useEffect(()=>{
        if(isUnchange()){
            e_disabled(true);
        }else{
            e_disabled(false);
        }
    }, [v_name, v_image]);


    //** Functionality */
    function isUnchange(){
       return (
        v_name == data.name &&
        JSON.stringify(v_image) == JSON.stringify({name:data.image})
       )
    }


    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_attribution')}}/>
        </div>
        {/* Modify Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Modify Word Variation</h4>

            <div className="flex flex-col gap-1">
                <label className="">Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_name} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-col gap-1">
                <label className="">Image: </label>
                <FIleInput Handler={[v_image, e_image]} Error={errors.v_image} Preview={[v_preview, e_preview]} />
            </div>

            <div className="mt-10 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Modify" Click={()=>{
                    e_popPick('ConfirmSubmit');
                    e_popSwitch(true);
                }} Disabled={c_disabled} />
                <Button Name="Reset" Click={()=>{
                    e_name(data.name);
                    e_image({name:data.image});
                    e_preview(storage+data.image);
                }}/>
                <Button Name="Delete" Color="bg-red-500" Click={ ()=>{ e_popSwitch(true); e_popPick('WarningDelete') }}/>
            </div>

        </form>

        {/* POP */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/word_attribution'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":"close", Color:'bg-slate-400'  },
        ]}} />
    </AdminMainUI>
}
