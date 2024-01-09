//Utilities
import PagePlate from '../Utilities/PagePlate';

//HOOKS
import { Head } from '@inertiajs/react';


export default function Homepage() {
    return <>
        <Head>
            <title>Study</title>
            <meta name="description" content="Study page of Linguafier"/>
        </Head>
        <PagePlate>
            <div className='flex justify-center'>
                <div className='w-[90rem]'>
                    <h1 className='font-bold text-5xl pt-10'>
                        Coming Soon
                    </h1>
                </div>
            </div>
        </PagePlate>
    </>
}
