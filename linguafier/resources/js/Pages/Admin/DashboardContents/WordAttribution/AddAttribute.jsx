// UTILITIES
import AdminMainUI from "../../Utilities/AdminMainUI";
import Button from "../../../../Utilities/Button";
import PopFlash from "../../../../Utilities/PopFlash";
import PopLoading from "../../../../Utilities/PopLoading";
import FIleInput from "../../../../Utilities/FileInput";
import Textbox from "../../../../Utilities/Textbox";
import ColorPicker from "../../../../Utilities/ColorPicker";

// HOOKS
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default ()=>{

    //** Use Page */
    const { errors } = usePage().props;

    //** Use State */
    const [v_name, e_name] = useState("");
    const [v_image, e_image] = useState("");
    const [v_color, e_color] = useState("");

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_attribution')}}/>
        </div>
        {/* Add Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Word Attribute</h4>

            <div className="flex flex-col gap-1">
                <label className="">Name: </label>
                <Textbox Handle={[v_name, e_name]} Size="sm:ml-3 w-96" Placeholder="Type here. . ." Error={errors.v_name} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-col gap-1">
                <label className="">Image: </label>
                <FIleInput Handler={[v_image, e_image]} Error={errors.v_image} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-col gap-1">
                <label className="">Color: </label>
                <ColorPicker Handle={[v_color, e_color]} />
            </div>

        </form>

        {/* POP */}
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/word_attribution'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":"close", Color:'bg-slate-400'  },
        ]}} />
    </AdminMainUI>

}
