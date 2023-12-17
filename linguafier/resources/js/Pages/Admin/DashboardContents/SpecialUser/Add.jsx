// HOOKS
import { router, usePage } from "@inertiajs/react"


// UTILTIES
import AdminMainUI from "../../Utilities/AdminMainUI"
import Button from "../../../../Utilities/Button"
import Textbox from "../../../../Utilities/Textbox"
import TextboxDropDown from "../../../../Utilities/TextboxDropDown"
import ToggleButton from "../../../../Utilities/ToggleButton"
import PopFlash from "../../../../Utilities/PopFlash"
import PopLoading from "../../../../Utilities/PopLoading"

// HOOKS
import { useState } from "react"

export default()=>{
    //** Use Page */
    const { errors, roles } = usePage().props;

    //**>> Use State */
    const [v_username, e_username] = useState("");
    const [v_password, e_password] = useState("");
    const [v_role, e_role] = useState("");

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/special_user')}}/>
        </div>

        {/* Add Role Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Special user</h4>

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
                <Button Name="Create Account" Click={()=>{
                    router.post('/admin/dashboard/special_user/add_submit', {
                        v_username:v_username,
                        v_password:v_password,
                        v_role:v_role,
                    }, {
                        onFinish:()=>{
                            e_popLoading(false);
                        }
                    });
                    e_popLoading(true);
                }}/>
                <Button Name="Reset" Click={()=>{
                    e_username("");
                    e_password("");
                    e_role("");
                }}/>
            </div>
        </form>

        {/* POP */}
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/special_user'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":"close", Color:'bg-slate-400'  },
        ]}} />

    </AdminMainUI>
}
