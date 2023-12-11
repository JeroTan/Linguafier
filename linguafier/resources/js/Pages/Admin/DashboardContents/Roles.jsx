//Utilities
import Icon from '../../../Utilities/Icon';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import AdminMainUI from '../Utilities/AdminMainUI';
import Pop from '../../../Utilities/Pop';
import PopFlash from '../../../Utilities/PopFlash';

//HOOKS
import { useEffect, useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';

export default ()=>{
    //** Use Page */
    const { data } = usePage().props;

    //** Use State */
    const [v_search, e_search] = useState("");
    const [v_popWarning, e_popWarning] = useState(false);
    const [v_popConfirmDelete, e_popConfirmDelete] = useState(false);
    const [selectedRoleId, set_selectedRoleId] = useState("");

    //** Use Ref */


    //** Use Effect */
    useEffect(()=>{
        const debouncer = setTimeout(()=>{
            changeContents();
        }, 500);
        return ()=>clearTimeout(debouncer);
    }, [v_search]);



    //**<| Functionality */
    function ItemPlate(){ //Item design of Item List
        let plate = [];
        if(data.length < 1)
            return plate;

        for(let i = 0; i < data.length; i++){
            let name = data[i].name;
            let privilege = JSON.parse(data[i].privilege);
            plate[i] = <div className='w-full flex sm:flex-nowrap flex-wrap'>
                <div className='sm:w-64 w-full shrink-0 grow'>
                    <div className='flex items-center gap-1'>
                        <h3 className='text-xl text-my-green font-bold'>{name}</h3>
                        { data[i].id == 1 ? <Icon Name="crown" OutClass="w-5 h-5" InClass="fill-my-green"/> : "" }
                    </div>
                </div>
                <div className='w-full shrink flex flex-col'>
                    <small className='mb-[-5px]'>
                        Privileges
                    </small>
                    <ul className='flex flex-wrap gap-x-10'>
                    { Object.keys(privilege).map((x, j)=>{
                        if(privilege[x]){
                            return <li key={j} className='font-semibold text-slate-500'>{x}</li>
                        }
                    }) }
                    </ul>

                </div>
                <div className='flex flex-wrap pb-1 pr-1 flex-col gap-2'>
                    <Button Icon="edit" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                        router.get('/admin/dashboard/roles/modify/'+data[i].id);
                    }} />
                    { data[i].id != 1 ? <Button Icon="delete" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                        e_popWarning(true);
                        set_selectedRoleId(data[i].id);
                    }} /> : "" }
                </div>
            </div>
        }

        return plate;
    }
    function changeContents(){//Request of contents
        router.post('/admin/dashboard/roles/changeContents', {"v_search": v_search});
    }
    //** Functionality |>*/

    //** Render */
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add Roles" Icon={`add`} Click={()=>{router.get('/admin/dashboard/roles/add')}}/>
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of Roles" Search={[v_search, e_search, changeContents]} ButtonProps={{}} OtherButtons={[]} Contents={ItemPlate()} />

        {/* Pop */}
        <Pop Handle={[v_popWarning, e_popWarning]} Title="Delete Warning" Message="Do you really want to delete these role? Deleting this role will remove all accounts that have this role, are you sure?" Type="warning" Button={[
            {'Name': "Yes", "Func":()=>{e_popWarning(false); e_popConfirmDelete(true)}, Color:'bg-red-500'  },
            {'Name': "No! Of course not", "Func":"close", Color:'bg-slate-500'  },
        ]} />
        <Pop Handle={[v_popConfirmDelete, e_popConfirmDelete]} Title="Delete Confirmation" Message="Click Yes to proceed?" Button={[
            {'Name': "YES!", "Func":()=>{router.post('/admin/dashboard/roles/delete/'+selectedRoleId); e_popConfirmDelete(false) }, Color:'bg-red-500'  },
            {'Name': "I've Changed my mind", "Func":"close", Color:'bg-slate-500'  },
        ]} />
        <PopFlash Button={[
            {'Name': "Got it", "Func":"close", Color:'bg-slate-400' },
        ]} />
    </AdminMainUI>
}
