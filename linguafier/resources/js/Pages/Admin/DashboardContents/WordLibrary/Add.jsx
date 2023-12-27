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


// HOOKS
import { Fragment, useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default ()=>{
    //** Use Page */
    const { errors, variationDrop, attributeDrop, rarityDrop, languageDrop } = usePage().props;


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
        head: useState([]),
        side: useState([]),
        tail: useState([]),
    };
    const v_origin = useState("");
    const v_images = ({
        first:useState([]),
        second:useState([]),
        third:useState([]),
    });
    const v_sources = useState([]);

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
            return remake;
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
            <div className="flex flex-col gap-1">
                <label className="">Key Name: </label>
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
                    if(v_definition[x.id] && v_pronounciation[x.id] && v_example[x.id]){
                        return true;
                    }else{
                        return false;
                    }
                }).map((x, i)=>{ //Then Spread the arrry into text
                    return <Fragment key={i}>

                    </Fragment>
                }) : ""
            }


            {/* Other Details */}


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
