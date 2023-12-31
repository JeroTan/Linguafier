// HOOKS
import { router, usePage } from "@inertiajs/react"


// UTILTIES
import AdminMainUI from "../../Utilities/AdminMainUI"
import Button from "../../../../Utilities/Button"
import Textbox from "../../../../Utilities/Textbox"
import TextboxDropDown from "../../../../Utilities/TextboxDropDown"
import Pop from "../../../../Utilities/Pop"
import PopFlash from "../../../../Utilities/PopFlash"
import PopLoading from "../../../../Utilities/PopLoading"

// HOOKS
import { useEffect, useState } from "react"

export default()=>{
    //** Use Page */
    const { errors, roles, data } = usePage().props;


    //**>> Use State */
    const [v_username, e_username] = useState(data.username);
    const [v_password, e_password] = useState("");
    const [v_role, e_role] = useState(data.rolename);

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState('WarningDelete');
    const [c_disabled, e_disabled] = useState(true);
    //**<< Use State */

    //** STRUCT */
    let popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this account? Are you sure?",
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
                    router.post('/admin/dashboard/special_user/delete/'+data.id, {}, {onFinish:()=>{
                        e_popLoading(false);
                    }});
                    e_popSwitch(false);
                    e_popLoading(true);
                }, Color:'bg-red-500'  },
                {Name: "I've Changed my mind", Func:"close", Color:'bg-slate-500'  },
            ]
        },
        ConfirmSubmit:{
            Title: `Confirm Modifications`,
            Message: `Click "Yes" to modify this account.`,
            Type: 'notice',
            Button : [
                {
                    Name: "Yes",
                    "Func":()=>{
                        router.post('/admin/dashboard/special_user/modify_submit/'+data.id, {
                            v_username:v_username,
                            v_password:v_password,
                            v_role:v_role,
                        }, {
                            onFinish:()=>{
                                e_popLoading(false);
                            }
                        });
                        e_popLoading(true);
                        e_popSwitch(false);
                    },
                    Color:'bg-my-green'

                },
                {Name: "Continue Editing", Func:"close", Color:'bg-slate-500'  },
            ]

        },
    };

    //** Use Effect */
    useEffect(()=>{
        if(isUnchange()){
            e_disabled(true);
        }else{
            e_disabled(false);
        }
    }, [v_username, v_password, v_role]);

    //** FUNCTIONALITY */
    function isUnchange(){
        return (
            v_username == data.username &&
            v_password == "" &&
            v_role == data.rolename
        );
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/special_user')}}/>
        </div>

        {/* Add Role Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Modify Special User</h4>

            <div className="flex flex-col gap-1">
                <label className="">Username: </label>
                <Textbox Handle={[v_username, e_username]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_username} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-col gap-1">
                <label className="">Password: </label>
                <Textbox Handle={[v_password, e_password]} Type="password" Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_password} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-col gap-1">
                <label className="">Roles: </label>
                <TextboxDropDown Handle={[v_role, e_role]} Size="sm:ml-3 w-96" Placeholder="Pick Role. . ." Error={errors.v_role} DropData={roles} Request={`/admin/dashboard/special_user/add_roleSearch`} SelectSkip={true}  />
            </div>

            <div className="mt-5 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Modify" Click={()=>{
                    e_popPick('ConfirmSubmit');
                    e_popSwitch(true);
                }} Disabled={c_disabled} />
                <Button Name="Reset" Click={()=>{
                    e_username(data.username);
                    e_password("");
                    e_role(data.rolename);
                }}/>
                <Button Name="Delete" Color="bg-red-500" Click={ ()=>{ e_popSwitch(true); e_popPick('WarningDelete') }}/>
            </div>
        </form>

        {/* POP */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
                {'Name': "Okay", "Func":"close", Color:'bg-slate-400'  },
        ],}} />

    </AdminMainUI>
}
