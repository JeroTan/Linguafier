// HOOKS
import { router } from "@inertiajs/react"

// UTILTIES
import AdminMainUI from "../../Utilities/AdminMainUI"
import Button from "../../../../Utilities/Button"
import Textbox from "../../../../Utilities/Textbox"
import ToggleButton from "../../../../Utilities/ToggleButton"
import { useState } from "react"

export default function AddRoles(){
    //** Use State */
    const [v_name, e_name] = useState("");

    const [v_mSpecialUser, e_mSpecialUser] = useState(false);
    const [v_mWizard, e_mWizard] = useState(false);
    const [v_mWizardRank, e_mWizardRank] = useState(false);
    const [v_mWordLibrary, e_mWordLibrary] = useState(false);
    const [v_mWordAttribute, e_mWordAttribute] = useState(false);
    const [v_mRole, e_mRole] = useState(false);


    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/roles')}}/>
        </div>

        {/* Add Role Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Role</h4>

            <div className="flex flex-col gap-1">
                <label className="">Role Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." />
            </div>

            <div className="flex flex-col mt-5">
                <label>Privileges: </label>
                <div className="flex flex-wrap md:gap-x-32 sm:gap-x-10 gap-x-7 gap-y-2">
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
                        <ToggleButton Handle={[v_mWordAttribute, e_mWordAttribute]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Roles</label>
                        <ToggleButton Handle={[v_mRole, e_mRole]} />
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Create Role"/>
                <Button Name="Reset"/>
            </div>
        </form>


    </AdminMainUI>
}
