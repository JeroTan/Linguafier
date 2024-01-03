// Utilities
import Pop from "./Pop";


// Hooks
import { useState, useEffect, useContext, createContext, useRef, useMemo, useCallback, Fragment } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Stage, Layer, Star, Text } from 'react-konva';

//** Create Context */
export const G_Data = createContext();

export default function HeirarchyMap(Option){
    //** Use Page */
    const { getAllMapNodes } = usePage().props;


    //**>> Struct */
    let Handler = Option.Handle;
    let RootName = Option.RootName ?? "Word";
    let Dynamic = Option.Dynamic ?? false;
    let PopSwitch = Option.PopSwitch ?? undefined;
    let MapSwitch = Option.MapSwitch ?? undefined;
    let OffMapSwitch = Option.OffMapSwitch ?? false;
    //**<< Struct */

    //**>> UseState */
    const [c_popSwitch, s_popSwitch] = PopSwitch ?? useState(false);
    const [c_mapSwitch, s_mapSwitch] = MapSwitch ?? useState(true);
    const [c_windowSize, s_windowSize] = useState([window.innerWidth, window.innerHeight]);
    //**<< UseState */

    //**>> Use Ref */
    const StageContainer = useRef();
    //**<< Use Ref */



    //**>> Helper */
    const e_domainExpansion = useCallback((energy, limitless, voided)=>{// Traverse through depth by 1 or infinitely;
        // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
        // energy - the Full Object/Array; Limitless is the array to traverse; Voided is the value to insert at the end of limitless;
        if(limitless.length < 1){
            return voided;
        }
        //-------------------------------------Traverse Next Arr/Obj---Reduce the limitless by 1----ValueNeededToInsert
        energy[limitless[0]] = e_domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || [], voided);
        return energy;
    }, []);
    const v_domainExpansion = useCallback((energy, limitless)=>{// Traverse through depth by 1 or infinitely;
        // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
        // energy - the Full Object/Array; Limitless is the array to traverse;
        if(limitless.length == 1){
            return energy[limitless[0]]
        }
        //----------------Traverse Next Arr/Obj---Reduce the limitless by 1----
        v_domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || []);
        return energy;
    }, []);
    const redirectLink = useCallback((id)=>{
        return "/words/"+id;
    }, []);
    const HandlerFixed = useMemo(()=>{
        return Handler[0];
    }, [Handler[0], Dynamic]);
    const requestMapNode = useCallback(()=>{
        router.post('/getAllMapNodes', {
            getAllMapNodes: HandlerFixed,
        }, { preserveScroll: true,
        onFinish:(visit)=>{

        }} );
    }, [HandlerFixed]);
    //**<< Helper */

    //**>> Use Effect */
    useEffect(()=>{
        requestMapNode();
    }, [HandlerFixed]);
    useEffect(()=>{
        if(OffMapSwitch){
            s_mapSwitch(false);
        }
    }, [OffMapSwitch]);
    useEffect(()=>{
        window.addEventListener('resize', ()=>{
            s_windowSize([
                window.innerWidth,
                window.innerHeight,
            ]);
        });
    }, []);
    //**<< Use Effect */


    //**>> Functionality */
    const mapDesign = useCallback(()=>{
        if(!getAllMapNodes)
            return <></>
        return <MapDesign />
    }, [getAllMapNodes, RootName, c_windowSize]);
    //**<< Functionality */

    //** Render */
    return <G_Data.Provider value={[getAllMapNodes, RootName, c_windowSize, s_windowSize]}>
        { c_mapSwitch ?
            <div className="flex w-full">
                {mapDesign()}
            </div>
        : ""}

        {/* Pop */}
        <Pop Switch={[c_popSwitch, s_popSwitch]} BlankPlate={ mapDesign() } Width={`72rem`} />
    </G_Data.Provider>
}

//Other Components
function MapDesign(){
    const [getAllMapNodes, RootName, c_windowSize, s_windowSize] = useContext(G_Data);

    //**>> Use Ref */
    const StageContainer = useRef();
    //**<< Use Ref */

    //**>> Use State */
    const [c_movement, s_movement] = useState([0,0]);
    //**<< Use State */

    //**>> Use Effect */

    //**<< Use Effect */


   //** Render */
   return <div ref={StageContainer} className="relative w-full flex justify-center items-center" style={{height: c_windowSize[1]-100}}>
        <Stage width={ c_windowSize[0] > 1100 ? 1000 : c_windowSize[0]*.85 } height={c_windowSize[1]*.85} onMouseMove={(e)=>{
            //Rotate Through Shapes or Nodes if it is click along with the Canvas
            console.log(23214);
            //If not clicking then move the canvas
            let x = e.evt;
            let y =  e.evt;
            console.log(x, y);
        }}>

        </Stage>
    </div>
}
