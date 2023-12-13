// UTILITIES
import Pop from "../Pop"
import Button from "../Button"

// HOOKS
import { useRef, useState, createContext, useContext } from "react"

// GLOBAL
export const G_filter = createContext();

function Title(){
    const {Name} = useContext(G_filter);
    return <h3 className="text-xl font-semibold">
        {Name}
    </h3>
}

function TextBox(){
    const {Name, Data, Ref, Type, Alter, Index} = useContext(G_filter);
    if(Type == "radio"){
        return Data.Selection.map((x, i)=><div key={i} className="lg:col-span-4 sm:col-span-6 col-span-12">
            <input  type="radio" id={x.Ref} checked={x.Ref == Data.Selected} onChange={()=>{
                Alter((prev)=>{
                    prev[Index].Data.Selected = x.ref;
                    return prev;
                })
            }}/>
            <label htmlFor={x.Ref} className="ml-2">{x.Name}</label>
        </div>);
    }else if(Type == "checklist"){
        return Data.map((x, i)=>{  return <div key={i} className="lg:col-span-4 sm:col-span-6 col-span-12">
            <input  type="checkbox" id={x.Ref} value={x.ref} checked={x.Value === true} onChange={(event)=>{
                console.log(event);
                Alter((prev)=>{
                    prev[Index].Data[i].Value = !(prev[Index].Data[i].Value);
                    return prev;
                })
            }}/>
            <label htmlFor={x.Ref} className="ml-2">{x.Name}</label>
        </div>} );
    }else if(Type == "range"){
        return <div className="">
            <label>Min</label>
            <input type="number" value={Data.Min ? Data.Min : 0} onChange={(event)=>{
                Alter((prev)=>{
                    prev[Index].Data.Min = event.target.value;
                    return prev;
                })
            }} />
            <label>Max</label>
            <input type="number" value={Data.Max ? Data.Max : 0} onChange={(event)=>{
                Alter((prev)=>{
                    prev[Index].Data.Max = event.target.value;
                    return prev;
                })
            }} />
        </div>
    }else if(Type == "range_date"){
        return <div className="">
            <label>Min</label>
            <input type="datetime-local" value={Data.Min ? Data.Min : undefined } onChange={(event)=>{
                Alter((prev)=>{
                    prev[Index].Data.Min = event.target.value;
                    return prev;
                })
            }} />
            <label>Max</label>
            <input type="datetime-local" value={Data.Max ? Data.Max : undefined} onChange={(event)=>{
                Alter((prev)=>{
                    prev[Index].Data.Max = event.target.value;
                    return prev;
                })
            }} />
        </div>
    }

}

function Plate(){
    const {Name, Data, Ref, Type, Alter, Index} = useContext(G_filter);
    return <div className={`${Type != "range"?"w-full":""}`}>
        <Title />
        <div className={`${Type != "range"?"w-full":" grid grid-cols-12 auto-rows-max md:gap-10 sm:gap-5 gap-2"}`}>
            <TextBox />
        </div>
    </div>
}

function Combiner(v_filter, e_filter){
    return  <div className="flex flex-wrap gap-2">
        {v_filter.map((x, i)=>{
            return <G_filter.Provider key={i} value={{Name:x.Alias, Data:x.Data, Ref:x.Ref, Type:x.Type, Alter:e_filter, Index:i}}>
                <Plate />
            </G_filter.Provider>
        })}
    </div>

}

export default (Option)=>{
    //** Struct */
    let [v_filter, e_filter] = Option.Filter;

    //** Use State */
    const [ v_popSwitch, e_popSwitch ] = useState();

    //** Use Ref */
    const oldFilter = useRef(v_filter).current;

    return <>
        <G_filter.Provider value={[v_filter, e_filter]}>
            <Button Icon={'filter'} Name="Filter" Click={()=>e_popSwitch(true)}/>
            <Pop Switch={[ v_popSwitch, e_popSwitch ]} BlankPlate={Combiner(v_filter, e_filter)}  Button={[
                {'Name': "Save", "Func":"close", Color:'bg-slate-400' },
                {'Name': "Reset", "Func":()=>{e_popSwitch(false); e_filter(oldFilter)}, Color:'bg-slate-400' },
            ]}/>
        </G_filter.Provider>
    </>
}
