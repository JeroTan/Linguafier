// UTILTIES
import AdminMainUI from "../../Utilities/AdminMainUI"
import Button from "../../../../Utilities/Button"
import Textbox from "../../../../Utilities/Textbox"
import ToggleButton from "../../../../Utilities/ToggleButton"
import PopFlash from "../../../../Utilities/PopFlash"
import Pop from "../../../../Utilities/Pop"
import PopLoading from "../../../../Utilities/PopLoading"

// HOOKS
import { useState } from "react"
import { usePage, router } from "@inertiajs/react"

export default function Modify(Option){
    //** Use Page */
    const { roleId, data, errors } = usePage().props;
    let dataPrivileges = JSON.parse(data.privilege);
    console.log(errors);

    //**>> Use State */
    const [v_name, e_name] = useState(data.name);
    const [v_mSpecialUser, e_mSpecialUser] = useState(dataPrivileges['Manage Special User']);
    const [v_mWizard, e_mWizard] = useState(dataPrivileges['Manage Wizard']);
    const [v_mWizardRank, e_mWizardRank] = useState(dataPrivileges['Manage Wizard Rank']);
    const [v_mWordLibrary, e_mWordLibrary] = useState(dataPrivileges['Manage Word Library']);
    const [v_mWordAttributes, e_mWordAttributes] = useState(dataPrivileges['Manage Word Attributes']);
    const [v_mRoles, e_mRoles] = useState(dataPrivileges['Manage Roles']);

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popWarning, e_popWarning] = useState(false);
    const [v_popConfirmDelete, e_popConfirmDelete] = useState(false);
    const [v_popConfirmSubmit, e_popConfirmSubmit] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */


    //** Render */
    return <AdminMainUI>
        {/* Flash */}
        <PopFlash Handle={[v_popFlash, e_popFlash]} Button={[
            {'Name': "Okay", "Func":"close", Color:'bg-slate-400'  },
        ]} />

        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/roles')}}/>
        </div>

        {/* Modify Role Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Modify Role</h4>

            <div className="flex flex-col gap-1">
                <label className="">Role Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_name} />
            </div>

            <div className="flex flex-col mt-5">
                <label>Privileges: </label>
                <div className="flex flex-wrap md:gap-x-32 sm:gap-x-10 gap-x-7 gap-y-2">
                {
                    data.id != 1 ? <>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Special User</label>
                        <ToggleButton Handle={[v_mSpecialUser, e_mSpecialUser]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Wizard</label>
                        <ToggleButton Handle={[v_mWizard, e_mWizard]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Wizard Rank</label>
                        <ToggleButton Handle={[v_mWizardRank, e_mWizardRank]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Word Library</label>
                        <ToggleButton Handle={[v_mWordLibrary, e_mWordLibrary]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Word Attributes</label>
                        <ToggleButton Handle={[v_mWordAttributes, e_mWordAttributes]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Roles</label>
                        <ToggleButton Handle={[v_mRoles, e_mRoles]} />
                    </div>
                    </>
                    : <>
                    <div className="text-sm text-slate-500">
                        You cannot change the privilege of the "Owner"-labeled role.
                    </div>
                    </>
                }

                </div>
            </div>

            <div className="mt-5 flex flex-wrap sm:gap-4 gap-2">
                <Button Name="Modify" Click={()=>{
                    if(
                        v_name == data.name &&
                        v_mSpecialUser == dataPrivileges['Manage Special User'] &&
                        v_mWizard == dataPrivileges['Manage Wizard'] &&
                        v_mWizardRank == dataPrivileges['Manage Wizard Rank'] &&
                        v_mWordLibrary == dataPrivileges['Manage Word Library'] &&
                        v_mWordAttributes == dataPrivileges['Manage Word Attributes'] &&
                        v_mRoles == dataPrivileges['Manage Roles']
                    ){
                        return false;
                    }e_popConfirmSubmit(true);
                }} />
                <Button Name="Reset" Click={()=>{
                    e_name(data.name);
                    e_mSpecialUser(dataPrivileges['Manage Special User']);
                    e_mWizard(dataPrivileges['Manage Wizard']);
                    e_mWizardRank(dataPrivileges['Manage Wizard Rank']);
                    e_mWordLibrary(dataPrivileges['Manage Word Library']);
                    e_mWordAttributes(dataPrivileges['Manage Word Attributes']);
                    e_mRoles(dataPrivileges['Manage Roles']);
                }} />
                {
                    data.id != 1 ? <>
                    <Button Name="Delete" Color="bg-red-500" Click={()=>{ e_popWarning(true); }}/>
                    </> : ""
                }
            </div>

        </form>

        {/* Pop */}
        <Pop Handle={[v_popWarning, e_popWarning]} Title="Delete Warning" Message="Do you really want to delete these role? Deleting this role will remove all accounts that have this role, are you sure?" Type="warning" Button={[
            {'Name': "Yes", "Func":()=>{e_popWarning(false); e_popConfirmDelete(true)}, Color:'bg-red-500'  },
            {'Name': "No! Of course not", "Func":"close", Color:'bg-slate-500'  },
        ]} />
        <Pop Handle={[v_popConfirmDelete, e_popConfirmDelete]} Title="Delete Confirmation" Message="Click yes to proceed?" Button={[
            {'Name': "YES!", "Func":()=>{router.post('/admin/dashboard/roles/delete/'+roleId); e_popConfirmDelete(false) }, Color:'bg-red-500'  },
            {'Name': "I've Changed my mind", "Func":"close", Color:'bg-slate-500'  },
        ]} />

        <Pop Handle={[v_popConfirmSubmit, e_popConfirmSubmit]} Title="Confirm Modification" Message={`Click "Yes" to modify the role.`} Type="notice" Button={[
            {
                Name: "Yes",
                "Func":()=>{
                    router.post('/admin/dashboard/roles/modify_submit/'+roleId, {
                        v_name:v_name,
                        v_mSpecialUser:v_mSpecialUser,
                        v_mWizard:v_mWizard,
                        v_mWizardRank:v_mWizardRank,
                        v_mWordLibrary:v_mWordLibrary,
                        v_mWordAttributes:v_mWordAttributes,
                        v_mRoles:v_mRoles,
                    }, {
                        onFinish: ()=>{
                            e_popLoading(false);
                        }
                    });
                    e_popConfirmSubmit(false);
                    e_popLoading(true);
                },
                Color:'bg-my-green'

            },
            {'Name': "Continue Editing", "Func":"close", Color:'bg-slate-500'  },
        ]} />
        <PopLoading Handle={[v_popLoading, e_popLoading]} />

    </AdminMainUI>
}
