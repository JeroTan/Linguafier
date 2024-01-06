// UTILITIES
import SideNav from "../../../Utilities/SideNav"

//HOOKS
import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';


export default function SideNav2(Option){
    /** Use Page */
    const {getPrivileges} = usePage().props;
    const privList = useMemo(()=>{
        let privilege = JSON.parse(getPrivileges);
        let list = [{Name:"Elder Dashboard", Link:"/admin/dashboard", Selected:(Option.Select == "Dashboard" ? true : false)}];

        if(privilege['Manage Special User']){
            list[list.length] = {Name:"Special Users", Link:"/admin/dashboard/special_user", Selected:(Option.Select == "User" ? true : false)};
        }
        if(privilege['Manage Wizard']){
            list[list.length] =  {Name:"Overseer Wizard", Link:"/admin/dashboard/overseer_wizard", Selected:(Option.Select == "Wizard" ? true : false)};
        }
        if(privilege['Manage Wizard Rank']){
            list[list.length] = {Name:"Wizard Ranks", Link:"/admin/dashboard/wizard_ranks", Selected:(Option.Select == "Rank" ? true : false)};
        }
        if(privilege['Manage Word Library']){
            list[list.length] = {Name:"Word Library", Link:"/admin/dashboard/word_library", Selected:(Option.Select == "Word" ? true : false)};
        }
        if(privilege['Manage Word Attributes']){
            list[list.length] = {Name:"Word Attribution", Link:"/admin/dashboard/word_attribution", Selected:(Option.Select == "Attribute" ? true : false)};
        }
        if(privilege['Manage Roles']){
            list[list.length] = {Name:"Roles & Privilege", Link:"/admin/dashboard/roles", Selected:(Option.Select == "Role" ? true : false)};
        }
        return list;
    }, [getPrivileges]);


    return <>
        <SideNav Link={privList}/>
    </>
}
