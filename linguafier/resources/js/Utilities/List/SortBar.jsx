// UTILITIES
import Icon from "../Icon";

// HOOKS
import { useEffect, useRef } from "react"

export default (Option)=>{
    //** STRUCT */
    let [ v_sort, e_sort ] = Option.Sort;
    let keySort = {};
    for(let i = 0; i < v_sort.length; i++){
        keySort[v_sort[i].Ref] = v_sort[i].Sort;
    };

    //** Use Ref */
    let FixedLabel = useRef(Option.Sort[0]);
    useEffect(()=>{
        FixedLabel.current = v_sort;
    }, [v_sort.length, v_sort.map(x=>x.Name), v_sort.map(x=>x.Ref)]);

    //** Render */
    return <div className="flex flex-wrap gap-2">
        { FixedLabel.current.map((x, i)=>{
            return <div key={i} className="cursor-pointer flex items-center" onClick={()=>{
                    e_sort((prev)=>{
                        let mirror = [...prev];
                        let index = prev.findIndex(item=>item.Ref == x.Ref);
                        let [ ItemToMove ] = mirror.splice(index, 1);
                        mirror.splice(0, 0, ItemToMove);
                        mirror[0].Sort = mirror[0].Sort == 'ASC' ? 'DESC' : 'ASC';
                        console.log(mirror);
                        return mirror;
                    })
                }}>
                <h3 className="">{x.Name}</h3>
                <Icon Name={  keySort[x.Ref] == 'ASC' ?'up' : 'down' } InClass={  v_sort[0].Ref == x.Ref ? `fill-my-green` : `fill-black`} OutClass={`w-5 h-5`} />
            </div>
        }) }
    </div>

}
