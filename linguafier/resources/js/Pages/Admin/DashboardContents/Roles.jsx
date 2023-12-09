//Utilities
import Icon from '../../../Utilities/Icon';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import AdminMainUI from '../Utilities/AdminMainUI';

//HOOKS
import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default ()=>{
    //** Use State */
    const [v_search, e_search] = useState("");
    const [v_contents, e_contents] = useState([]);


    //** Use Effect */
    useEffect(()=>{
        router.visit('/admin/dashboard/roles/getContents', {
            method: 'get',
            data: {},
            replace: true,
            preserveState: true,
            preserveScroll: true,
            only: [],
            headers: {'Accept': 'application/json',},
            errorBag: null,
            forceFormData: true,
            headers: {},
            onCancel: () => {},
            onBefore: visit => {},
            onStart: visit => {},
            onProgress: progress => {console.log(progress)},
            onSuccess: page=>{
                console.log(page.props);
            },
            onFinish: page=>{
                console.log(page.props);
            }

        });

    }, [v_search]);

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add Roles" Icon={`add`}/>
        </div>

        <Button Name="Load" Click={()=>{
router.visit('/admin/dashboard/roles/getContents', {
    method: 'get',
    data: {},
    replace: true,
    preserveState: true,
    preserveScroll: true,
    only: [],
    headers: {'Accept': 'application/json',},
    errorBag: null,
    forceFormData: true,
    headers: {},
    onCancel: () => {},
    onBefore: visit => {},
    onStart: visit => {},
    onProgress: progress => {console.log(progress)},
    onSuccess: page=>{
        console.log(page.props);
    },
    onFinish: page=>{
        console.log(page.props);
    }

});
        }}/>

        {/* List Contents*/}
        <ListContainer Search={[v_search, e_search]} ButtonProps={{}} OtherButtons={[]} Contents={v_contents} />


    </AdminMainUI>
}
