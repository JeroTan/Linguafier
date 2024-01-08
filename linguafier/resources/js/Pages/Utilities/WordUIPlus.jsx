import PagePlate from '../../Utilities/PagePlate';
import SideNav from '../../Utilities/SideNav';
// HOOKS
import { useState, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { usePage } from '@inertiajs/react';
import { G_PageSection } from '../../Utilities/GlobalProvider';



export default function WordUIPlus(Body){
    const [SectionSelected] = useContext(G_PageSection);
    //**>> Use State */
    const thisSectSelect = SectionSelected ?? useState('Word');

    //**<< Use State */
    //** Struct */
    const PageSection = useMemo(()=>{
        let SectionLinks = [
            {Name:"Word", Link:false, Selected:false, Func:false},
            {Name:"Details", Link:false, Selected:false, Func:false}, //Variation Rarity Attributes Language
            {Name:"Definition", Link:false, Selected:false, Func:false}, //Variation Varname Pronounciation Definition
            {Name:"Relationyms", Link:false, Selected:false, Func:false},
            {Name:"Hierarchymap", Link:false, Selected:false, Func:false},
            {Name:"Lore", Link:false, Selected:false, Func:false},
            {Name:"Images", Link:false, Selected:false, Func:false},
            {Name:"Sources", Link:false, Selected:false, Func:false},
        ];
        SectionLinks.forEach(x => {
            x.Selected = (x.Name == thisSectSelect[0]);
            x.Func = ()=>thisSectSelect[1](x.Name);
        });
        return SectionLinks;
    },[thisSectSelect[0]]);


    /////// Please add custom side that will scroll through the pages instead of links got it:?
    return <PagePlate>
        <div className='flex md:flex-nowrap flex-wrap lg:gap-4 gap-3 py-10 px-2 max-w-[90rem] mx-auto '>
            <SideNav Link={PageSection} />
            <div className='shrink w-full'>
                <G_PageSection.Provider value={thisSectSelect}>
                    <main className='shrink border-2 p-2 border-black rounded-md'>
                        {Body.children}
                    </main>
                </G_PageSection.Provider>
            </div>
        </div>
    </PagePlate>
}
