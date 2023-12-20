//Utilities
import Icon from '../../../Utilities/Icon';
import AdminMainUI from '../Utilities/AdminMainUI';
import Button from '../../../Utilities/Button';
import ListContainer from '../../../Utilities/List/ListContainer';
import Pop from '../../../Utilities/Pop';
import PopFlash from '../../../Utilities/PopFlash';
import PopLoading from '../../../Utilities/PopLoading';

//HOOKS
import { Fragment, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default ()=>{
    //** Use Page */
    const { data, } = usePage().props;

    //** STRUCT */
    let d_pageSwitch = [
        'Variation',
        'Attribute',
        'Rarity',
        'Language',
    ];

    //**>> Use State */
    const [c_pageSwitch, e_pageSwitch] = useState("Variation");

    const [v_search, e_search] = useState('');
    const [v_sort, e_sort] = useState([]);
    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popLoading, e_popLoading] = useState('');
    const [v_popFlash, e_popFlash] = useState('');
    const [v_selectId, e_selectId] = useState('');
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

    }
    function ItemPlate(){
        if(data == undefined)
            return [];
        return data.data.map((x, i)=>{
            let t_Name = <div className='sm:w-64 w-full shrink-0 grow'>
                <h3 className='text-xl text-my-green font-bold'>{x.name}</h3>
            </div>;
            let t_Image;
            if(c_pageSwitch == "Variation" || c_pageSwitch == "Attribute"){
                t_Image = <div className='w-full shrink flex flex-wrap gap-1'>
                    <div className='min-w-[10rem] aspect-square rounded border-2 relative' style={{border: 'black'}}>
                        <img className='relative w-full h-full object-contain' src='https://db.pokemongohub.net/images/icons/Badge_27.png' />
                    </div>
                </div>
            }
            let t_Rarity;
            if(c_pageSwitch == "Rarity"){
                t_Rarity = <div className='w-full shrink flex flex-wrap gap-1'>
                    <div className='flex flex-wrap gap-1'>
                        { Array(x.level).fill(0).map((y,j)=>{
                            let InClass = "fill-my-green";
                            if(3 < x.level && x.level <= 7){
                                InClass = "fill-my-yellow";
                            }else if(7 < x.level  && x.level <= 10){
                                InClass = "fill-red-500";
                            }else if(10 < x.level){
                                InClass = "fill-purple-500";
                            }
                            return <div key={j} className=''>
                                <Icon Name={'star'} OutClass={"w-5 h-5"} InClass={InClass} />
                            </div>
                        }) }
                    </div>
                </div>
            }
            let t_Button = <div className='flex flex-wrap pb-1 pr-1 flex-col gap-2'>
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
                    e_popPick('WarningDelete'+c_pageSwitch);
                    e_selectId(x.id);
                }} />
            </div>
            return <div className='w-full flex sm:flex-nowrap flex-wrap' key={i}>
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
    //**<< Functionality */

    //** Render */
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            {d_pageSwitch.map((x, i)=>{
                    return <Button key={i} Name={x} Color={buttonColor(x)} TextColor={buttonTextColor(x)} Disabled={buttonPWD(x)} Click={()=>e_pageSwitch(x)}/>
                })
            }
        </div>

        {/* List Contents*/}
        <ListContainer Name="List of System User" Search={[v_search, e_search, changeContents]} Sort={[v_sort, e_sort]} OtherButtons={addButton()}  Contents={ItemPlate()} />

    </AdminMainUI>
}
