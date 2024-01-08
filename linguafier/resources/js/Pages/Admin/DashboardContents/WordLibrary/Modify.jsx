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
    const { data, errors, variationDrop, attributeDrop, rarityDrop, languageDrop, synonymsDrop, antonymsDrop, homonymsDrop, headDrop, sideDrop, tailDrop, storageWordLibrary } = usePage().props;

    //**>> Use State */
    const [ v_keyname, e_keyname ] = useState(data.keyname);
    const [ v_language, e_language ] = useState(data.language);

    const [ v_variation, e_variation ] = useState(data.variation);
    const [ v_varname, e_varname ] = useState(data.varname);
    const [ v_definition, e_definition] = useState(data.definition);
    const [ v_pronounciation, e_pronounciation] = useState(data.pronounciation);
    const [ v_example, e_example ] = useState(data.example);

    const [ v_rarity, e_rarity] = useState(data.rarity);
    const [ v_attributes, e_attributes] = useState(data.attributes);
    const v_relationyms = {
        synonyms:useState(structuredClone(data.relationyms.synonyms)),
        antonyms:useState(structuredClone(data.relationyms.antonyms)),
        homonyms:useState(structuredClone(data.relationyms.homonyms)),
    }
    const v_hierarchymap = {
        tail: useState(structuredClone(data.hierarchymap.tail)),
        side: useState(structuredClone(data.hierarchymap.side)),
        head: useState(structuredClone(data.hierarchymap.head)),
    };
    const v_hierarchymapPreview = useState({
        tail: [],
        side: [],
        head: [],
    });
    const v_hierarchymapPreviewSwitch = useState(false);
    const [v_origin, e_origin] = useState(data.origin);
    const [v_images, e_images] = useState(data.images);
    const [v_prevImages, e_prevImages] = useState(data.previmages);
    const [v_sources, e_sources] = useState(data.sources);


    const [c_disabled, e_disabled ] = useState(true);
    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */
    // console.log(v_images);

    //**>> STRUCT */
    let popContent = {
        WarningDelete:{
            Title: "Delete Warning",
            Message: "Do you really want to delete this? Are you sure?",
            Type: "warning",
            Button: [
                {Name: "Yes", Func:()=>{ e_popPick('ConfirmDelete'); }, Color:'bg-red-500'  },
                {Name: "No! Of course not", Func:"close", Color:'bg-slate-500'  },
            ]
        },
        ConfirmDelete:{
            Title: "Delete Confirmation",
            Message: `Click "Yes" to proceed?`,
            Type: `notice`,
            Button: [
                {Name: "YES!", Func:()=>{
                    router.post('/admin/dashboard/word_library/delete/'+data.id, {}, {onFinish:()=>{
                        e_popLoading(false);
                    }});
                    e_popSwitch(false);
                    e_popLoading(true);
                }, Color:'bg-red-500'  },
                {Name: "I've Changed my mind", Func:"close", Color:'bg-slate-500'  },
            ]
        },
        ConfirmSubmit:{
            Title: `Confirm Modifications`,
            Message: `Click "Yes" to modify the word.`,
            Type: 'notice',
            Button : [
                {
                    Name: "Yes",
                    "Func":()=>{
                        router.post('/admin/dashboard/word_library/modify_submit/'+data.id, {
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
                        }, {
                            onFinish:()=>{
                                e_popLoading(false);
                            }
                        });
                        e_popLoading(true);
                        e_popSwitch(false);
                    },
                    Color:'bg-my-green'

                },
                {Name: "Continue Editing", Func:"close", Color:'bg-slate-500'  },
            ]

        },
    };
    //**<< STRUCT */

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
                e_prevImages(prev=>{
                    prev = structuredClone(prev);
                    prev[i] == "";
                    //console.log(prev);
                    prev = prev.filter((y, j)=>{
                        if(j > i){
                            return false
                        }
                        return true;
                    });
                    // console.log(prev);
                    return prev;
                });
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
        if(isUnchange()){
            e_disabled(true);
        }else{
            e_disabled(false);
        }
    }, [v_keyname, v_language, v_variation, v_definition, v_pronounciation, v_example, v_rarity, v_attributes, v_relationyms.synonyms[0], v_relationyms.antonyms[0], v_relationyms.homonyms[0], v_hierarchymap.tail[0], v_hierarchymap.side[0], v_hierarchymap.head[0], v_origin, v_images, v_prevImages, v_sources,]);
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
    function isUnchange(){
        let trueNess = (
            v_keyname == data.keyname &&
            v_language.id == data.language?.id &&
            JSON.stringify(v_variation) == JSON.stringify(data.variation) &&
            JSON.stringify(v_varname) == JSON.stringify(data.varname) &&
            JSON.stringify(v_definition) ==  JSON.stringify(data.definition) &&
            JSON.stringify(v_pronounciation) == JSON.stringify(data.pronounciation) &&
            JSON.stringify(v_example) == JSON.stringify(data.example) &&
            v_rarity.id == data.rarity?.id &&
            JSON.stringify(v_attributes) == JSON.stringify(data.attributes) &&
            JSON.stringify(v_relationyms.synonyms[0]) == JSON.stringify(data.relationyms.synonyms) &&
            JSON.stringify(v_relationyms.antonyms[0]) == JSON.stringify(data.relationyms.antonyms) &&
            JSON.stringify(v_relationyms.homonyms[0]) == JSON.stringify(data.relationyms.homonyms) &&
            JSON.stringify(v_hierarchymap.tail[0]) == JSON.stringify(data.hierarchymap.tail) &&
            JSON.stringify(v_hierarchymap.head[0]) == JSON.stringify(data.hierarchymap.head) &&
            JSON.stringify(v_hierarchymap.side[0]) == JSON.stringify(data.hierarchymap.side) &&
            v_origin == data.origin &&
            JSON.stringify(v_images) == JSON.stringify(data.images) &&
            JSON.stringify(v_sources) == JSON.stringify(data.sources)
        );
        // console.log(JSON.stringify(v_images), JSON.stringify(data.images));
        return trueNess;
    }
    function resetData(){
        e_keyname(data.keyname);
        e_language(data.language);
        e_varname(data.varname);
        e_definition(data.definition);
        e_pronounciation(data.pronounciation);
        e_example(data.example);
        e_variation(data.variation);
        e_rarity(data.rarity);
        e_attributes(data.attributes);
        v_relationyms.synonyms[1](structuredClone(data.relationyms.synonyms));
        v_relationyms.antonyms[1](structuredClone(data.relationyms.antonyms));
        v_relationyms.homonyms[1](structuredClone(data.relationyms.homonyms));
        v_hierarchymap.tail[1](structuredClone(data.hierarchymap.tail));
        v_hierarchymap.side[1](structuredClone(data.hierarchymap.side));
        v_hierarchymap.head[1](structuredClone(data.hierarchymap.head));
        e_origin(data.origin);
        e_images(data.images);
        e_prevImages(data.previmages);
        e_sources(data.sources);
        document.getElementById('titleCard').scrollIntoView({behavior:'smooth'});
    }
    function refreshData(){
        router.reload({ only: ['data'] });
    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_library')}}/>
        </div>
        {/* Modify Section */}
        <form>
            <h4 id="titleCard" className='text-2xl mb-4 text-my-green font-semibold'>Modify Words</h4>

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
                            <FIleInput Handler={[v_images, e_images]} Dynamic={`${i}`} Preview={[v_prevImages,e_prevImages]} Error={errors[`v_images.${i}`]} />
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

            {/* Button */}
            <div className="mt-10 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Modify" Click={()=>{
                    e_popPick('ConfirmSubmit');
                    e_popSwitch(true);
                }} Disabled={c_disabled} />
                <Button Name="Reset" Click={resetData}/>
                <Button Name="Refresh" Click={refreshData}/>
                <Button Name="Delete" Color="bg-red-500" Click={ ()=>{ e_popSwitch(true); e_popPick('WarningDelete') }}/>
            </div>
        </form>


        {/* POP */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good", "Func":"close", Color:'bg-my-green'  },
        ]}} />
    </AdminMainUI>
}
