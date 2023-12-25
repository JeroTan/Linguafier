//Utilities
import Icon from '../../../Utilities/Icon';
import ListContainer from '../../../Utilities/List/ListContainer';
import Button from '../../../Utilities/Button';
import AdminMainUI from '../Utilities/AdminMainUI';
import PopFlash from '../../../Utilities/PopFlash';
import Pop from '../../../Utilities/Pop';
import PopLoading from '../../../Utilities/PopLoading';

// HOOKS
import { Fragment, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default ()=>{
    //** STRUCT */
    const popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this account? Are you sure?",
            Type: "warning",
            Button: [
                {'Name': "Yes", "Func":()=>{e_popPick('ConfirmDelete');}, Color:'bg-red-500'  },
                {'Name': "No! Of course not", "Func":"close", Color:'bg-slate-500'  },
            ],
        },
        ConfirmDelete:{
            Title: "Delete Confirmation",
            Message: "Click Yes to proceed?",
            Type: "notice",
            Button: [
                {'Name': "YES!", "Func":()=>{
                    router.post('/admin/dashboard/special_user/delete/'+v_selectId,{},{
                        onFinish:()=>e_popLoading(false)
                    });
                    e_popLoading(true);
                    e_popSwitch(false);
                }, Color:'bg-red-500'  },
                {'Name': "I've Changed my mind", "Func":"close", Color:'bg-slate-500'  },
            ]
        },
    }

    //** Use Page */
    const { data, specialAccount, roles } = usePage().props;
    let rolesData = roles.map((x)=>({Name:x.name, Ref:x.id, Value:false}));

    //** Use State */
    const [ v_search, e_search] = useState("");
    const [ v_sort, e_sort] = useState([
        {Name:"Username", Ref:"username", Sort:"ASC"},
        {Name:"Role", Ref:"rolename", Sort:"ASC"},
        {Name:"Created", Ref:"created_time", Sort:"ASC"},
        {Name:"Modified", Ref:"modified_time", Sort:"ASC"},
    ]);
    const [ v_filter, e_filter] = useState([
        {
            Name: "Roles",
            Ref:"role.name",
            Type:"checklist",
            Data:rolesData,
        },
        {
            Name: "Created Date",
            Ref:"created_time",
            Type:"range_date",
            Data:{Min:false,Max:false,}
        },
        {
            Name: "Modified Date",
            Ref:"modified_time",
            Type:"range_date",
            Data:{Min:false,Max:false,}
        },
    ]);
    const [ v_popSwitch, e_popSwitch] = useState(false);
    const [ v_popPick, e_popPick]= useState("WarningDelete");
    const [ v_popLoading, e_popLoading] = useState(false);
    const [ v_selectId, e_selectId] = useState("");

    //** Use Effect */
    useEffect(()=>{
        const debouncer = setTimeout(()=>{
            changeContents();
        }, 500);
        return ()=>clearTimeout(debouncer);
    }, [v_search]);
    useEffect(()=>{
        changeContents();
    }, [v_sort, v_filter]);

    //** Functionality */
    function changeContents(){//Request of contents
        router.post('/admin/dashboard/special_user/changeContents', {"v_search": v_search, 'v_sort':v_sort, 'v_filter':v_filter});
    }
    function ItemPlate(){ //Item design of Item List
        let plate = [];
        let pageData = data.data;
        for(let i = 0; i < pageData.length; i++){
            let x = pageData[i];
            plate[i] = <Fragment>
            <div className='w-full flex sm:flex-nowrap flex-wrap'>
                <div className='sm:w-64 w-full shrink-0 grow'>
                    <div className='flex items-center gap-1'>
                        <h3 className='text-xl text-my-green font-bold'>{x.username}</h3>
                        { x.id == 1 ? <Icon Name="crown" OutClass="w-5 h-5" InClass="fill-my-green"/> : "" }
                        { x.id == specialAccount.id ? <small className='italic'>You</small> : ""}
                    </div>
                </div>
                <div className='w-full shrink flex flex-wrap gap-1'>
                    <small className='rounded w-2 h-2 mt-2 bg-green-400'></small>
                    <h3 className='text-xl text-slate-700'>{x.rolename}</h3>
                </div>
                <div className='w-full shrink flex flex-col gap-1'>
                    <small><span className='text-yellow-500'>Created:</span> {x.created_time}</small>
                    <small><span className='text-orange-500'>Modified:</span> {x.modified_time}</small>
                </div>
                <div className='flex flex-wrap pb-1 pr-1 flex-col gap-2'>
                    { !(x.id == 1 || x.id == specialAccount.id)  ? <>
                        <Button Icon="edit" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                            router.get('/admin/dashboard/special_user/modify/'+x.id);
                        }} />
                        <Button Icon="delete" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                            e_popSwitch(true);
                            e_popPick('WarningDelete');
                            e_selectId(x.id);
                        }} />
                    </>

                    : "" }
                </div>
            </div>
            </Fragment>
        }
        return plate;
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add a System User" Icon={`add`} Click={()=>{router.get('/admin/dashboard/special_user/add')}}/>
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of System User" Search={[v_search, e_search, changeContents]} Sort={[v_sort, e_sort]} Filter={[v_filter, e_filter]} OtherButtons={[]}  Contents={ItemPlate()} />

        {/* Pop */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopFlash Button={{0:[
            {'Name': "Got it", "Func":"close", Color:'bg-slate-400' },
        ]}} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />

    </AdminMainUI>
}
