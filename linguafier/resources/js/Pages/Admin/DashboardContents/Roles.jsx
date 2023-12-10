//Utilities
import Icon from '../../../Utilities/Icon';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import AdminMainUI from '../Utilities/AdminMainUI';

//HOOKS
import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default ()=>{
    //** Use Page */
    const { data } = usePage().props;

    //** Use State */
    const [v_search, e_search] = useState("");


    //** Use Effect */
    useEffect(()=>{
        const debouncer = setTimeout(()=>{
            changeContents();
        }, 500);
        return ()=>clearTimeout(debouncer);
    }, [v_search]);



    // Functionality
    function ItemPlate(){ //Item design of Item List
        let plate = [];
        if(data.length < 1)
            return plate;

        for(let i = 0; i < data.length; i++){
            let name = data[i].name;
            let privilege = JSON.parse(data[i].privilege);
            plate[i] = <div className='w-full flex sm:flex-nowrap flex-wrap'>
                <div className='sm:w-64 w-full shrink-0 grow'>
                    <h3 className='text-xl text-my-green font-bold'>{name}</h3>
                </div>
                <div className='w-full shrink flex flex-col'>
                    <small className='mb-[-5px]'>
                        Privileges
                    </small>
                    <ul className='flex flex-wrap gap-x-10'>
                    { Object.keys(privilege).map((x, j)=>{
                        return <li key={j} className='font-semibold text-slate-400'>{x}</li>
                    }) }
                    </ul>

                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button Icon="edit" Size="w-fit h-fit" Padding="px-2 py-1" />
                    <Button Icon="delete" Size="w-fit h-fit" Padding="px-2 py-1" />
                </div>
            </div>
        }

        return plate;
    }
    function changeContents(){//Request of contents
        router.post('/admin/dashboard/roles/changeContents', {"v_search": v_search});
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add Roles" Icon={`add`} Click={()=>{router.get('/admin/dashboard/roles/add')}}/>
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of Roles" Search={[v_search, e_search, changeContents]} ButtonProps={{}} OtherButtons={[]} Contents={ItemPlate()} />


    </AdminMainUI>
}
