//Utilities
import PagePlate from '../Utilities/PagePlate';
import WordUI from './Utilities/WordUI';
import Icon from '../Utilities/Icon';
import WordUIPlus from './Utilities/WordUIPlus';
import { G_PageSection } from '../Utilities/GlobalProvider';
import Loading from '../Utilities/Loading';
import ImageFlash from '../Utilities/ImageFlash';


//HOOKS
import { useState, useRef, useContext, useCallback, useMemo, useEffect, createContext } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import parse from "html-react-parser";

//Components
function C_Word({Name}){
    return <div className='flex flex-wrap gap-1'>
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

function C_Details({Variation, Rarity, Attributes, Language}){
    const {storageVariation, storageAttribute} = usePage().props;
    return <div className='relative'>
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

function C_Definition({Variation, Varname, Pronounciation, Definition}){
    const {storageVariation} = usePage().props;

    return <div className='relative'>
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

function C_Relationyms({Synonyms, Antonyms, Homonyms}){
    return <div className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Relationyms</h2>
        <section className='md:ml-5 sm:ml-3 ml-0'>
            <div className='pl-1 mt-2 flex flex-wrap gap-1 gap-x-2 xs:flex-row flex-col border-l border-slate-500'>
                <h4 className='text-slate-600 mt-[1px]'>Snyonyms:</h4>
                <div className='flex flex-wrap gap-2'>
                    {Synonyms.map((x, i)=>{
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white'>
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
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white'>
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
                        return <div key={i} className='rounded w-fit px-2 py-[2px] flex bg-my-green90 text-white'>
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

function C_Heirarchymap({Rootname, Map}){
    return <div className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Heirarchymap</h2>

    </div>
}

function C_Lore({Lore}){
    return <div className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Lore</h2>

    </div>
}

function C_Images({Images}){
    return <div className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Images</h2>

    </div>
}

function C_Sources({Sources}){
    return <div className='relative'>
        <h2 className='sm:text-3xl text-2xl font-light text-slate-700'>Sources</h2>

    </div>
}

export default function Homepage() {
    //** Use Page */
    const { data } = usePage().props;


    //**>> Use State */
    const SectionSelected = useState('Word');
    const HeirarchyMapPop = useState(false);
    //**<< Use State */

    //** Functionality */
    const designSpreader = useCallback(()=>{
        if(data){
            return <>
                <C_Word Name={data.keyname} />
                <div className='py-6'></div>

                <C_Details Variation={data.variation} Rarity={data.rarity} Attributes={data.attributes} Language={data.language}/>
                <div className='py-6'></div>

                <C_Definition Variation={data.variation} Varname={data.varname} Pronounciation={data.pronounciation} Definition={data.definition} />
                <div className='py-6'></div>

                <C_Relationyms Synonyms={data.relationyms.synonyms} Antonyms={data.relationyms.antonyms} Homonyms={data.relationyms.homonyms} />
                <div className='py-6'></div>

                <C_Heirarchymap />
                <div className='py-6'></div>

                <C_Lore />
                <div className='py-6'></div>

                <C_Images />
                <div className='py-6'></div>

                <C_Sources />
                <div className='py-6'></div>
            </>
        }else{
            return <div className='flex items-center flex-col'>
                <Loading />
                <h3>Fetching More Logia. . . </h3>
            </div>
        }
    }, [data]);

    return <G_PageSection.Provider value={SectionSelected}><WordUIPlus>
        {designSpreader()}
    </WordUIPlus></G_PageSection.Provider>
}
