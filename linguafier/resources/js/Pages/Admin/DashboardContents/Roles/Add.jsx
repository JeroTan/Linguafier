// HOOKS
import { router, usePage } from "@inertiajs/react"


// UTILTIES
import AdminMainUI from "../../Utilities/AdminMainUI"
import Button from "../../../../Utilities/Button"
import Textbox from "../../../../Utilities/Textbox"
import ToggleButton from "../../../../Utilities/ToggleButton"
import PopFlash from "../../../../Utilities/PopFlash"
import PopLoading from "../../../../Utilities/PopLoading"

// HOOKS
import { useState } from "react"

export default function AddRoles(){
    //**>> Use State */
    const [v_name, e_name] = useState("");
    const [v_mSpecialUser, e_mSpecialUser] = useState(false);
    const [v_mWizard, e_mWizard] = useState(false);
    const [v_mWizardRank, e_mWizardRank] = useState(false);
    const [v_mWordLibrary, e_mWordLibrary] = useState(false);
    const [v_mWordAttributes, e_mWordAttributes] = useState(false);
    const [v_mRoles, e_mRoles] = useState(false);

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    //** Use Page */
    const { errors } = usePage().props;

    return <AdminMainUI>
        {/* Flash */}
        <PopFlash Handle={[v_popFlash, e_popFlash]} Button={[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/roles'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":"close", Color:'bg-slate-400'  },
        ]} />

        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/roles')}}/>
        </div>

        {/* Add Role Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Role</h4>

            <div className="flex flex-col gap-1">
                <label className="">Role Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_name} />
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
                        <ToggleButton Handle={[v_mWordAttributes, e_mWordAttributes]} />
                    </div>
                    <div className="flex gap-1 items-center">
                        <label className="text-sm text-slate-500">Manage Roles</label>
                        <ToggleButton Handle={[v_mRoles, e_mRoles]} />
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Create Role" Click={()=>{
                    router.post('/admin/dashboard/roles/create', {
                        v_name:v_name,
                        v_mSpecialUser:v_mSpecialUser,
                        v_mWizard:v_mWizard,
                        v_mWizardRank:v_mWizardRank,
                        v_mWordLibrary:v_mWordLibrary,
                        v_mWordAttributes:v_mWordAttributes,
                        v_mRoles:v_mRoles,
                    }, {
                        onSuccess:()=>{
                            e_popLoading(false);
                        }
                    });
                    e_popLoading(true);
                }}/>
                <Button Name="Reset" Click={()=>{
                    e_name("");
                    e_mSpecialUser(false);
                    e_mWizard(false);
                    e_mWizardRank(false);
                    e_mWordLibrary(false);
                    e_mWordAttributes(false);
                    e_mRoles(false);
                }}/>
            </div>
        </form>

        {/* POP */}
        <PopLoading Handle={[v_popLoading, e_popLoading]} />

    </AdminMainUI>
}
