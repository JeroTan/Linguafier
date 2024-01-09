//Utilities
import PagePlate from '../Utilities/PagePlate';
import Button from '../Utilities/Button';
import ImageFlash from '../Utilities/ImageFlash';
import Icon from '../Utilities/Icon';
import ListContainerV2 from '../Utilities/List/ListContainerV2';

//HOOKS
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

export default function Homepage() {
    //** Use Page */
    const { data, storageVariation, storageAttribute, variationData, attributeData, rarityData, languageData } = usePage().props;

    //**>> Use State */
    const [ v_search, e_search] = useState('');
    const [ v_sort, e_sort] = useState([
        {Name:"Name", Ref:"word.keyname", Sort:"ASC"},
        {Name:"Rarity", Ref:"rarity.name", Sort:"ASC"},
        {Name:"Level", Ref:"rarity.level", Sort:"ASC"},
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
    //**<< Use Effect */

    //**>> Functionality */
    function changeContents(){
        e_dataLoading(true);
        router.post('/dictionary/change_contents', { "v_search": v_search, 'v_sort':v_sort, "v_filter":v_filter  }, {
            onFinish:x=>{
                e_dataLoading(false);
            }
        });
    }
    const ItemPlate = useCallback(()=>{
        return data.data.map((x, i)=>{
            // Design for Name
            let t_Name = <div className='lg:w-64 md:w-52 sm:w-56 w-full shrink-0 grow'>
                <h3 className='text-xl text-my-green font-bold' style={{wordBreak: 'break-all',overflowWrap: 'break-word'}}>{x.keyname}</h3>
            </div>;
            // Design for Variation
            let variationData = JSON.parse(x.variation);
            let t_Variation = <div className='shrink relative'>
                <small className='absolute top-[-7px]'>
                    Variation:
                </small>
                <div className='flex flex-col gap-1 mt-3'>
                    {variationData.map((y, j)=>{
                        return <div key={j} className=' rounded border-2 border-slate-600 w-fit px-2 py-1 flex gap-2 items-center bg-slate-400 text-white'>
                            <ImageFlash Src={storageVariation+y.image} Size={`20px`} />
                            <small>{y.name}</small>
                        </div>
                    }) }
                </div>

            </div>
            // Design for Attribute
            let attributeData = JSON.parse(x.attributes);
            let t_Attribute = <div className='sm:w-full shrink relative'>
                <small className='absolute top-[-7px]'>
                    Attributes:
                </small>
                <div className='flex flex-wrap gap-1 mt-3'>
                    {attributeData.map((y, j)=>{
                        return <div key={j} className='rounded-full w-fit h-fit px-2 py-1 flex gap-2 items-center ' style={{backgroundColor: y.color}}>
                            <ImageFlash Src={storageAttribute+y.image} Size={`20px`} Round={`rounded-full`} />
                            <small className='text-white mix-blend-difference'>{y.name}</small>
                        </div>
                    }) }
                </div>
            </div>

            // Design for Rarity
            let t_Rarity = <div className='w-full shrink flex sm:flex-col sm:items-start items-center flex-wrap gap-1 sm:translate-y-0 translate-y-[-7px] sm:mb-0 mb-2'>
                <div className=''>
                    {x.rarity_name}<span className='sm:hidden inline'>:</span>
                </div>
                <div className='flex flex-wrap gap-1'>
                    { Array(x.rarity_level).fill(0).map((y,j)=>{
                        return <div key={j} className=''>
                            <Icon Name={'star'} OutClass={"w-5 h-5"} InStyle={{fill:x.rarity_color}} />
                        </div>
                    }) }
                </div>
            </div>

            // Design for Button
            let t_Button = <div className='sm:w-auto w-full flex flex-wrap sm:justify-normal justify-end pb-1 pr-1 sm:flex-col flex-row gap-2'>
                <Button Icon="eye" Size="w-fit h-fit" Padding="px-2 py-1" Click={()=>{
                    router.get(`/word/${x.id}`);
                }} />
            </div>
            return {
                wide:<div className='w-full flex sm:flex-nowrap flex-wrap lg:gap-4 gap-1 gap-y-0' key={i}>
                    {t_Name}
                    {t_Rarity}
                    {t_Variation}
                    {t_Attribute}
                    {t_Button}
                </div>,
                compact:<div className='w-full p-2 break-words text-center bg-zinc-100 hover:bg-slate-300 text-slate-700 h-full cursor-pointer' onClick={()=>{
                    router.get(`/word/${x.id}`);
                }}>
                    {x.keyname}
                </div>
            }
        });
    }, [data, data.data]);
    //**<< Functionality */

    //** Render */
    return <ThisPlate>
        {/* List Contents*/}
        <ListContainerV2
            Name="List of Words"
            Search={[v_search, e_search, changeContents]}
            Sort={[v_sort, e_sort]}
            Filter={[v_filter, e_filter]}
            Loading={[c_dataLoading, e_dataLoading]}
            Contents={ItemPlate()}
            Pagination={data}
        />
    </ThisPlate>
}

function ThisPlate({children}){
    return <>
        <Head>
            <title>Dictionary</title>
            <meta name="description" content="Dictionary page of Linguafier"/>
        </Head>
        <PagePlate>
            <div className='flex justify-center'>
            <div className='w-[90rem] px-2'>
                {children}
            </div>
            </div>

        </PagePlate>
    </>
}
