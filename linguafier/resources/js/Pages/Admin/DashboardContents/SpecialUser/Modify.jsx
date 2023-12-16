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

export default()=>{
    //** Use Page */
    const { errors } = usePage().props;

    //**>> Use State */
    const [v_usernname, e_usernname] = useState("");
    const [v_password, e_password] = useState("");
    const [v_role_id, e_role_id] = useState("");

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/special_user')}}/>
        </div>



    </AdminMainUI>
}
