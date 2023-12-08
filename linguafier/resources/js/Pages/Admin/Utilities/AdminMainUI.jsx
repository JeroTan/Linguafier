// UTILITIES
import PagePlate from '../../../Utilities/PagePlate';
import SideNav2 from './SideNav2';

// HOOKS
import { usePage } from '@inertiajs/react';

export default function AdminMainUI(Body){
    const { adminPage } = usePage().props;

    return <PagePlate>
        <div className='flex md:flex-nowrap flex-wrap lg:gap-4 gap-3 py-10 px-2 max-w-[90rem] mx-auto '>
            <SideNav2 Select={adminPage} />
            <div className='shrink w-full'>
                <main className='shrink border-2 p-2 border-black rounded-md'>
                    {Body.children}
                </main>
            </div>
        </div>
    </PagePlate>
}
