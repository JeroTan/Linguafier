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
    const { data, errors, variationDrop, attributeDrop, rarityDrop, languageDrop, synonymsDrop, antonymsDrop, homonymsDrop, headDrop, sideDrop, tailDrop, storageWordLibrary } = usePage().props;

    //**>> Use State */
    const [ v_keyname, e_keyname ] = useState("");
    const [ v_language, e_language ] = useState({name:"", id:""});

    const [ v_variation, e_variation ] = useState([]);
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
    const v_heirarchymap = {
        tail: useState([]),
        side: useState([]),
        head: useState([]),
    };
    const [v_origin, e_origin] = useState("");
    const [v_images, e_images] = useState([""]);
    const [v_sources, e_sources] = useState([]);


    const [c_disabled, e_disabled ] = useState(true);
    const [v_popSwitch, e_popSwitch] = useState(false);
    const [v_popPick, e_popPick] = useState("WarningDelete");
    const [v_popFlash, e_popFlash] = useState(false);
    const [v_popLoading, e_popLoading] = useState(false);
    //**<< Use State */

    //** STRUCT */
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
                            //Data
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

    //** Functionality */
    function isUnchange(){
        return (
            true //data
        )
    }
    function resetData(){
        //Data
    }
    return <AdminMainUI>
        {/* Navigation */}
        <div className='flex flex-wrap gap-2'>
            <Button  Icon={`back`} Click={()=>{router.get('/admin/dashboard/word_library')}}/>
        </div>
        {/* Modify Section */}

        {/* POP */}
        <Pop Switch={[v_popSwitch, e_popSwitch]} Content={popContent} Pick={v_popPick} />
        <PopLoading Switch={[v_popLoading, e_popLoading]} />
        <PopFlash Switch={[v_popFlash, e_popFlash]} Button={{0:[
            {'Name': "Good", "Func":"close", Color:'bg-my-green'  },
        ]}} />
    </AdminMainUI>
}
