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


// HOOKS
import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import { router, usePage } from "@inertiajs/react";



export default ()=>{
    //** Use Page */
    const { errors, variationDrop, attributeDrop, rarityDrop, languageDrop, synonymsDrop, antonymsDrop, homonymsDrop, headDrop, sideDrop, tailDrop } = usePage().props;


    //** STRUCT */

    //**>> Use State */
    const [ v_keyname, e_keyname ] = useState("");
    const [ v_language, e_language ] = useState("");

    const [ v_variation, e_variation ] = useState([]);
    const [ v_definition, e_definition] = useState({});
    const [ v_pronounciation, e_pronounciation] = useState({});
    const [ v_example, e_example ] = useState({});

    const [ v_rarity, e_rarity] = useState([]);
    const [ v_attributes, e_attributes] = useState([]);
    const v_relationyms = {
        synonyms:useState([]),
        antonyms:useState([]),
        homonyms:useState([]),
    }
    const v_heirarchymap = {
        tail: useState([]),
        side: useState([]),
        head: useState([]),
    };
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
        let imagesTemp = structuredClone(v_images);
        let NoFileInTheMiddle = false;
        imagesTemp = imagesTemp.filter((x, i)=>{
            console.log(NoFileInTheMiddle, x);
            if(NoFileInTheMiddle)
                return false;
            if(x == ""){
                NoFileInTheMiddle = true;
            }
            return true;
        });
        if( imagesTemp.length < 3 && imagesTemp[imagesTemp.length-1] != ""){
            imagesTemp[imagesTemp.length] = "";
        }
        if(JSON.stringify(v_images) != JSON.stringify(imagesTemp)){
            e_images(imagesTemp);
        };

    }, [v_images]);
    //**<< Use Effect */

    //** Functionality */
    function resetData(){

    }

    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_library')}}/>
        </div>

        {/* Add Section */}
        <form className="mt-10">
            <h4 className='text-2xl mb-4 text-my-green font-semibold'>Add Words</h4>

            {/* Add Details For Each Variation First */}
            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Key Name: </label>
                <Textbox Handle={[v_keyname, e_keyname]} Size="sm:ml-3 w-96" Placeholder="Type the main word here. . ." Error={errors.v_keyname} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Select Language: </label>
                <TextboxDropDown Handle={[v_language, e_language]} Placeholder="Select one. . ." Error={errors.v_language} DropData={languageDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchLanguage"} Size={`sm:ml-3 w-96`} />
            </div>

            <div className="my-5"></div>

            <div className="flex flex-wrap gap-1">
                <label className="basis-full">Select Word Variation: </label>
                <TextboxDropDownMultiple Handle={[v_variation, e_variation]} Placeholder="Select. . ." Error={errors.v_variation} DropData={variationDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchVariation"} WithRef={true} Size={`sm:ml-3 ${v_variation.length > 0 ?"":"w-96"}`} />
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

                                <div className="my-2"></div>
                                <div className="flex flex-col gap-1">
                                    <label className="">Definition: </label>
                                    <TextEditorSimple Handle={[v_definition, e_definition]} Dynamic={`${x.id}`} Size={"md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Error={errors.v_definition} />
                                </div>

                                <div className="my-2"></div>
                                <div className="flex flex-wrap gap-1 gap-x-4">
                                    <label className="w-full">Pronounciation: </label>
                                    <div className="flex flex-col gap-1 xs:w-auto w-full">
                                        <small className=" font-light text-slate-600">Simple</small>
                                        <Textbox Handle={[v_pronounciation, e_pronounciation]} Dynamic={`${x.id}.simple`} Size="sm:w-96 w-full" Error={errors.v_pronounciation} />
                                    </div>
                                    <div className="flex flex-col gap-1 xs:w-auto w-full">
                                        <small className=" font-light text-slate-600">Original</small>
                                        <Textbox Handle={[v_pronounciation, e_pronounciation]} Dynamic={`${x.id}.orignal`} Size="sm:w-96 w-full" Error={errors.v_pronounciation} />
                                    </div>
                                </div>

                                <div className="my-4"></div>
                                <div className="flex flex-wrap gap-1 w-full">
                                    <div className="flex gap-2 flex-wrap">
                                        <label className="">Examples:</label>
                                        <Button Name="Add Example" Icon="add" Padding={`px-1`} Click={()=>{
                                            e_example(prev=>{
                                                prev = structuredClone(prev);
                                                prev[x.id][prev[x.id].length] = "";
                                                return prev;
                                            });
                                        }}/>
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

                                            <Textbox Handle={[v_example, e_example]} Dynamic={`${x.id}.${j}`} Size="md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] w-full" Error={errors.v_example} />
                                        </Fragment>
                                    })
                                    : ""}
                                </div>


                            </div>
                        </div>

                    </Fragment>
                }) : ""
            }

            {/* Other Details */}
            <div className="my-7"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Rarity: </label>
                <TextboxDropDown Handle={[v_rarity, e_rarity]} Placeholder="Choose a Rarity. . ." Error={errors.v_variation} DropData={rarityDrop} Request={`/admin/dashboard/word_library/search_data`} SelectSkip={true} WithRef={true} Size="sm:ml-3 w-96" />
            </div>

            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Relationyms: </label>
                <small className=" font-light text-slate-600 w-full">Synonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.synonyms[0], v_relationyms.synonyms[1]]} Placeholder="No Selected. . ." Error={errors.v_relationyms} DropData={synonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchSynonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.synonyms[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Antonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.antonyms[0], v_relationyms.antonyms[1]]} Placeholder="No Selected. . ." Error={errors.v_relationyms} DropData={antonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchAntonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.antonyms[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Homonyms <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_relationyms.homonyms[0], v_relationyms.homonyms[1]]} Placeholder="No Selected. . ." Error={errors.v_relationyms} DropData={homonymsDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchHomonyms"} WithRef={true} Size={`sm:ml-3 ${v_relationyms.homonyms[0].length > 0 ?"":"w-96"}`} />
            </div>

            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Heirarchy Mapping: </label>
                <small className=" font-light text-slate-600 w-full">Ancestor <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_heirarchymap.tail[0], v_heirarchymap.tail[1]]} Placeholder="No Selected. . ." Error={errors.v_heirarchymap} DropData={tailDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchTail"} WithRef={true} Size={`sm:ml-3 ${v_heirarchymap.tail[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Same League <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_heirarchymap.side[0], v_heirarchymap.side[1]]} Placeholder="No Selected. . ." Error={errors.v_heirarchymap} DropData={sideDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchSide"} WithRef={true} Size={`sm:ml-3 ${v_heirarchymap.side[0].length > 0 ?"":"w-96"}`} />
                <small className=" font-light text-slate-600 w-full">Predecessor <span className="text-slate-400">(optional)</span></small>
                <TextboxDropDownMultiple Handle={[v_heirarchymap.head[0], v_heirarchymap.head[1]]} Placeholder="No Selected. . ." Error={errors.v_heirarchymap} DropData={headDrop} Request={`/admin/dashboard/word_library/search_data`} RequestKey={"v_searchHead"} WithRef={true} Size={`sm:ml-3 ${v_heirarchymap.head[0].length > 0 ?"":"w-96"}`} />
            </div>

            <div className="my-5"></div>
            <div className="flex flex-wrap gap-1">
                <label className="w-full">Origin: </label>
                <TextEditorSimple Handle={[v_origin, e_origin]} Size={"sm:ml-3 md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Placeholder="Insert the lore of the word. . ." Error={errors.v_origin} />
            </div>

            <div className="my-5"></div>
            <div className="relative w-full flex flex-wrap gap-1">
                <div className="flex w-full flex-wrap gap-1">
                    <label className="">Images: </label>
                    <small className="font-light text-slate-400">(optional/max of 3)</small>
                </div>
                {
                    v_images.map((x, i)=>{
                        return <div key={i} className="flex flex-col">
                            <small className=" font-light text-slate-600">#{i+1}</small>
                            <FIleInput Handler={[v_images, e_images]} Dynamic={`${i}`} Error={errors.v_images} />
                        </div>
                    })
                }

            </div>

            <div className="my-7"></div>
            <div className="flex flex-wrap gap-1">
                <div className="flex w-full gap-2 flex-wrap">
                    <label className="">Sources:</label>
                    <Button Name="Add Sources" Icon="add" Padding={`px-1`} Click={()=>{
                        e_sources(prev=>{
                            prev = structuredClone(prev);
                            prev[prev.length] = "";
                            return prev;
                        });
                    }}/>
                </div>
                {
                    v_sources.map((x, i)=>{
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
                            <TextEditorSimple Handle={[v_sources, e_sources]} Dynamic={`${i}`} Size={"sm:ml-3 md:w-[30rem] lg:w-[38.5rem] xl:w-[49rem] "} Placeholder={`Insert source here. . .`} Error={errors.v_sources} />
                        </Fragment>
                    })
                }
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap sm:gap-5 gap-2">
                <Button Name="Create" Click={()=>{
                    router.post('/admin/dashboard/word_attribution/add_submit', {
                        //DATA
                    }, { onFinish:()=>{
                        e_popLoading(false);
                    } });
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
        ]}} />

    </AdminMainUI>
}
