import { Head } from '@inertiajs/react';
//Hooks
import { useForm, usePage, router } from "@inertiajs/react";
import { useState } from 'react';

//Utilities
import TextBox from '../../Utilities/Textbox';
import Button from '../../Utilities/Button';
import PagePlate from '../../Utilities/PagePlate';

//CreateContext


export default function Login(){
    //** Use State */
    // v = view and e = edit
    const [v_username, e_username] = useState('');
    const [v_password, e_password] = useState('');

    //** Use Page */
    const { errors } = usePage().props;


    //** Functionaility */
    function submit(e){
        e.preventDefault();
        router.post('/admin/loginVerified', {
            'v_username':v_username,
            'v_password':v_password,
        });
    }

    //** Page */
    return <PagePlate clean={true}>

    <main className='w-full h-screen flex justify-center items-center'>

        <form className='w-96 rounded-xl bg-my-yellow shadow-myBox overflow-hidden' onSubmit={submit}>
            <div className='w-fit py-2 px-6 rounded-ee-3xl bg-zinc-500'>
                <h5 className="text-3xl text-my-yellow"><span className='text-black'>ADMIN</span> REALM</h5>
            </div>
            <div className='mt-10 px-10'>
                <label>Magic <span className='text-my-green font-semibold'>Username</span> </label>
                <TextBox Handle={[v_username, e_username]} Error={errors.v_username} Placeholder="Type here"/>

                <div className='py-2'></div>
                <label>State your <span className='text-my-green font-semibold'>Password</span> </label>
                <TextBox Type="password" Handle={[v_password, e_password]} Error={errors.v_password} Placeholder="Type here"/>
            </div>
            <div className='my-8 w-full flex justify-center'>
                <Button Type="submit" Name="Login To Realm" />
            </div>
        </form>

    </main>

    </PagePlate>
}
