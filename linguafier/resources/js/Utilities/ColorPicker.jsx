// UTILITIES
import Pop from "./Pop";

// HOOKS
import { useEffect, useState, useRef } from "react";

export default function ColorPicker(Option){
    //** STRUCT */
    let Handler = Option.Handle;
    let Color = Handler[0] ? Handler[0] : "#000000";
    let Size = Option.Size ?? "w-8 h-8";

    //**>> Use State */
    const [c_popSwitch, e_popSwitch] = useState(false);

    const [c_sliderHue, e_sliderHue] = useState("#0000ff");
    const [c_picking, e_picking] = useState(false);
    const [c_pickingHue, e_pickingHue] = useState(false);
    //**<< Use State */

    //** Use REf */
    const ColorCanvas = useRef();
    const SliderCanvas = useRef();
    const SliderPicker = useRef();

    //**>> Color Picker Builder */
    useEffect(()=>{
        //SliderCanvas
        let Plate2 = SliderCanvas.current.getContext('2d');

        let sliderGrad = Plate2.createLinearGradient(0, 0, 0, SliderCanvas.current.height);
        sliderGrad.addColorStop(0.00, "#ff0000");
        sliderGrad.addColorStop(0.08, "#ff7F00");
        sliderGrad.addColorStop(0.16, "#ffff00");
        sliderGrad.addColorStop(0.25, "#7Fff00");
        sliderGrad.addColorStop(0.33, "#00ff00");
        sliderGrad.addColorStop(0.42, "#00ff7F");
        sliderGrad.addColorStop(0.50, "#00ffff");
        sliderGrad.addColorStop(0.58, "#007Fff");
        sliderGrad.addColorStop(0.66, "#0000ff");
        sliderGrad.addColorStop(0.75, "#7F00ff");
        sliderGrad.addColorStop(0.83, "#ff00ff");
        sliderGrad.addColorStop(0.92, "#ff007F");
        sliderGrad.addColorStop(1.00, "#fe0000");
        Plate2.fillStyle = sliderGrad;
        Plate2.fillRect(0, 0, SliderCanvas.current.width, SliderCanvas.current.height);
    }, []);
    useEffect(()=>{
        //Picker
        let Plate = ColorCanvas.current.getContext('2d');

        let gradient2 = Plate.createLinearGradient(0, 0, ColorCanvas.current.width, 0);
        Plate.reset();
        gradient2.addColorStop(0, '#ffffff');
        gradient2.addColorStop(1, c_sliderHue);
        Plate.fillStyle = gradient2;
        Plate.fillRect(0, 0, ColorCanvas.current.width, ColorCanvas.current.height);

        let graident1 = Plate.createLinearGradient(0, 0, 0, ColorCanvas.current.height);
        graident1.addColorStop(0, 'rgba(0,0,0,0)');
        graident1.addColorStop(1, 'rgba(0,0,0,1)');
        Plate.fillStyle = graident1;
        Plate.fillRect(0, 0, ColorCanvas.current.width, ColorCanvas.current.height );

        //SliderCanvas But for Picker
        let Plate2 = SliderPicker.current.getContext('2d');
        Plate2.reset();
        console.log(SliderPicker.current.width, SliderPicker.current.height);

        let locationY = getHexRatio(c_sliderHue) * SliderPicker.current.height;
        Plate2.rect(0, locationY-2.5 , SliderPicker.current.width, 5);
        Plate2.strokeStyle = "black";
        Plate2.lineWidth = 1;
        Plate2.fillStyle = c_sliderHue;
        Plate2.fill();
        Plate2.stroke();
    }, [c_sliderHue])
    //**<< Color Picker Builder */

    //**Functionality */
    //MatrixSolver
    function getHexRatio(x){
        let Matrix = [
            ["ff", true, false], // [true, "ff", false]
            [false, "ff", true], // [false, true, "ff"]
            [true, false, "ff"], // ["ff", false, true]
        ];
        x = x.replace("#", ""); //REmove the # in the code
        let splitHex = []; //Container for spliting hex into 3
        for (let i = 0; i < 6; i+=2) {
            splitHex.push(x.slice(i, i+2 ));
        }
        //Code for solving the location of Hex
        let Index = 0;
        for(let i = 0; i < 3; i++){
            if(Matrix[i][i] == splitHex[i] ){
                let value = 0;
                let multiplier = i*2; // 0 2 4
                if( Matrix[i][(i+2)%3] == parseInt(splitHex[(i+2)%3], 16) ){ //Start with 0, 2, 4
                    value = parseInt(splitHex[(i+1)%3], 16);
                    multiplier = multiplier;
                }else{ //Start with 5, 1, 3
                    value = 255 - parseInt(splitHex[(i+2)%3], 16);
                    multiplier = (multiplier+5)%6 ;
                }
                Index = value+(255*multiplier);
                break;
            }
        }
        Index = Index % 1530;
        return Index / 1530;
    }
    function getHexFromRatio(x){
        //Code for solving the location of Hex
        let Hex = [false, false, false];
        let Index = 0;
        let prevIndex = 0;
        for(let i = 0; i < 6; i++){
            Index = (255*(i+1));
            if(prevIndex/1530 < x && x < Index/1530 ){
                let gap = (x-(prevIndex/1530)) / ((Index/1530) - (prevIndex/1530));
                if(i == 0 || i == 2 || i == 4){ //0 2 4
                    Hex[Math.floor(i/2)] = "ff";
                    Hex[((Math.floor(i/2))+2)%3] = "00";
                    let tempHex = parseInt((1000+(gap*255)).toString().slice(1,4)).toString(16);
                    tempHex = tempHex.length < 2 ? "0"+tempHex : tempHex;
                    Hex[((Math.floor(i/2))+1)%3] = tempHex;

                }else{ //1 3 5
                    Hex[((Math.floor(i/2))+1)%3] = "ff";
                    Hex[((Math.floor(i/2))+2)%3] = "00";
                    let tempHex =  parseInt((1000+(255-(gap*255))).toString().slice(1,4)).toString(16);
                    tempHex = tempHex.length < 2 ? "0"+tempHex : tempHex;
                    Hex[Math.floor(i/2)] = tempHex;
                }
                break;
            }
            prevIndex = Index;
        }
        // FAILSAFE
        for(let i = 0; i < 3; i++){
            if(Hex[i] === false || Hex[i] === null || Hex[i] === undefined){
                Hex = ["ff", "00", "00"];
            }
        }
        return "#"+Hex.join('');
    }
    function pickColor(e){
        let outsideTrack = ColorCanvas.current.getBoundingClientRect();
        let canvasX = e.clientX - outsideTrack.x;
        let canvasY = e.clientY - outsideTrack.y;
        let Plate = ColorCanvas.current.getContext('2d');
        let pixelData = Plate.getImageData(canvasX, canvasY, 1, 1)['data'];
    }
    function pickHue(e){
        let outsideTrack = SliderPicker.current.getBoundingClientRect();
        let canvasY = e.clientY - outsideTrack.y;
        let Hex = getHexFromRatio(canvasY/outsideTrack.height);
        e_sliderHue(Hex);
    }
    function PickerDesign(){
        return <div className="flex justify-center">
            <div className="flex flex-col gap-1 mt-2 mb-5">

                <div className="flex gap-1 items-center">
                    <div className="rounded outline outline-1 outline-slate-500 w-5 h-5" style={{backgroundColor:Color}}></div>
                    <div>{Color}</div>
                </div>

                <div className="flex justify-center gap-1">
                    <div className="outline outline-1 outline-slate-500">
                        <canvas className="cursor-crosshair" ref={ColorCanvas} style={{width:`255px`, height:`255px`}} onMouseMove={(e)=>{
                            if(c_picking){
                                pickColor(e);
                            }
                        }} onMouseDown={()=>{
                            e_picking(true);
                        }} onMouseUp={()=>{
                            e_picking(false);
                        }} onMouseLeave={()=>{
                            e_picking(false);
                        }} onClick={(e)=>{
                            pickColor(e);
                        }}></canvas>
                    </div>
                    <div className="outline outline-1 outline-slate-500 relative" style={{width:"25px", height:"255px"}}>
                        <canvas className="absolute" ref={SliderCanvas} style={{width:"25px", height:"255px"}}></canvas>
                        <canvas className="absolute cursor-grabbing" ref={SliderPicker} style={{width:"25px", height:"255px"}} onMouseMove={(e)=>{
                            if(c_pickingHue){
                                pickHue(e);
                            }
                        }} onMouseDown={()=>{
                            e_pickingHue(true);
                        }} onMouseUp={()=>{
                            e_pickingHue(false);
                        }} onMouseLeave={()=>{
                            e_pickingHue(false);
                        }} onClick={(e)=>{
                            pickHue(e);
                        }}></canvas>
                    </div>
                </div>

            </div>
        </div>

    }


    return <div className="">
        <div className={`${Size} rounded outline outline-2 outline-slate-500 cursor-pointer hover:outline-4`} style={{backgroundColor:Color}} onClick={()=>{
            e_popSwitch(true);
        }}></div>
        <Pop Switch={[c_popSwitch, e_popSwitch]} BlankPlate={PickerDesign()} Button={[
            {'Name': "Pick", "Func":()=>{Handler[1]("#AAAAAA"); e_popSwitch(false)}, Color:'bg-my-green'  },
        ]}/>

    </div>
}
