// UTILITIES
import Pop from "./Pop";

// HOOKS
import { useEffect, useState, useRef } from "react";

export default function ColorPicker(Option){
    //** STRUCT */
    let Handler = Option.Handle;
    let Color = Handler[0] ? Handler[0] : "#000000";
    let Size = Option.Size ?? "w-8 h-8";
    let ErrorBag = Option.Error ?? '';

    //**>> Use State */
    const [c_popSwitch, e_popSwitch] = useState(false);
    const [v_selfHEx, e_selfHex] = useState("#0000ff");
    const [c_sliderHue, e_sliderHue] = useState("#0000ff");

    const [c_picking, e_picking] = useState(false);
    const [c_pickingHue, e_pickingHue] = useState(false);
    const [c_plotX, e_plotX] = useState(1);
    const [c_plotY, e_plotY] = useState(0);
    //**<< Use State */

    //** Use REf */
    const ColorCanvas = useRef();
    const SliderCanvas = useRef();
    const SliderPicker = useRef();

    //**>> Color Picker Builder */
    useEffect(()=>{
        fillColorCanvas();
        fillSliderCanvas();
        fillSliderPickerCanvas();
        e_selfHex(Color);
    }, []);
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
    function getHuePlotFromRGB(hex){
        //Split the hex first into array of 3;
        hex = hex.replace("#", "");
        let splitHex = []; //Container for spliting hex into 3
        for (let i = 0; i < 6; i+=2) { //0 2 4
            splitHex.push(hex.slice(i, i+2 ));
        }
        let splitHue = splitHex.map(data=>parseInt(data, 16));//Get the rgb Values here
        //Get the max and min; This is to approximate who is the main hue(max) and the 00 group(min); in case of tie the first value that match will be the main hue;
        let max = Math.max(...splitHue); //Pick who is max and min
        let min = Math.min(...splitHue);
        let imax = splitHue.findIndex(data=>data==max); //Get their Location
        let imin = splitHue.findIndex(data=>data==min);
        imin = imin!=imax?imin: (imin+1)%3 // This formula is used in case all values received is equal;
        let imid = splitHue.findIndex((data, i)=>i!=imax && i!=imin); //FInd the middle ground
        // Contaner for expected RGB
        let x = 0;
        let y = 0;
        let HUE = [0,0,0];
        //Using Matrix coming from other functions (Which is just the same) here for reference;
        HUE[ imax ] = 255;

        HUE[ imid ] = (splitHue[imax] - splitHue[imid]);//check first if it is 0 because we cannot divide a number with zero; Else this will get the gap of mid and max
        HUE[ imid ] = (HUE[ imid ] * 100 ) / ( (1-(splitHue[imin] / splitHue[imax]))*100 );//It fill check ratio of lightness by dividing min and max;
        HUE[ imid ] = splitHue[imax] - HUE [ imid ]; //Now that light is reset
        HUE[ imid ] =  (HUE[ imid ] *100 ) / ( ( splitHue[imax] / 255 )*100 );
        if(!HUE[imid]) //failsafe if value is divided by 0;
            HUE[ imid ] = 0;

        HUE[ imin ] =  0;

        y = 1-( splitHue[imax] / 255 );
        x = 1-( splitHue[imin] / splitHue[imax] );

        //Now that we got the value time for convert rgb to hex
        let HueHEX = HUE.map(data=>(4096+Math.round(data)).toString(16).slice(2,4) );
        return {x:x, y:y, hue:"#"+HueHEX.join("")};
    }
    function plotColor(x, y, hue){
        //Convert Hex Code to Decimal 255
        hue = hue.replace("#", ""); //REmove the # in the code
        let splitHex = []; //Container for spliting hex into 3
        for (let i = 0; i < 6; i+=2) {
            splitHex.push(hue.slice(i, i+2 ));
        }
        let splitHue = splitHex.map(data=>parseInt(data, 16));//Get the rgb Values here
        //Downsize X Y
        x = ((x*100)+1000).toString(); //Making it percentage then add padding then convert to string
        y = ((y*100)+1000).toString();
        x = x.length > 8 ? x.slice(1, 7) : x.slice(1, x.length); // Slice the remaining decimal using string. WHY IN STRING? To prevent floating error like 3.000000000004
        y = y.length > 8 ? y.slice(1, 7) : y.slice(1, y.length);
        x = Number(x); //Then Finally converting it back to Integer
        y = Number(y);
        //Container for RGB Value in Decimal
        let RGB = [];
        //Locate What Matrix it is located
        let Matrix = [
            ["ff", true, "00"], // [true, "ff", "00"]
            ["00", "ff", true], // ["00", true, "ff"]
            [true, "00", "ff"], // ["ff", "00", true]
        ];
        // Run through the Matrix
        for(let i = 0; i < 3; i++){
            if( Matrix[i][i] != splitHex[i] )
                continue;

            if( Matrix[i][(i+2)%3] == splitHex[(i+2)%3] ){ //Start with 0, 2, 4
                RGB[i] =  ((100-y)/100)*255; //Pivot; This will determine saturated level of other rgb so if it is 150 then if reduce the sat then other values will be close to 150
                RGB[(i+1)%3] = ((100-y)/100)*splitHue[(i+1)%3];
                RGB[(i+2)%3] = ((100-x)/100)*RGB[i]; // Since this is 00 we can use hue from plot x to determine saturation;
                // Lastly we need to adjust the one with "true" in matrix
                RGB[(i+1)%3] = ( ((100-x)/100) * (RGB[i] - RGB[(i+1)%3]) ) + RGB[(i+1)%3];
            }else{ //Start with 5, 1, 3
                RGB[i] = ((100-y)/100)*255; //Pivot
                RGB[(i+2)%3] = ((100-y)/100)*splitHue[(i+2)%3];
                RGB[(i+1)%3] = ((100-x)/100)*RGB[i];
                RGB[(i+2)%3] = ( ((100-x)/100) * (RGB[i] - RGB[(i+2)%3]) ) + RGB[(i+2)%3];
            }
            break;
        }
        let RGBHex = RGB.map(data=>(4096+Math.round(data)).toString(16).slice(2,4) ); // 4096 Is the decimal padding of 1000x16
        return "#"+RGBHex.join('');
    }
    function pickColor(e){
        let outsideTrack = ColorCanvas.current.getBoundingClientRect();
        let canvasX = e.clientX - outsideTrack.x;
        let canvasY = e.clientY - outsideTrack.y;
        let Plate = ColorCanvas.current.getContext('2d');
        e_plotX(canvasX/outsideTrack.height);
        e_plotY(canvasY/outsideTrack.width);
        let newHex = plotColor(canvasX/outsideTrack.height, canvasY/outsideTrack.width, c_sliderHue);
        Handler[1](newHex);
        e_selfHex(newHex);
    }
    function pickHue(e){
        let outsideTrack = SliderPicker.current.getBoundingClientRect();
        let canvasY = e.clientY - outsideTrack.y;
        let Hex = getHexFromRatio(canvasY/outsideTrack.height);
        e_sliderHue(Hex);
        fillSliderPickerCanvas(Hex);
        fillColorCanvas(Hex);
        let rgb = plotColor(c_plotX, c_plotY, Hex);
        Handler[1](rgb);
        e_selfHex(rgb);
    }
    function pickColorFromText(e){
        e_selfHex(e.target.value);
        let hexRegex = /^#([0-9a-fA-F]{6})$/
        if(!hexRegex.test(e.target.value)){
            return false;
        }
        let {x, y, hue} = getHuePlotFromRGB(e.target.value);
        e_plotX(x);
        e_plotY(y);
        e_sliderHue(hue);
        let newHex = plotColor(x, y, hue);
        Handler[1](newHex);
        fillColorCanvas(hue);
        fillSliderPickerCanvas(hue);
    }
    function fillColorCanvas(hue = c_sliderHue){
        //Picker
        let Plate = ColorCanvas.current.getContext('2d');

        let gradient2 = Plate.createLinearGradient(0, 0, ColorCanvas.current.width, 0);
        Plate.reset();
        gradient2.addColorStop(0, '#ffffff');
        gradient2.addColorStop(1, hue);
        Plate.fillStyle = gradient2;
        Plate.fillRect(0, 0, ColorCanvas.current.width, ColorCanvas.current.height);

        let graident1 = Plate.createLinearGradient(0, 0, 0, ColorCanvas.current.height);
        graident1.addColorStop(0, 'rgba(0,0,0,0)');
        graident1.addColorStop(1, 'rgba(0,0,0,1)');
        Plate.fillStyle = graident1;
        Plate.fillRect(0, 0, ColorCanvas.current.width, ColorCanvas.current.height );
    }
    function fillSliderCanvas(){
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
    }
    function fillSliderPickerCanvas(hue = c_sliderHue){
        //SliderCanvas But for Picker
        let Plate2 = SliderPicker.current.getContext('2d');
        Plate2.reset();

        let locationY = getHexRatio(hue) * SliderPicker.current.height;
        Plate2.rect(0, locationY-2.5 , SliderPicker.current.width, 5);
        Plate2.strokeStyle = "black";
        Plate2.lineWidth = 1;
        Plate2.fillStyle = hue;
        Plate2.fill();
        Plate2.stroke();

        //Change the FillColor Also
        //
    }
    function PickerDesign(){
        return <div className="flex justify-center">
            <div className="flex flex-col gap-1 mt-2 mb-5">

                <div className="flex gap-1 items-center">
                    <div className="rounded outline outline-1 outline-slate-500 w-5 h-5" style={{backgroundColor:Color}}></div>
                    <div className="flex">
                        <input type="text" value={v_selfHEx} onChange={(e)=>{
                            pickColorFromText(e);
                        }} />
                    </div>
                </div>

                <div className="flex justify-center gap-1">
                    <div className="outline outline-1 outline-slate-500">
                        <canvas className="cursor-crosshair" ref={ColorCanvas} style={{width:`255px`, height:`255px`}} onMouseMove={(e)=>{
                            if(c_picking){
                                pickColor(e);
                            }
                        }} onPointerDown={()=>{
                            e_picking(true);
                        }} onPointerUp={()=>{
                            e_picking(false);
                        }} onPointerLeave={()=>{
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
        {
            ErrorBag ?
            <div>
                <small className='font-light text-red-500'>{ErrorBag}</small>
            </div>
            : ''
        }
        <Pop Switch={[c_popSwitch, e_popSwitch]} BlankPlate={PickerDesign()} Button={[
            {'Name': "Pick", "Func":()=>{e_popSwitch(false)}, Color:'bg-my-green'  },
        ]}/>

    </div>
}
