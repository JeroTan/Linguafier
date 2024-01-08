//Utilities
import PagePlate from '../Utilities/PagePlate';
import WordUI from './Utilities/WordUI';
import Icon from '../Utilities/Icon';
import WordUIPlus from './Utilities/WordUIPlus';
import { G_PageSection } from '../Utilities/GlobalProvider';
import Loading from '../Utilities/Loading';
import ImageFlash from '../Utilities/ImageFlash';
import HierarchyMap from '../Utilities/HierarchyMap';
import Button from '../Utilities/Button';


//HOOKS
import { useState, useRef, useContext, useCallback, useMemo, useEffect, createContext, Fragment } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import parse from "html-react-parser";

//Components
function C_Word({Ref,Name}){
    return <div ref={Ref} className='flex flex-wrap gap-1'>
        <h2 className='font-bold md:text-5xl sm:text-4xl xs:text-3xl text-2xl text-my-green drop-shadow-myDrop1 shrink-0'>{Name}</h2>
        <div className='flex flex-col grow font-bold'>
            <p className='text-transparent sm:opacity-50 opacity-20 uppercase md:text-base sm:text-sm tracking-wider md:mb-[-11px] sm:mb-[-9px] xs:mb-[-18px] mb-[-20px]' style={{
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "black",
            }}>{Name}</p>
            <p className='pl-2 sm:text-slate-500 text-slate-300 uppercase md:text-base sm:text-sm tracking-wider'>{Name}</p>
            <p className='pl-4 text-transparent sm:opacity-50 opacity-20 uppercase md:text-base sm:text-sm tracking-wider md:mt-[-11px] sm:mt-[-9px] xs:mt-[-18px] mt-[-20px]' style={{
                WebkitTextStrokeWidth: "1px",
                WebkitTextStrokeColor: "black",
            }}>{Name}</p>
        </div>
    </div>
}

function C_Details({Ref, Variation, Rarity, Attributes, Language}){
    const {storageVariation, storageAttribute} = usePage().props;
    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Details</h2>
        <section className='md:ml-5 sm:ml-3 ml-0'>
            <div className='pl-1 mt-2 mb-1 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600'>Rarity:</h4>
                <div className='rounded-full border border-r-2 border-b-2 border-slate-500 flex gap-1 items-center px-2'>
                    <div className='flex items-center  h-full'>
                        <h4 className='text-slate-400 italic'>{Rarity.name}</h4>
                    </div>
                    <div className=' flex flex-wrap gap-1'>
                        { [...Array(Rarity.level)].map((x, i)=>{
                            return <div key={i} className=''>
                                <Icon Name={'star'} OutClass={"w-5 h-5"} InStyle={{fill:Rarity.color}} />
                            </div>
                        }) }
                    </div>
                </div>
            </div>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600'>Variation:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Variation.map((x, i)=>{
                        return <div key={i} className='rounded-full w-fit pl-[4px] pr-2 py-[3px] flex gap-2 items-center bg-slate-400 text-white'>
                            <ImageFlash Src={storageVariation+x.image} Size={`20px`} Round={`rounded-full`} />
                            <small>{x.name}</small>
                        </div>
                    }) }
                </div>
            </div>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600'>Attributes:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Attributes.map((x, i)=>{
                        return <div key={i} className='rounded-full w-fit h-fit pl-[4px] pr-2 py-[3px] flex gap-2 items-center ' style={{backgroundColor: x.color}}>
                            <ImageFlash Src={storageAttribute+x.image} Size={`20px`} Round={`rounded-full`} />
                            <small className='text-white mix-blend-difference'>{x.name}</small>
                        </div>
                    }) }
                </div>
            </div>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600'>Language:</h4>
                <div className=''>
                    <h4 className='text-slate-400'>{Language}</h4>
                </div>
            </div>
        </section>
    </div>
}

function C_Definition({Ref, Variation, Varname, Pronounciation, Definition}){
    const {storageVariation} = usePage().props;

    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Definition</h2>
        {Variation.map((x, i)=>{
            let desVariation = <div className='flex gap-2 items-center'>
                <h4 className='text-slate-600 font-light'>As a </h4>
                <div className='rounded-full w-fit pl-[4px] pr-2 py-[3px] flex gap-2 items-center bg-slate-400 text-white'>
                    <ImageFlash Src={storageVariation+x.image} Size={`20px`} Round={`rounded-full`} />
                    <small>{x.name}</small>
                </div>
            </div>;
            let desVarname = <div className='flex flex-wrap sm:items-center sm:gap-2 sm:flex-row flex-col'>
                <h3 className='font-semibold md:text-2xl sm:text-xl text-lg text-slate-600'>
                    {Varname[x.id]}
                </h3>
                <div className='text-slate-500 text-xs sm:mt-0  mt-[-6px]'>
                    <small className='block'>Original: <span>{Pronounciation[x.id].simple || <span className='italic'>no pronounciation</span>}</span></small>
                    <small className='block mt-[-5px]'>Simple: <span>{Pronounciation[x.id].original || <span className='italic'>no pronounciation</span>}</span></small>
                </div>
            </div>
            let desDefinition = <div className='mt-2 text-slate-700 p-2 bg-zinc-100 rounded'>
                {parse(Definition[x.id])}
            </div>

            return <div key={i} className='md:ml-5 sm:ml-3 ml-0 my-2 rounded-lg bg-green-200 border-b border-r border-slate-500 px-2 py-1'>
                {desVariation}
                {desVarname}
                {desDefinition}
            </div>
        }) }

    </div>
}

function C_Relationyms({Ref, Synonyms, Antonyms, Homonyms}){
    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Relationyms</h2>
        <section className='md:ml-5 sm:ml-3 ml-0'>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600 mt-[1px]'>Snyonyms:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Synonyms.map((x, i)=>{
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white' style={{
                            wordBreak: 'break-all',
                            overflowWrap: 'break-word',

                        }}>
                            {x.name}
                        </div>
                    }) }
                    {!Synonyms.length ?<>
                        <small className='italic mt-1 text-slate-400 font-light'>no words yet</small>
                    </> : <></>}
                </div>
            </div>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600 mt-[1px]'>Antonyms:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Antonyms.map((x, i)=>{
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white' style={{
                            wordBreak: 'break-all',
                            overflowWrap: 'break-word',

                        }}>
                            {x.name}
                        </div>
                    }) }
                    {!Antonyms.length ?<>
                        <small className='italic mt-1 text-slate-400 font-light'>no words yet</small>
                    </> : <></>}
                </div>
            </div>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600 mt-[1px]'>Homonyms:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Homonyms.map((x, i)=>{
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white' style={{
                            wordBreak: 'break-all',
                            overflowWrap: 'break-word',

                        }}>
                            {x.name}
                        </div>
                    }) }
                    {!Homonyms.length ?<>
                        <small className='italic mt-1 text-slate-400 font-light'>no words yet</small>
                    </> : <></>}
                </div>
            </div>
        </section>

    </div>
}

function C_Hierarchymap({Ref, Rootname, Map}){
    const popSwitch = useState(false);
    const mapSwitch = useState(true);


    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Hierarchymap</h2>
        <section className='md:ml-5 sm:ml-3 ml-0 flex flex-col'>
            <h4 className='text-slate-600 mt-[1px]'>See if a word has an upgrade, downgrade or with the same league as other words.</h4>
            <div className='flex flex-wrap gap-2 mb-2'>
                <p className='text-slate-600'>View in Full Screen </p>
                <Button Icon="eye" Padding={`px-1`} Click={()=>{
                    popSwitch[1](true);
                    mapSwitch[1](false);
                }}/>
            </div>
            <div className=' aspect-video w-full rounded-lg overflow-hidden border-r  border-b-4 border-my-green'>
                <HierarchyMap Handle={Map} RootName={Rootname} PopSwitch={popSwitch} MapSwitch={mapSwitch}/>
            </div>

        </section>
    </div>
}

function C_Lore({Ref, Lore}){
    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Lore</h2>
        <div className='md:ml-5 sm:ml-3 ml-0 bg-green-100 p-2 rounded-lg'>
            { Lore ? parse(Lore) :
            <h4 className='italic text-slate-600'>There is no lore for this word yet.</h4>}
        </div>
    </div>
}

function C_Images({Ref, Images}){
    const {storageWordLibrary} = usePage().props;

    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Images</h2>
        <div className='md:ml-5 sm:ml-3 ml-0 bg-green-100 p-2 rounded-lg flex flex-wrap gap-2'>
            { Images && Images.length >0 ? Images.map((x, i)=>{
                return <Fragment key={i}>
                    <ImageFlash Src={storageWordLibrary+x} Active={true} Size={'10rem'} Pop={true} Border={true} Round={`rounded-lg`}/>
                </Fragment>
            }) :
            <h4 className='italic text-slate-600'>There is no image for this word yet.</h4>}
        </div>
    </div>
}

function C_Sources({Ref, Sources}){
    return <div ref={Ref} className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Sources</h2>
        <section className='md:ml-5 sm:ml-3 ml-0 flex flex-col gap-y-1 mt-2'>
            {Sources && Sources.length>0 ? Sources.map((x,i)=>{
                return <div key={i} className='pl-1 border-l border-slate-500 text-slate-500 italic font-light' style={{
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',

                }}>
                    {x}
                </div>
            }) :
            <h4 className='italic text-slate-600'>There is no source provided for this word.</h4>}
        </section>
    </div>
}

export default function Homepage() {
    //** Use Page */
    const { data } = usePage().props;

    //**>> Use State */
    const SectionSelected = useState('Word');
    //**<< Use State */

    //**>> Use Ref */
    const Word = useRef();
    const Details = useRef();
    const Definition = useRef();
    const Relationyms = useRef();
    const HierarchyMapRef = useRef();
    const Lore = useRef();
    const Images = useRef();
    const Sources = useRef();
    //**<< Use Ref */

    //** Use Effect */
    useEffect(()=>{
        //scrollIntoView({behavior:'smooth'});
        if(Word.current && Details.current && Definition.current && Relationyms.current && HierarchyMapRef.current && Lore.current && Images.current && Sources.current){
            let scrollSelect = {
                'Word':Word,
                'Details':Details,
                'Definition':Definition,
                'Relationyms':Relationyms,
                'Hierarchymap':HierarchyMapRef,
                'Lore':Lore,
                'Images':Images,
                'Sources':Sources,
            }
            scrollSelect[SectionSelected[0]].current.scrollIntoView({behavior:'smooth', block:'start', inline:'end'});
        }
    }, [SectionSelected[0]]);

    useEffect(()=>{
        if(Word.current && Details.current && Definition.current && Relationyms.current && HierarchyMapRef.current && Lore.current && Images.current && Sources.current){
            let scrollSelect = {
                'Word':Word,
                'Details':Details,
                'Definition':Definition,
                'Relationyms':Relationyms,
                'Hierarchymap':HierarchyMapRef,
                'Lore':Lore,
                'Images':Images,
                'Sources':Sources,
            }
            window.addEventListener('scroll',(e)=>{
                for(const key in scrollSelect){
                    let elementYPosition = scrollSelect[key].current.getBoundingClientRect().y+window.scrollY;
                    let elementHeight = scrollSelect[key].current.getBoundingClientRect().height;
                    let center = window.scrollY;
                    if( elementYPosition < center && center < elementHeight+elementYPosition && SectionSelected[0] != key ){
                        let sectI = Object.keys(scrollSelect).findIndex(x=>x==key);
                        if(document.body.scrollHeight-window.innerHeight  ==  center && sectI != (Object.keys(scrollSelect).length-1))
                            break;
                        SectionSelected[1](key);
                        break;
                    }
                }
            });
        };
    }, [ Word.current, Details.current, Definition.current, Relationyms.current, HierarchyMapRef.current, Lore.current, Images.current, Sources.current ]);

    //** Functionality */
    const designSpreader = useCallback(()=>{
        if(data){
            return <>
                <C_Word Ref={Word} Name={data.keyname} />
                <div className='py-6'></div>

                <C_Details Ref={Details} Variation={data.variation} Rarity={data.rarity} Attributes={data.attributes} Language={data.language}/>
                <div className='py-6'></div>

                <C_Definition Ref={Definition} Variation={data.variation} Varname={data.varname} Pronounciation={data.pronounciation} Definition={data.definition} />
                <div className='py-6'></div>

                <C_Relationyms Ref={Relationyms} Synonyms={data.relationyms.synonyms} Antonyms={data.relationyms.antonyms} Homonyms={data.relationyms.homonyms} />
                <div className='py-6'></div>

                <C_Hierarchymap Ref={HierarchyMapRef} Rootname={data.keyname} Map={data.hierarchymap} />
                <div className='py-6'></div>

                <C_Lore Ref={Lore} Lore={data.origin} />
                <div className='py-6'></div>

                <C_Images Ref={Images} Images={data.images} />
                <div className='py-6'></div>

                <C_Sources Ref={Sources} Sources={data.sources} />
                <div className='py-6'></div>
            </>
        }else{
            return <div className='flex items-center flex-col'>
                <Loading />
                <h3>Fetching More Logia. . . </h3>
            </div>
        }
    }, [data]);

    return <G_PageSection.Provider value={[SectionSelected]}><WordUIPlus>
        {designSpreader()}
    </WordUIPlus></G_PageSection.Provider>
}
