// UTILITIES
import AdminMainUI from "../../Utilities/AdminMainUI";
import Button from "../../../../Utilities/Button";

// HOOKS
import { useState } from "react";
import { router } from "@inertiajs/react";

export default ()=>{
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_attribution')}}/>
        </div>
        {/* Add Role Section */}
        <form className="mt-10">

        </form>
    </AdminMainUI>
}
