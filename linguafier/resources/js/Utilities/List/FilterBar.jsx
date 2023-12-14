// UTILITIES
import Pop from "../Pop"
import Button from "../Button"

// HOOKS
import { useRef, useState, createContext, useContext, Fragment } from "react"

// GLOBAL
export const G_filter = createContext();

function Title(){
    const [Name] = useContext(G_filter);
    return <h3 className="text-xl font-semibold">
        {Name}
    </h3>
}

function TextBox(){
    const [Name, Data, Ref, Type, Alter, Index] = useContext(G_filter);
    if(Type == "radio"){
        return Data.Selection.map((x, i)=><div key={i} className="lg:col-span-4 sm:col-span-6 col-span-12">
            <input className="cursor-pointer shadow-myBox1" type="radio" id={x.Ref} checked={x.Ref == Data.Selected} onChange={()=>{
                Alter((prev)=>{
                    let MIRROR = structuredClone(prev);
                    MIRROR[Index].Data.Selected = x.ref;
                    return MIRROR;
                })
            }}/>
            <label htmlFor={x.Ref} className="ml-2 cursor-pointer">{x.Name}</label>
        </div>);
    }else if(Type == "checklist"){
        return Data.map((x, i)=><div key={i} className="lg:col-span-4 sm:col-span-6 col-span-12">
            <input className="cursor-pointer shadow-myBox1" type="checkbox" id={x.Ref} value={x.ref} checked={x.Value === true} onChange={(event)=>{
                Alter((prev)=>{
                    let MIRROR = structuredClone(prev);
                    MIRROR[Index].Data[i].Value = !(MIRROR[Index].Data[i].Value)
                    return MIRROR;
                })
            }}/>
            <label htmlFor={x.Ref} className="ml-2 cursor-pointer">{x.Name}</label>
        </div>);
    }else if(Type == "range" || Type == "range_date"){
        let value;
        let width;
        let type;
        if(Type == "range"){
            value = [Data.Min ? Data.Min : 0, Data.Max ? Data.Max : 0];
            width = [`${(Data.Min.length ? Data.Min.length : 0 ) * .58 + 3 }rem`,`${(Data.Max.length ? Data.Max.length : 0 ) * .58 + 3 }rem`]
            type = "number";
        }else{
            value = [Data.Min ? Data.Min : undefined, Data.Max ? Data.Max : undefined];
            width = [`100%`, `100%`];
            type = "datetime-local";
        }
        return <>
        <div className="flex gap-2 mt-1">
            <label>Min</label>
            <input type={type} className="px-2 border-[1px] resize-x border-black shadow-myBox1 rounded-sm" style={{width:width[0]}} value={value[0]} onChange={(event)=>{
                Alter((prev)=>{
                    let MIRROR = structuredClone(prev);
                    MIRROR[Index].Data.Min = event.target.value;
                    return MIRROR;
                })
            }} />
        </div>
        <div className="flex gap-2 mt-1">
            <label>Max</label>
            <input type={type} className="px-2 border-[1px] resize-x border-black shadow-myBox1 rounded-sm" style={{width:width[1]}} value={value[1]} onChange={(event)=>{
                Alter((prev)=>{
                    let MIRROR = structuredClone(prev);
                    MIRROR[Index].Data.Max = event.target.value;
                    return MIRROR;
                })
            }} />
        </div>
        </>
    }

}

function Plate(){
    const [Name, Data, Ref, Type, Alter, Index] = useContext(G_filter);
    return <div>
        <Title />
        <div className={`${Type == "checklist" || Type == "radio" ?" grid grid-cols-12 auto-rows-max md:gap-x-10 sm:gap-x-5 gap-x-2":""}`}>
            <TextBox />
        </div>
    </div>
}

function Combiner(v_filter, e_filter){
    return  <div className="flex flex-wrap justify-between gap-8 sm:gap-4 mb-6">
        {v_filter.map((x, i)=>{
            return <Fragment key={i}>
                <G_filter.Provider  value={[x.Alias, x.Data, x.Ref, x.Type, e_filter, i]}>
                    <Plate />
                </G_filter.Provider>
            </Fragment>

        })}
    </div>

}

export default (Option)=>{
    //** Struct */
    let [v_filter, e_filter] = Option.Filter;

    //** Use State */
    const [ v_popSwitch, e_popSwitch ] = useState(false);
    const [ v_oldFilter, e_oldFilter ] = useState([]);

    //** Use Ref */

    return <>
        <Button Icon={'filter'} Name="Filter" Click={()=>{e_popSwitch(true); e_oldFilter(v_filter)  }}/>
        <Pop Switch={[ v_popSwitch, e_popSwitch ]} BlankPlate={Combiner(v_filter, e_filter)} Width={`35rem`} Button={[
            {'Name': "Save", "Func":"close", Color:'bg-slate-400' },
            {'Name': "Reset", "Func":()=>{e_filter(v_oldFilter)}, Color:'bg-slate-400' },
        ]}/>

    </>
}
