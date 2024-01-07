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
    const { data, storageVariation, storageAttribute, pgsw } = usePage().props;

    //** STRUCT */
    let d_pageSwitch = [
        'Variation',
        'Attribute',
        'Rarity',
        'Language',
    ];
    const popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this? Are you sure?",
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
                    let deleteWhere = {
                        Variation:"delete_variation",
                        Attribute:"delete_attribute",
                        Rarity:"delete_rarity",
                        Language:"delete_language",
                    }
                    router.post(`/admin/dashboard/word_attribution/${deleteWhere[c_pageSwitch]}/${v_selectId}`,{},{
                        onFinish:()=>{e_popLoading(false); changeContents()}
                    });
                    e_popLoading(true);
                    e_popSwitch(false);
                }, Color:'bg-red-500'  },
                {'Name': "I've Changed my mind", "Func":"close", Color:'bg-slate-500'  },
            ]
        },
    }

    //**>> Use State */
    const [c_pageSwitch, e_pageSwitch] = useState(pgsw ?? "Variation");
    const [v_search, e_search] = useState('');
    const [v_sort, e_sort] = useState([]);

    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popLoading, e_popLoading] = useState('');
    const [v_popFlash, e_popFlash] = useState('');

    const [v_selectId, e_selectId] = useState('');

    const [c_dataLoading, e_dataLoading] = useState(false);
    //**<< Use State */

    //**>> Use Effect */
    useEffect(()=>{
        const sortData = {
            Variation:[
                { Name:"Variation Name", Ref:"name", Sort:"ASC"},
            ],
            Attribute:[
                { Name:"Attribute Name", Ref:"name", Sort:"ASC" },
            ],
            Rarity:[
                { Name:"Rarity Name", Ref:"name", Sort:"ASC" },
                { Name:"Level", Ref:"level", Sort:"ASC" }
            ],
            Language:[
                { Name:"Name", Ref:"name", Sort:"ASC" },
            ]
        }
        e_sort(sortData[c_pageSwitch]);

    }, [c_pageSwitch]);
    useEffect(()=>{
        const debouncer = setTimeout(()=>{
            changeContents();
        }, 500);
        return ()=>clearTimeout(debouncer);
    }, [v_search]);
    useEffect(()=>{
        changeContents();
    }, [v_sort]);
    useEffect(()=>{ //Stop the Loading Animation if the Render of data is done
        e_dataLoading(false);
    }, [data.data]);

    //**<< Use Effect */

    //**>> Functionality */
    function buttonColor(name){
        return c_pageSwitch == name ? "bg-my-yellow" : undefined
    }
    function buttonTextColor(name){
        return c_pageSwitch == name ? "text-black" : undefined
    }
    function buttonPWD(name){
        return c_pageSwitch == name ? true : undefined
    }
    function changeContents(){
        e_dataLoading(true);
        router.post('/admin/dashboard/word_attribution/changeContents', {"c_pageSwitch":c_pageSwitch, "v_search": v_search, 'v_sort':v_sort,}, );
    }
    function ItemPlate(){
        return data.data.map((x, i)=>{
            // Design for Name
            let t_Name = <div className='sm:w-64 w-full shrink-0 grow'>
                <h3 className='text-xl text-my-green font-bold'>{x.name}</h3>
            </div>;
            // Design for Image
            let t_Image;
            if(c_pageSwitch == "Variation" || c_pageSwitch == "Attribute"){
                let imageLink = (c_pageSwitch == "Variation" ? storageVariation : storageAttribute) + x.image;
                let outlineLink = (c_pageSwitch == "Variation" ? true : x.color);
                t_Image = <div className='w-full shrink flex flex-wrap gap-1'>
                    <ImageFlash Src={imageLink} Outline={outlineLink} Pop={true} Active={true} Border={true} />
                </div>
            }
            // Design for Rarity
            let t_Rarity;
            if(c_pageSwitch == "Rarity"){
                t_Rarity = <div className='w-full shrink flex flex-wrap gap-1'>
                    <div className='flex flex-wrap gap-1'>
                        { Array(x.level).fill(0).map((y,j)=>{
                            return <div key={j} className=''>
                                <Icon Name={'star'} OutClass={"w-5 h-5"} InStyle={{fill:x.color}} />
                            </div>
                        }) }
                    </div>
                </div>
            }
            let t_Button = <div className='sm:w-auto w-full flex flex-wrap sm:justify-normal justify-end pb-1 pr-1 sm:flex-col flex-row gap-2'>
                <Button Icon="edit" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                    const where = {
                        Variation:"variation",
                        Attribute:"attribute",
                        Rarity:"rarity",
                        Language:"language",
                    }
                    router.get(`/admin/dashboard/word_attribution/modify_${where[c_pageSwitch]}/${x.id}`);
                }} />
                <Button Icon="delete" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                    e_popSwitch(true);
                    e_popPick('WarningDelete');
                    e_selectId(x.id);
                }} />
            </div>
            return <div className='w-full flex sm:flex-nowrap flex-wrap gap-1' key={i}>
                {t_Name}
                {t_Image}
                {t_Rarity}
                {t_Button}
            </div>
        });
    }
    function addButton(){
        return [
            <Button Name={`Add New`} Icon={`add`} Click={()=>{
                switch(c_pageSwitch){
                    case 'Variation':
                        router.get('/admin/dashboard/word_attribution/add_variation');
                    break;
                    case 'Attribute':
                        router.get('/admin/dashboard/word_attribution/add_attribute');
                    break;
                    case 'Rarity':
                        router.get('/admin/dashboard/word_attribution/add_rarity');
                    break;
                    case 'Language':
                        router.get('/admin/dashboard/word_attribution/add_language');
                    break;
                };
            }}/>
        ]
    }
    function pageSwitch(event, name){
        changeContents();
        e_pageSwitch(name);
    }
    //**<< Functionality */

    //** Render */
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            {d_pageSwitch.map((x, i)=>{
                    return <Button key={i} Name={x} Color={buttonColor(x)} TextColor={buttonTextColor(x)} Disabled={buttonPWD(x)} Click={(e)=>pageSwitch(e, x)}/>
                })
            }
        </div>

        {/* List Contents*/}
        <ListContainer
            Name="List of System User"
            Search={[v_search, e_search, changeContents]}
            Sort={[v_sort, e_sort]}
            OtherButtons={addButton()}
            Loading={[c_dataLoading, e_dataLoading]}
            Contents={ItemPlate()}
            Pagination={{...data, add_get:['pgsw='+c_pageSwitch] }}
        />

        {/* Pop */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopFlash Button={{0:[
            {'Name': "Got it", "Func":"close", Color:'bg-slate-400' },
        ]}} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />

    </AdminMainUI>
}
