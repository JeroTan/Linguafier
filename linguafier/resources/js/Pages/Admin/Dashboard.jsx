//Utilities
import TextBox from '../../Utilities/Textbox';
import Button from '../../Utilities/Button';
import Pop from '../../Utilities/Pop';
import PagePlate from '../../Utilities/PagePlate';
import SideNav from '../../Utilities/SideNav';

//Inertia / React
import { usePage } from '@inertiajs/react';


export default function Dashboard(){
    const { asset, popFlash } = usePage().props;

    return <PagePlate>
        <div className='flex md:flex-nowrap flex-wrap  max-w-[90rem] mx-auto p-10'>
            <SideNav/>
            <div className='shrink p-2'>
                dfdf Lorem ipsum dolor sit amet consectetur adipisicing elit. Id autem excepturi dolorem laboriosam harum repudiandae hic eligendi dicta cupiditate pariatur ad quibusdam sed a fugit, impedit aspernatur. Quae, quisquam obcaecati.
            </div>
        </div>
    </PagePlate>
};
