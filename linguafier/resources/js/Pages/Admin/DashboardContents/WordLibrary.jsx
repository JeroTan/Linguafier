//Utilities
import Icon from '../../../Utilities/Icon';
import AdminMainUI from '../Utilities/AdminMainUI';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import Pop from '../../../Utilities/Pop';
import PopFlash from '../../../Utilities/PopFlash';
import PopLoading from '../../../Utilities/PopLoading';
import ImageFlash from '../../../Utilities/ImageFlash';

//HOOKS
import { Fragment, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default ()=>{
    //** Use Page */
    const { data, storageWord, variationData, attributeData, rarityData, languageData } = usePage().props;

    //** STRUCT */
    const popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this word? Are you sure?",
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
                    router.post(`/admin/dashboard/word_library/delete/${v_selectId}`,{},{
                        onFinish:()=>e_popLoading(false)
                    });
                    e_popLoading(true);
                    e_popSwitch(false);
                }, Color:'bg-red-500'  },
                {'Name': "I've Changed my mind", "Func":"close", Color:'bg-slate-500'  },
            ]
        },
    }

    //**>> Use State */
    const [v_search, e_search] = useState('');
    const [ v_sort, e_sort] = useState([
        {Name:"Name", Ref:"word.keyname", Sort:"ASC"},
        {Name:"Rarity", Ref:"rarity_name", Sort:"ASC"},
        {Name:"Level", Ref:"rarity_level", Sort:"ASC"},
        {Name:"Created", Ref:"word.created_time", Sort:"ASC"},
        {Name:"Modified", Ref:"word.modified_time", Sort:"ASC"},
    ]);
    const [ v_filter, e_filter] = useState([
        {
            Name: "Checklist",
            Ref:"word.variation",
            Type:"checklist",
            Data:variationData.map((x)=>({Name:x.name, Ref:x.id, Value:false})) ?? [],
        },
        {
            Name: "Rarity Level",
            Ref:"rarity.level",
            Type:"range",
            Data:{Min:false,Max:false,Limit:[0, 100]}
        },
        {
            Name: "Rarity Name",
            Ref:"rarity.name",
            Type:"checklist",
            Data:rarityData.map((x)=>({Name:x.name, Ref:x.id, Value:false})) ?? [],
        },
        {
            Name: "Attributes",
            Ref:"word.attributes",
            Type:"checklist",
            Data:attributeData.map((x)=>({Name:x.name, Ref:x.id, Value:false})) ?? [],
        },
        {
            Name: "Language",
            Ref:"language.name",
            Type:"checklist",
            Data:languageData.map((x)=>({Name:x.name, Ref:x.id, Value:false})) ?? [],
        },

        {
            Name: "Modified Time",
            Ref:"word.modified_time",
            Type:"range_date",
            Data:{Min:false,Max:false,}
        },
        {
            Name: "Created Time",
            Ref:"word.created_time",
            Type:"range_date",
            Data:{Min:false,Max:false,}
        },
    ]);

    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popLoading, e_popLoading] = useState('');
    const [v_popFlash, e_popFlash] = useState('');

    const [v_selectId, e_selectId] = useState('');

    const [c_dataLoading, e_dataLoading] = useState(true);
    //**<< Use State */

    //**>> Use Effect */
    useEffect(()=>{
        const debouncer = setTimeout(()=>{
            changeContents();
        }, 500);
        return ()=>clearTimeout(debouncer);
    }, [v_search]);
    useEffect(()=>{
        changeContents();
    }, [v_sort, v_filter]);
    useEffect(()=>{ //Stop the Loading Animation if the Render of data is done
        e_dataLoading(false);
    }, [data.data]);
    //**<< Use Effect */

    //**>> Functionality */
    function changeContents(){
        e_dataLoading(true);
        router.post('/admin/dashboard/word_library/changeContents', { "v_search": v_search, 'v_sort':v_sort, "v_filter":v_filter  }, );
    }
    function ItemPlate(){
        return [];
    }
    //**<< Functionality */

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button Name="Add a Word" Icon={`add`} Click={()=>{router.get('/admin/dashboard/word_library/add')}}/>
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of Words" Search={[v_search, e_search, changeContents]} Sort={[v_sort, e_sort]} Filter={[v_filter, e_filter]} Loading={[c_dataLoading, e_dataLoading]} Contents={ItemPlate()} />

        {/* Pop */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopFlash Button={{0:[
            {'Name': "Got it", "Func":"close", Color:'bg-slate-400' },
        ]}} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
    </AdminMainUI>
}
