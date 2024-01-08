// UTILITIES
import AdminMainUI from "../../Utilities/AdminMainUI";
import Button from "../../../../Utilities/Button";
import Textbox from "../../../../Utilities/Textbox";
import FIleInput from "../../../../Utilities/FileInput";
import Pop from "../../../../Utilities/Pop";
import PopFlash from "../../../../Utilities/PopFlash";
import PopLoading from "../../../../Utilities/PopLoading";
import TextboxDropDownMultiple from "../../../../Utilities/TextboxDropDownMultiple";
import TextboxDropDown from "../../../../Utilities/TextboxDropDown";
import Icon from "../../../../Utilities/Icon";
import TextEditor from "../../../../Utilities/TextEditor";
import TextEditorSimple from "../../../../Utilities/TextEditorSimple";
import HierarchyMap from "../../../../Utilities/HierarchyMap";


// HOOKS
import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { router, usePage } from "@inertiajs/react";



export default ()=>{
    //** Use Page */
    const { errors, variationDrop, attributeDrop, rarityDrop, languageDrop, synonymsDrop, antonymsDrop, homonymsDrop, headDrop, sideDrop, tailDrop } = usePage().props;
    // console.log(errors);
    //** STRUCT */

    //**>> Use State */
    const [ v_keyname, e_keyname ] = useState("");
    const [ v_language, e_language ] = useState({name:"", id:""});

    const [ v_variation, e_variation ] = useState([]);
    const [ v_varname, e_varname ] = useState({});
    const [ v_definition, e_definition] = useState({});
    const [ v_pronounciation, e_pronounciation] = useState({});
    const [ v_example, e_example ] = useState({});

    const [ v_rarity, e_rarity] = useState({name:"", id:""});
    const [ v_attributes, e_attributes] = useState([]);
    const v_relationyms = {
        synonyms:useState([]),
        antonyms:useState([]),
        homonyms:useState([]),
    }
    const v_hierarchymap = {
        tail: useState([]),
        side: useState([]),
        head: useState([]),
    };
    const v_hierarchymapPreview = useState({
        tail: [],
        side: [],
        head: [],
    });
    const v_hierarchymapPreviewSwitch = useState(false);
    const [v_origin, e_origin] = useState("");
    const [v_images, e_images] = useState([""]);
    const [v_sources, e_sources] = useState([]);

    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    //**>> Use Effect */
    useEffect(()=>{
        function remakes(prev, defaultValue){
            let remake = {};
            v_variation.forEach((x)=>{
                if(prev[x.id]){
                    remake[x.id] = prev[x.id];
                }else{
                    remake[x.id] = defaultValue;
                }
            })
            return structuredClone(remake);
        };
        e_varname(prev=>{
            return remakes(prev, "");
        });
        e_definition(prev=>{
            return remakes(prev, "");
        });
        e_pronounciation(prev=>{
            return remakes(prev, {simple:"", original:""});
        });
        e_example(prev=>{
            return remakes(prev, []);
        });
    }, [v_variation]);
    useEffect(()=>{
        let imagesTemp = structuredClone(v_images);//CLone the images temp so that we have a copy of original for comparison later
        let NoFileInTheMiddle = false; //This will false at first; It's purpose is to identify if the subsequent file has "" or empty
        imagesTemp = imagesTemp.filter((x, i)=>{ //It will filter out empty array element except one or the last
            if(NoFileInTheMiddle)
                return false;
            if(x == ""){
                NoFileInTheMiddle = true;
            }
            return true;
        });
        if( imagesTemp.length < 3 && imagesTemp[imagesTemp.length-1] != ""){ //If all subsequent files have data then add "" in the last one.
            imagesTemp[imagesTemp.length] = "";
        }
        if(JSON.stringify(v_images) != JSON.stringify(imagesTemp)){//Now compare if there is something change in the imagesTemp from original; If there is put the changes
            e_images(imagesTemp);
        };

    }, [v_images]);
    useEffect(()=>{
        v_hierarchymapPreview[1](prev=>{
            prev.tail = v_hierarchymap.tail[0];
            prev.side = v_hierarchymap.side[0];
            prev.head = v_hierarchymap.head[0];
            return structuredClone(prev);
        });
    }, [v_hierarchymap.tail[0], v_hierarchymap.side[0], v_hierarchymap.head[0]]);
    //**<< Use Effect */

    //** Functionality */
    function resetData(){
        e_keyname("");
        e_language({name:"", id:""});
        e_variation([]);
        e_rarity({name:"", id:""});
        e_attributes([]);
        v_relationyms.synonyms[1]([]);
        v_relationyms.antonyms[1]([]);
        v_relationyms.homonyms[1]([]);
        v_hierarchymap.tail[1]([]);
        v_hierarchymap.side[1]([]);
        v_hierarchymap.head[1]([]);
        e_origin("");
        e_images([""]);
        e_sources([]);
        document.getElementById('titleCard').scrollIntoView({behavior:'smooth'});
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_library')}}/>
        </div>

        {/* Add Section */}
        <form className="mt-10">
            <h4 id="titleCard" className='text-2xl mb-4 text-my-green font-semibold'>Add Words</h4>

            {/* Keyname */}
            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Key Name: </label>
                <Textbox Handle={[v_keyname, e_keyname]} Size="sm:ml-3 w-96" Placeholder="Type the main word here. . ." Error={errors.v_keyname} />
            </div>

            {/* Language */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Language: </label>
                <TextboxDropDown Handle={[v_language, e_language]} Placeholder="Select one. . ." Error={errors["v_language.name"]} DropData={languageDrop} Request={`/admin/dashboard/word_library/search_data`} WithRef={true} RequestKey={"v_searchLanguage"} Size={`sm:ml-3 w-96`} />
            </div>

            {/* Variation */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Word Variation: </label>
                <TextboxDropDownMultiple Handle={[v_variation, e_variation]} Placeholder="No Selected. . ." Error={errors.v_variation} DropData={variationDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchVariation"} WithRef={true} Size={`sm:ml-3 ${v_variation.length > 0 ?"":"w-96"}`} />
            </div>

            {/* Details for Variation */}
            {
                v_variation.length > 0 ? v_variation.filter((x, i)=>{ //Check if there is variation already and if there is check if definition, pronounciation and examples are in
                    if(v_definition[x.id], v_pronounciation[x.id], v_example[x.id]){
                        return true;
                    }else{
                        return false;
                    }
                }).map((x, i)=>{ //Then Spread the array into text
                    return <Fragment key={i}>
                        <div className="my-5"></div>
                        <div className="flex flex-col sm:p-1 p-0">
                            <div className="sm:rounded rounded-none bg-green-300 sm:border-r-2 border-b-2 border-black p-2">
                                <div className="flex items-center gap-1">
                                    <Icon Name="right" OutClass={"w-3 h-3"} InClass={"fill-my-green"}/> <h6 className=" break-words">{x.name}</h6>
                                </div>
                                {/* Variation Word Name */}
                                <div className="my-2"></div>
                                <div className="flex flex-wrap gap-1">
                                    <label className="basis-full">Variation Word: </label>
                                    <Textbox Handle={[v_varname, e_varname]} Dynamic={`${x.id}`} Size="w-96" Placeholder={`Name of the word as a ${x.name}. . .`} Error={errors.v_varname} />
                                </div>

                                {/* Definition */}
                                <div className="my-2"></div>
                                <div className="flex flex-col gap-1">
                                    <label className="">Definition: </label>
                                    <TextEditorSimple Handle={[v_definition, e_definition]} Dynamic={`${x.id}`} Size={"md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Error={errors[`v_definition.${x.id}`]} />
                                </div>
                                {/* Pronounciation */}
                                <div className="my-2"></div>
                                <div className="flex flex-wrap gap-1 gap-x-4">
                                    <label className="w-full">Pronounciation: </label>
                                    <div className="flex flex-col gap-1 xs:w-auto w-full">
                                        <small className=" font-light text-slate-600">Simple <span className="text-slate-400">(optional)</span></small>
                                        <Textbox Handle={[v_pronounciation, e_pronounciation]} Dynamic={`${x.id}.simple`} Size="sm:w-96 w-full" Error={errors[`v_pronounciation.${x.id}.simple`]} />
                                    </div>
                                    <div className="flex flex-col gap-1 xs:w-auto w-full">
                                        <small className=" font-light text-slate-600">Original <span className="text-slate-400">(optional)</span></small>
                                        <Textbox Handle={[v_pronounciation, e_pronounciation]} Dynamic={`${x.id}.original`} Size="sm:w-96 w-full" Error={errors[`v_pronounciation.${x.id}.original`]} />
                                    </div>
                                </div>
                                {/* Examples */}
                                <div className="my-4"></div>
                                <div className="flex flex-wrap gap-1 w-full">
                                    <div className="flex gap-2 flex-wrap">
                                        <label className="">Examples:</label>
                                        {v_example[x.id].length < 10 ?
                                            <Button Name="Add Example" Icon="add" Padding={`px-1`} Click={()=>{
                                                e_example(prev=>{
                                                    prev = structuredClone(prev);
                                                    prev[x.id][prev[x.id].length] = "";
                                                    return prev;
                                                });
                                            }}/>
                                        : ""}
                                    </div>
                                    {v_example[x.id].length > 0 ? v_example[x.id].map((y, j)=>{
                                        return <Fragment key={j}>
                                            <div className="flex flex-wrap items-center gap-2 w-full">
                                                <small className=" font-light text-slate-600">#{j+1}</small>
                                                <div className="p-1 rounded bg-my-green cursor-pointer" onClick={()=>{
                                                    e_example(prev=>{
                                                        prev[x.id] = prev[x.id].filter((z, k)=>k!=j);
                                                        return structuredClone(prev);
                                                    });
                                                }}>
                                                    <Icon Name={`close`} OutClass="w-4 h-4" InClass="" />
                                                </div>
                                            </div>

                                            <Textbox Handle={[v_example, e_example]} Dynamic={`${x.id}.${j}`} Size="md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] w-full" Error={errors[`v_example.${x.id}.${j}`]} />
                                        </Fragment>
                                    })
                                    : ""}
                                </div>


                            </div>
                        </div>

                    </Fragment>
                }) : ""
            }

            {/* Rarity */}
            <div className="my-7"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Rarity: </label>
                <TextboxDropDown Handle={[v_rarity, e_rarity]} Placeholder="Select one. . ." Error={errors[`v_rarity.name`]} DropData={rarityDrop} Request={`/admin/dashboard/word_library/search_data`} SelectSkip={true} WithRef={true} Size="sm:ml-3 w-96" />
            </div>

            {/* Attribute */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Attribute: </label>
                <TextboxDropDownMultiple Handle={[v_attributes, e_attributes]} Placeholder="No Selected. . ." Error={errors.v_attributes} DropData={attributeDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchAttribute"} WithRef={true} Size={`sm:ml-3 ${v_attributes.length > 0 ?"":"w-96"}`} />
            </div>

            {/* Relationyms */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Relationyms: </label>
                <small className=" font-light text-slate-600 w-full">Synonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.synonyms[0], v_relationyms.synonyms[1]]} Placeholder="No Selected. . ." Error={errors[`v_relationyms.synonyms`]} DropData={synonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchSynonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.synonyms[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Antonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.antonyms[0], v_relationyms.antonyms[1]]} Placeholder="No Selected. . ." Error={errors[`v_relationyms.antonyms`]} DropData={antonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchAntonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.antonyms[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Homonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.homonyms[0], v_relationyms.homonyms[1]]} Placeholder="No Selected. . ." Error={errors[`v_relationyms.homonyms`]} DropData={homonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchHomonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.homonyms[0].length > 0 ?"":"w-96"}`} />
            </div>

            {/* Hierarchy */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <div className="flex w-full gap-2 flex-wrap">
                    <label className="">Hierarchy Mapping: </label>
                    <Button Name="Preview" Icon="eye" Padding={`px-1`} Click={()=>{
                        v_hierarchymapPreviewSwitch[1](prev=>!prev);
                    }}/>
                    <HierarchyMap Handle={v_hierarchymapPreview} RootName={v_keyname} PopSwitch={v_hierarchymapPreviewSwitch} OffMapSwitch={true}/>
                </div>
                <small className=" font-light text-slate-600 w-full">Ancestor <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_hierarchymap.tail[0], v_hierarchymap.tail[1]]} Placeholder="No Selected. . ." Error={errors[`v_hierarchymap.tail`]} DropData={tailDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchTail"} WithRef={true} Size={`sm:ml-3 ${v_hierarchymap.tail[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Same League <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_hierarchymap.side[0], v_hierarchymap.side[1]]} Placeholder="No Selected. . ." Error={errors[`v_hierarchymap.tail`]} DropData={sideDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchSide"} WithRef={true} Size={`sm:ml-3 ${v_hierarchymap.side[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Predecessor <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_hierarchymap.head[0], v_hierarchymap.head[1]]} Placeholder="No Selected. . ." Error={errors[`v_hierarchymap.tail`]} DropData={headDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchHead"} WithRef={true} Size={`sm:ml-3 ${v_hierarchymap.head[0].length > 0 ?"":"w-96"}`} />
            </div>

            {/* Origin */}
            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <div className="flex w-full items-center flex-wrap gap-1">
                    <label className="">Origin: </label>
                    <small className="font-light text-slate-400">(optional)</small>
                </div>
                <TextEditorSimple Handle={[v_origin, e_origin]} Size={"sm:ml-3 md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Placeholder="Insert the lore of the word. . ." Error={errors.v_origin} />
            </div>

            {/* Images */}
            <div className="my-5"></div>
            <div className="relative w-full flex flex-wrap gap-1">
                <div className="flex w-full flex-wrap gap-1 items-center">
                    <label className="">Images: </label>
                    <small className="font-light text-slate-400">(optional/max of 3)</small>
                </div>
                <div className="flex flex-wrap gap-5 ">
                    {v_images.map((x, i)=>{
                        return <div key={i} className="flex flex-col">
                            <small className=" font-light text-slate-600">#{i+1}</small>
                            <FIleInput Handler={[v_images, e_images]} Dynamic={`${i}`} Error={errors[`v_images.${i}`]} />
                        </div>
                    }) }
                </div>
            </div>

            {/* Sources */}
            <div className="my-7"></div>
            <div className="flex flex-wrap gap-1">
                <div className="flex w-full gap-2 flex-wrap">
                    <label className="">Sources:</label>
                    { v_sources.length < 100 ?
                        <Button Name="Add Sources" Icon="add" Padding={`px-1`} Click={()=>{
                            e_sources(prev=>{
                                prev = structuredClone(prev);
                                prev[prev.length] = "";
                                return prev;
                            });
                        }}/>
                    : ""}
                </div>
                {v_sources.map((x, i)=>{
                    return <Fragment key={i}>
                        <div className="flex flex-wrap items-center gap-2 w-full">
                            <small className="font-light text-slate-600">#{i+1}</small>
                            <div className="p-1 rounded bg-my-green cursor-pointer" onClick={()=>{
                                e_sources(prev=>{
                                    prev = prev.filter((y, j)=>j!=i);
                                    return structuredClone(prev);
                                });
                            }}>
                                <Icon Name={`close`} OutClass="w-4 h-4" InClass="" />
                            </div>
                        </div>
                        <TextEditorSimple Handle={[v_sources, e_sources]} Dynamic={`${i}`} Size={"sm:ml-3 md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Placeholder={`Insert source here. . .`} Error={errors[`v_sources.${i}`]} />
                    </Fragment>
                }) }
            </div>

            {/* Buttons */}
            <div className="mt-16 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Create" Click={()=>{
                    /**
                     * MY best BET is convert every non file types as json
                     * and just parse it back to Array on php
                     */
                    router.post('/admin/dashboard/word_library/add_submit', {
                        v_keyname:JSON.stringify(v_keyname),
                        v_language:JSON.stringify(v_language),
                        v_variation:JSON.stringify(v_variation),
                        v_varname: JSON.stringify(v_varname),
                        v_definition:JSON.stringify(v_definition),
                        v_pronounciation:JSON.stringify(v_pronounciation),
                        v_example:JSON.stringify(v_example),
                        v_rarity:JSON.stringify(v_rarity),
                        v_attributes:JSON.stringify(v_attributes),
                        v_relationyms:JSON.stringify({
                            synonyms: v_relationyms.synonyms[0],
                            antonyms: v_relationyms.antonyms[0],
                            homonyms: v_relationyms.homonyms[0],
                        }),
                        v_hierarchymap:JSON.stringify({
                            tail:v_hierarchymap.tail[0],
                            side:v_hierarchymap.side[0],
                            head:v_hierarchymap.head[0],
                        }),
                        v_origin:JSON.stringify(v_origin),
                        v_sources:JSON.stringify(v_sources),
                        v_images:v_images,//Image
                    }, { onFinish:()=>{
                        e_popLoading(false);
                    },forceFormData: true });
                    e_popLoading(true);
                }}/>
                <Button Name="Reset" Click={resetData}/>
            </div>

        </form>

        {/* POP */}
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good!", "Func":()=>router.get('/admin/dashboard/word_library'), Color:'bg-my-green'  },
            {'Name': "Add Again!", "Func":()=>{e_popFlash(false);resetData();}, Color:'bg-slate-400'  },
        ]}} CloseFunc={()=>router.get('/admin/dashboard/word_library')} />

    </AdminMainUI>
}
