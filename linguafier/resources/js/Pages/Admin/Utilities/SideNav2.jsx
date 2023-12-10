// UTILITIES
import SideNav from "../../../Utilities/SideNav"


export default function SideNav2(Option){


    return <>
        <SideNav Link={[
            {Name:"Elder Dashboard", Link:"/admin/dashboard", Selected:(Option.Select == "Dashboard" ? true : false)},
            {Name:"Special Users", Link:"/admin/dashboard/special_user", Selected:(Option.Select == "User" ? true : false)},
            {Name:"Wizard Ranks", Link:"/admin/dashboard/wizard_ranks", Selected:(Option.Select == "Rank" ? true : false)},
            {Name:"Overseer Wizard", Link:"/admin/dashboard/overseer_wizard", Selected:(Option.Select == "Wizard" ? true : false)},
            {Name:"Word Library", Link:"/admin/dashboard/word_library", Selected:(Option.Select == "Word" ? true : false)},
            {Name:"Word Attribution", Link:"/admin/dashboard/word_attribution", Selected:(Option.Select == "Attribute" ? true : false)},
            {Name:"Roles & Privilege", Link:"/admin/dashboard/roles", Selected:(Option.Select == "Role" ? true : false)},
        ]}/>
    </>
}
