// Utilities
import Pop from "./Pop";
import Loading from "./Loading";


// Hooks
import { useState, useEffect, useContext, createContext, useRef, useMemo, useCallback, Fragment } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Stage, Layer, Star, Circle, Text, Line, Rect, Group } from 'react-konva';

//** Create Context */
export const G_Data = createContext();
export const G_ForeGroundData = createContext("");

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
            console.log('here');
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
            return <div>
                <Loading />
            </div>
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
        <Pop Switch={[c_popSwitch, s_popSwitch]} BlankPlate={ mapDesign() } Width={`100%`} />
    </G_Data.Provider>
}

/*
lccccccc;;;:cc:lo:;;;;;;;,,,;;:cccc:cxKk:;:;,,:ccccccccccoKWNNWXkO0OO0O00l;lo:ccc;';xWMMMMKdkOOkl;;''';xOk00Oxc:xdcc;,;;cdddOXXNWWWXNNKKKKK0kKWWWWWWWWWWWWMXOkOOO00OxxdOKkxOOx,
lccccccc;,';:::cdo;;;;;;:;;;:cccc:::kKxlol,,;;:cccccccccoKNXKko:;c:,,;:ll,.cc;:lc:,xNMMWWM0dkkkxc;;''';kKKKKOOdcxKXKo:llcll:;lkXWWWWXNX0K0KKkOWMWMWWWWWWWWWWKoclcdOOdllk0xddol'
lccccccc;,.';;:;:dl;;;;;;;:cc:::;;:oOkxOXXd;,:,';;::::::oXXkc,,;,,;:;,dKx'.cl;:lc::xNMMMWW0odxxdc;;'',lOO000OOOOk0WXdoxdccol:clkNWWWWNXOO00KkkNWNNNK0OkOOOOOkdlcoO0kO0KK0kd;...
lccccccc;,..';;;;:c;;::;;::;,'',,;c;codkKNNk;,',;'..':l:oK0kc,::;codolkNx,oXk:cccc:ckWMWMM0loxxdc;;,';okk00OOO0kk0NNOxO0kkkxxKK0NWWMWWN0k0000k0Xkolc:;;:c;,,;dOOKK0kOKKK0Oo,..;
lccccccc;',,',,,;lxo:clcc;,'''',;;,,;,'cdkKXd:c:;,.,o0XkokNWkcdkxO00Ox0NOONXo:ccccc;c0WMWWXolxxdc;:,,,oOO00OO00xkKXXKkk00OOOXWWWWWWWMWMXOKX00kk0kdcclccll:;lkxc:oxOO0KKK0x:,'';
lcccccc:,,;;'',;d00kl:c;;'.cOd;;c:;:lo:oXXOdlxxc:cxXWWWWNKNWNOxkO00kxOXXX0kd::cccccc;lKMWWW0ooxxc;:;,,okO0KKKK0xkXXXXK0000KNNWWWWWWWWWMW00NX0kkKW0xddc:ldlo0Xx;,:cdk0KK0Ol,,',:
::cccc:,::;;;'.;ONKkc:ccc::dKKlcxxdxOOkOXXkkKNXxcxNWWWWWWWWWWN0OOOO0KXKKKOc,:c:cccclc:OMMMWWXdclc;:;,;okk0KKKKKk0XXXXXNNNNNNNWWWWWWWWWWWN0KWNKk0NXOO0OkkkOXNKdcx0K0O0KK0x;,'';;
::ccc;';cc;;;;,'oXNklcccc:lOKX0dxO0KKOx0NWWWWWWWXKXWWWWWWWWWWWWWWNNXXKOkOOl;:oxc:llccl0MMWMMWN0xlccc;cxkk0KKKKKxOXXXXNNNNNNNWWWWWWWWWWWWWNKKWWXKKXOkO0OkOXNX00KKKK0OKKKOc,'';:;
 */




//Other Components
function MapDesign(){
    const [getAllMapNodes, RootName, c_windowSize, s_windowSize] = useContext(G_Data);

    //**>> Use Ref */
    const StageContainer = useRef();
    const TheStage = useRef();
    //**<< Use Ref */

    //**>> Use State */
    const [c_movement, s_movement] = useState([0,0]);
    const [c_scale, s_scale] = useState(1);
    const [c_mouseDownPos, s_mouseDownPos] = useState(false);
    const [c_stageCursor, s_stageCursor] = useState('default');
    const [c_moreCurr, s_moreCurr] = useState({head:[], tail:[], side:{data:[],counter:0}});//Depth Limit of side is 10 each 10 will increase its counter
    const [c_scrollCount, s_scrollCount] = useState({friction:0, direction:0});//Use This to prevent Scroll Spam; positive direction means up negative means down
    //**<< Use State */

    //**>> Helper */
    const mapSize = useMemo(()=>{
        return [c_windowSize[0]-100, c_windowSize[1]-100]; //The ratio is 1000 x 800
    }, [c_windowSize, ...c_windowSize]);
    const screenRatio = useMemo(()=>{
        return mapSize[1]>0 ? (mapSize[0]/mapSize[1]) : 0
    }, [mapSize, ...mapSize]);
    //**<< Helper */

    //**>> Use Effect */
    useEffect(()=>{
        s_moreCurr(prev=>{
            prev.head = getAllMapNodes.head;
            prev.tail = getAllMapNodes.tail;
            prev.side ={ data:getAllMapNodes.side,counter:0  };
            return structuredClone(prev);
        });
    }, [getAllMapNodes]);

    //**<< Use Effect */

    //**>> LayeredComponents */
    const BackgrounFill = useCallback(()=>{
        let width = mapSize[0];
        let height = mapSize[1];
        let gap = (height / 10) * c_scale;


        //Left to right means left to right line stroke
        let LeftToRight = parseInt(Math.round(    12*( c_scale>0 ? (1/c_scale) :0 )  ));
        //Up To Down means top to bottom line stroke
        let UpToDown = parseInt(Math.round(    12*( c_scale>0 ? (1/c_scale) :0 ) * (screenRatio)   ));

        if(LeftToRight+UpToDown <= 0){ //Return nothing if all the result of the formula returns 0
            return <></>
        }

        let BG = [...Array(LeftToRight+UpToDown)].map((x,i)=>{
            //LeftToRight
            let position = [ 0,(gap*(i))-(gap*.5),  width,(gap*(i))-(gap*.5) ];
            let xPos = 0;
            let yPos =  c_movement[1] % (gap); //The only movable is up down

            if(i>=LeftToRight){
                //UpToDown
                let j = i - LeftToRight;
                position = [ (gap*(j))-(gap*.5),0,   (gap*(j))-(gap*.5),height ];
                xPos = c_movement[0] % (gap) //The only movable is left right
                yPos = 0;
            }

            return <Line
                key={i}
                id={`${i+1}`}
                x={ xPos }
                y={ yPos }
                points={position}
                strokeWidth={1*c_scale}
                stroke={`rgb(203 213 225)`}

            />
        });
        return BG;
    }, [...mapSize, c_movement, c_scale]);
    const ForegroundFill = useCallback(()=>{
        //A function that will traverse through the depth of data
        //Initial iteration won't have button because it is a root
        //Energy is the actual data and direction is either head or tail; limitless will tell what key per depth is us
        function domainExpansionI(energy, direction, mapLoc, limitless = [0],){
            let ThisComponents = [];
            let sidePush = 320;
                if(direction == 'tail')
                    sidePush *= -1;
            let downPush = 30+70;


            for(let i = 0; i < energy.length; i++){
                ThisComponents[ThisComponents.length] = <BoxWord
                    X={mapLoc[0]}
                    Y={mapLoc[1]+(downPush*i)}
                    key={`${limitless.length}_${limitless[limitless.length-1]}_${i}`}
                    ID={`${limitless.length}_${limitless[limitless.length-1]}_${i}`}
                    Type={direction}
                    Location={i}
                    Limitless={limitless}
                    Text={energy[i].name==""?"<>":energy[i].name}
                    HeadCount={direction=='head'? energy[i].head.length :0}
                    TailCount={direction=='tail'? energy[i].tail.length :0}
                    SideExist={false}
                />
            }

            for(let i = 0; i < energy.length; i++){
                if((energy[i][direction]).length <= 0 || energy[i].open == false )
                    continue;

                ThisComponents = [...ThisComponents, domainExpansionI(energy[i][direction], direction, [mapLoc[0]+sidePush, mapLoc[1]+(downPush*i)], [...limitless, i] )]
            }

            return ThisComponents;
        }
        let AllComponents = [
            <BoxWord
                X={0}
                Y={0}
                key={`root_word`}
                ID={`root_${RootName==""?"Your Keyname":RootName}`}
                Text={RootName==""?"Your Keyname":RootName}
                HeadCount={c_moreCurr.head.length}
                TailCount={c_moreCurr.tail.length}
                SideExist={c_moreCurr.side.data.length > 0 ?true:false}
            />
        ];

        /**
         * Please
         */

        return [AllComponents, ...domainExpansionI(c_moreCurr.head, 'head', [320, 0]), ...domainExpansionI(c_moreCurr.tail, 'tail', [-320, 0])];
    }, [RootName, c_moreCurr, ...mapSize, c_movement, c_scale]);
    //**<< LayeredComponents */


   //** Render */
   return <div ref={StageContainer} className="relative w-full flex justify-center items-center" style={{height: c_windowSize[1]-100}} >
        <Stage ref={TheStage} width={ mapSize[0] } height={ mapSize[1] }

        style={{
            cursor: c_stageCursor,
            touchAction: 'none',
        }}

        className={` bg-slate-200`}

        onPointerDown={(e)=>{
            //Rotate Through Shapes or Nodes if it is click along with the Canvas
            //If not clicking then initiate the movement of canvas


            //Set the initial offset of x y when clicking drag started; change the cursor to grab
            s_stageCursor('grab');
            s_mouseDownPos([e.evt.offsetX, e.evt.offsetY]);
        }}

        onPointerMove={(e)=>{
            //return if mouse is not moving
            if(!c_mouseDownPos)
                return false;

            //Get The Movement Position of the canvas
            let x = e.evt.offsetX - c_mouseDownPos[0];
            let y = e.evt.offsetY - c_mouseDownPos[1];


            // console.log(x, y, c_mouseDownPos, [e.evt.offsetX, e.evt.offsetY]);

            //Movement Speed; Define the how a movement will increase the pan of canvas
            let movementSpeed = .5;

            s_mouseDownPos([e.evt.offsetX,e.evt.offsetY]); //Insert it again to map the last and final location
            s_movement(prev=>{
                prev[0] = prev[0] + (x*movementSpeed);
                prev[1] = prev[1] + (y*movementSpeed);
                return structuredClone(prev);
            }); //Insert movement happen whether add or negative
        }}

        onPointerUp={(e)=>{
            //return if mouse is not moving
            if(!c_mouseDownPos)
                return false;

            //Stop the movement when not clicking and change the cursor to the default
            s_mouseDownPos(false);
            s_stageCursor('default');
        }}

        onPointerLeave={(e)=>{
            //when mouse leave the canvas
            s_mouseDownPos(false);
            s_stageCursor('default');
        }}
        onMouseLeave={(e)=>{
            //when mouse leave the canvas
            s_mouseDownPos(false);
            s_stageCursor('default');
        }}
        onWheel={(e)=>{
            let frictionPower = 2;//Use To slow down the scroll
            let direction = 0;//Set Direction; 1 means up -1 means down
            let ZoomUpLimit = 10; //Set what is the magnification level of zoom
            let ZoomPower = 0.2; //Set how large is the magnification
            if(e.evt.deltaY >= 0){
                direction = c_scrollCount.direction + (-frictionPower);
                if(s_scrollCount.friction == 0){
                    direction +=frictionPower*2;
                }
            }else{
                direction = c_scrollCount.direction + (frictionPower);
                if(s_scrollCount.friction == 0){
                    direction -=frictionPower;
                }
            }


            if(c_scrollCount.friction <= frictionPower){ //check friction if it under; if it is add the friction and direction addition
                s_scrollCount(prev=>{
                    prev.friction = prev.friction+1;
                    prev.direction = direction;
                    return structuredClone(prev);
                });
                return false;
            }

            if(direction > 0){//Add and remove depending on zoom power to scale
                s_scale(prev=>{
                    let newScale = prev+(ZoomPower*prev);
                    if(newScale <= ZoomUpLimit){
                        return newScale;
                    }
                    return prev;
                });
            }else{
                s_scale(prev=>{
                    let newScale = prev-(ZoomPower*prev);
                    if(newScale > 0){
                        return newScale;
                    }
                    return prev;
                });
            }

            //Reset The counter at the end
            s_scrollCount({friction:0, direction:0});
        }}

        >
            <Layer>
                {BackgrounFill()}
            </Layer>
            <Layer id={`foreGroundLayer`}>
                <G_ForeGroundData.Provider value={[s_stageCursor, c_moreCurr, s_moreCurr]}>
                    <Group
                        x={ mapSize[0]*.50 + c_movement[0]}
                        y={ mapSize[1]*.25 + c_movement[1]}
                        scaleX={  c_scale * (mapSize[1]/800) }
                        scaleY={  c_scale * (mapSize[1]/800) }

                    >
                        {ForegroundFill()}
                    </Group>

                </G_ForeGroundData.Provider>
            </Layer>

        </Stage>
    </div>
}


/*
WWWWWK00XNNX0000kdOKkOOodxl;,;cc;lONWWXKOKN00XNNXOkkkXNNNXxxXNNNNNNNNNNNNNNNN00KO0NNx,oKO, ,lllllcloolcllcllllollllcc::llc',ddccc:ccccolclkNWWWWWWWNXK0XW0c:llc:c;;clc::c:cl::c
WWWN00OOXNNXOkO0kd0XXXOOKKk:lxxoc;:OWWWWXXWNO0NNN00XkkKKKOdd0NNNNNNNNNNNNNNNN000x0NKc.oKk, .llllcclolcclcclllllcclcco::llc;dOo:c:::ccoxllONWWWWNKkkxc;cloo;,:c:;cl::llc:::clc::
WX0O00OOXXXKOkxOOxOXKX0kO0KKKXKkOk:oXWWWWWWWN0OXNK0NXkxk0kdox0KKXNNNNNNNNNNNXOOkd0Nx. lKk, .collclooc:ccclllllccll:odcclc:xXOlcc::::o0doKWWWXKxc;,,;,;::oxd:';;:cclcclc::c:ll::
Okk00kk000Okk0kx0xk0xkOO000OOO0XWWXKNWWWWWWWWWKOKX0XWWK0XKkkk0XKKKXNNNNNNNNNKO0xd0O;. ;Ok, .:llcclolccccclllllccl:cxo:lc:xXXdcc:;:okK0OXWWNXOl:::ccclddlxNXc,c:cocccllc::c::l::
KKKK0OO0000OO0Oxkxx0OkxkXNNXXKXNWWWWWMWWWWWWWMWNXX0KWWWXK0O0OkXNNKXNNNNXXNNN0OOxkO;   ;kx, .:lcccoocc:cccccll::::cxd:cc:xNWkccoolxXWNNWWWWWKdxKxokdcokkkON0:;c;ldc:cllc:c:;cl::
WWWKO0XK0OkO000xxkxkXXXXXNNNWWWWWWWWWWWWWWWWWWWWWWXKXWWWNKOKNOOXNKKNNNX0XNNKkkkxxd.   ;Ok,..;lcclolc::c::llc::cclOXdccckNNOloOXXXNWWWWWWWWWXKWWKxkkk00kkKNk:::;ox::lllccc:cll:c
W0ddkkxdlcx000Odo0K0KXNNNNWWWWWWWWWWWWWWWWWWWWWWWWWNNNNNWWXKNNO0XKXNNX00NNXkxOkoxo.   ,kOo;:clcclllccc;cododoc:lOW0c:o0NNKO0NWWWWWWWWWWWWWWWWWWN0xkOOOOOXXo;:,;oc;ccll::c:ldc:c
O:',;,,::lk0OOOdckNNNNNWWWWWWWWWWWWWWWWWWWWWWWWN0kxxxkO0XNNXNN0OO0XNXkkXNXOk0koxO;    ,xOxllllccodxxkdcldooddc:OWXdoOXWWWWWWWMWWWWWWWWWWWWWWWWWNXKKKKX0kkOl;:;,;;:::ll;;:cxxccc
ccl;';dOkOOkkOKk:lKNNNNWWWWWWWWWWWWWWWWWWWWWWWWNK0OkkOxoodx0KK0OkKNKOkXNKOO0kxk0O,    ,x0xclllccooolccldolllcl0WNOONWWWWWNWWWWWWWWWWWWWWWWWWWWWWNNNNNX0dxo;:cl:;:;ldoc;::dOo:::
XX0dc,;okkkkOKNklcdXNWWWWWWNXKXNWWWWWWWWWWWWWWWWWNNNNXXOd::x00Ok000OO00OkO00O0000x'   ;xOdclllccddlokkkkkxl:oKWNKKNNXXXX0OOO0KNWWWWWWWWWWWWWWWWWWNNNNNNN0c;cOk:;:;cdOOxookOl:cl
*/



function BoxWord(Option){
    //** Use Context */
    const [s_stageCursor, c_moreCurr, s_moreCurr] = useContext(G_ForeGroundData);

    //**>> STRUCT */
    let TextContent = Option.Text ?? "Hello Words";
    let HeadCount = Option.HeadCount ?? 0;
    let TailCount = Option.TailCount ?? 0;
    let SideExist = Option.SideCount ?? false;
    let SideState = Option.SideState ?? 'more'; //more, close
    let Location = Option.Location ?? 0; //Key Refernece;
    let Limitless = Option.Limitless ?? [0]; //Where does the root start;
    let ID = Option.ID ?? "1";
    let X = Option.X ?? 0;
    let Y = Option.Y ?? 0;
    let BoxWidth = 200;
    let BoxHeight = 70;
    let Type = Option.Type ?? "root";
    let ColorStylePicker = {
        root:{
            text: "rgb(241 245 249)",
            bg: "#00977C"
        },
        side:{
            text: "rgb(51 65 85)",
            bg: "rgb(190 242 100)",
        },
        tail:{
            text: "rgb(51 65 85)",
            bg: "rgb(253 186 116)",
        },
        head:{
            text: "rgb(51 65 85)",
            bg: "rgb(45 212 191)",
        }
    }
    let ColorStyle = ColorStylePicker[Type];
    //**<< STRUCT */

    //**>> Helper */
    const Hovering = useCallback((e)=>{
        s_stageCursor(prev=>prev=='grab'?prev:'pointer');
    }, []);
    const Hoverinot = useCallback((e)=>{
        s_stageCursor(prev=>prev=='grab'?prev:'default');
    }, []);
    const MoreButton = useCallback((ThisType, myX, myY, click)=>{
        return <Group
            x={myX}
            y={myY}
            onMouseEnter={Hovering}
            onMouseLeave={Hoverinot}
            onPointerEnter={Hovering}
            onPointerLeave={Hoverinot}
            listening={true}
            onClick={click}
            offset={{x: 30, y:15}}
        >
            <Rect
                width={60}
                height={30}
                fill={ColorStylePicker[ThisType].bg}
                shadowEnabled={true}
                shadowBlur={0}
                shadowOffset ={{x:1,y:1}}
                stroke="black"
                strokeWidth={.5}
                cornerRadius={10}
            />
            <Text
                width={60}
                height={30}
                text={`More`}
                fill={ColorStylePicker[ThisType].text}
                fontFamily="Lexend"
                fontSize={15}
                align="center"
                verticalAlign="middle"
                wrap="none"
                ellipsis={true}
            />

        </Group>

    }, []);
    const CloseMoreButton = useCallback((ThisType, myX, myY, click)=>{
        return <Group
            x={myX}
            y={myY}
            onMouseEnter={Hovering}
            onMouseLeave={Hoverinot}
            onPointerEnter={Hovering}
            onPointerLeave={Hoverinot}
            listening={true}
            onClick={click}
        >
            <Circle
                width={BoxHeight*.20}
                height={BoxHeight*.20}
                fill={ColorStylePicker[ThisType].bg}
                stroke={`black`}
                strokeWidth={.5}
            />
        </Group>

    }, []);
    const LinkerLine = useCallback((type='head', height=0, first=false)=>{
        let LineXDirection = type == 'head' ? 60 :-60;
        let LineYDirection = first ? 0 : (70+30);
        return <Group
            y={first ? height : height - LineYDirection}
        >
            <Line
                points={[0, 0,    0, LineYDirection,    LineXDirection, LineYDirection ]}
                strokeWidth={2}
                stroke={`black`}
            />
        </Group>
    }, []);
    const DomainExpansionIII = useCallback((energy, direction, limitless, location=false)=>{
        if(limitless.length <= 1){
            energy.forEach(x => {
                x.open = false;
            });
            if(location !== false){
                energy[location].open = true;
            }
            return energy;
        };
        energy[limitless[1]][direction] =  DomainExpansionIII(energy[limitless[1]][direction], direction, limitless.filter((x,i)=>i!=0), location)
        return energy;
    }, []);
    const CloseUpNode = useCallback(()=>{
        s_moreCurr(prev=>{
            if(Type == 'head')
                prev.head = DomainExpansionIII(prev.head, Type, Limitless);
            else
                prev.tail = DomainExpansionIII(prev.tail, Type, Limitless);
            return structuredClone(prev);
        })
    }, [Limitless ]);
    const OpenUpNode = useCallback(()=>{
        s_moreCurr(prev=>{
            if(Type == 'head')
                prev.head = DomainExpansionIII(prev.head, Type, Limitless, Location);
            else
                prev.tail = DomainExpansionIII(prev.tail, Type, Limitless, Location);
            return structuredClone(prev);
        });
    }, [Location]);
    //**<< Helper */

    //**>> Use State */
    const [ c_headMoreClick, s_headMoreClick ] = useState(Type=='root'? true:false);
    const [ c_tailMoreClick, s_tailMoreClick ] = useState(Type=='root'? true:false);
    const [ c_sideMoreClick, s_sideMoreClick ] = useState(false);
    //**<< Use State */

    return <Group
        id={ID}
        key={ID}
        x={X}
        y={Y}
        offsetX={BoxWidth*.50}
    >
        <Group
            onMouseEnter={Hovering}
            onMouseLeave={Hoverinot}
            onPointerEnter={Hovering}
            onPointerLeave={Hoverinot}
            listening={true}
        >
            <Rect
                width={BoxWidth}
                height={BoxHeight}
                fill={ColorStyle.bg}
                shadowEnabled={true}
                shadowBlur={0}
                shadowOffset ={{x:1,y:1}}
                stroke="black"
                strokeWidth={.5}
                cornerRadius={10}
            />
            <Text
                width={BoxWidth}
                height={BoxHeight}
                text={`${TextContent}`}
                fill={ColorStyle.text}
                fontFamily="Lexend"
                fontSize={20}
                align="center"
                verticalAlign="middle"
                wrap="none"
                ellipsis={true}
                padding={2}
            />
        </Group>


        {/* Group Links */}
        <Group >
            {/* Right Side */}
            { HeadCount > 0 ? <>
                <Line
                    x={BoxWidth}
                    y={BoxHeight*.5}
                    points={[0, 0,    60, 0 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                { !c_headMoreClick ? MoreButton('head', BoxWidth+60, BoxHeight*.50, ()=>{
                    s_headMoreClick(true);
                    OpenUpNode();
                }) : <>
                    <Group x={BoxWidth+60} y={BoxHeight*.50} >
                        {  [...Array(HeadCount)].map((x,i)=>{
                            return <Fragment key={i}>
                                {LinkerLine('head', i*100, i==0 ? true:false)}
                            </Fragment>
                        })  }
                    </Group>
                    {CloseMoreButton('head', BoxWidth+60, BoxHeight*.50, ()=>{
                        if(Type!='root'){
                            s_headMoreClick(false);
                            CloseUpNode();
                        }

                    } )}
                </> }
            </>:""}
            { HeadCount <= 0 && Type == 'root' ? <>
                <Line
                    x={BoxWidth}
                    y={BoxHeight*.5}
                    points={[0, 0,    60, 0 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                <Circle
                    x={BoxWidth+60}
                    y={BoxHeight*.50}
                    width={BoxHeight*.20}
                    height={BoxHeight*.20}
                    fill={ColorStylePicker['head'].bg}
                    stroke="black"
                    strokeWidth={.5}
                />
            </> : ""}

            {/* Left Side */}
            { TailCount > 0 ? <>
                <Line
                    y={BoxHeight*.5}
                    points={[0, 0,    -60, 0 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                { !c_tailMoreClick ? MoreButton('tail', -60, BoxHeight*.50, ()=>{
                    s_tailMoreClick(true);
                    OpenUpNode();
                }) : <>
                    <Group x={-60} y={BoxHeight*.50} >
                        {  [...Array(TailCount)].map((x,i)=>{
                            return <Fragment key={i}>
                                {LinkerLine('tail', i*100, i==0 ? true:false)}
                            </Fragment>
                        })  }
                    </Group>
                    {CloseMoreButton('tail', -60, BoxHeight*.50, ()=>{
                        if(Type!='root'){
                            s_tailMoreClick(false);
                            CloseUpNode();
                        }
                    } )}
                </> }
            </> : ""}
            { TailCount <= 0 && Type == 'root' ? <>
                <Line
                    y={BoxHeight*.5}
                    points={[0, 0,    -60, 0 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                <Circle
                    x={-60}
                    y={BoxHeight*.50}
                    width={BoxHeight*.20}
                    height={BoxHeight*.20}
                    fill={ColorStylePicker['tail'].bg}
                    stroke={`black`}
                    strokeWidth={.5}
                />
            </> : ""}

            {/* Bottom */}
            { SideExist ? <>
                <Line
                    x={BoxWidth*.5}
                    y={BoxHeight}
                    points={[0, 0,    0, 30 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                { SideState == 'more' && !c_sideMoreClick ? MoreButton('side', BoxWidth*.5, BoxHeight+30, ()=>{
                    s_sideMoreClick(true);

                }) : <> </>}
                { SideState == 'close' && !c_sideMoreClick ? CloseMoreButton('side', BoxWidth*.5, BoxHeight+30, ()=>{
                    s_sideMoreClick(true);

                }) : <> </>}
            </> : ""}
            { !SideExist && Type == 'root'  ? <>
                <Line
                    x={BoxWidth*.5}
                    y={BoxHeight}
                    points={[0, 0,    0, 30 ]}
                    strokeWidth={2}
                    stroke={`black`}
                />
                <Circle
                    x={BoxWidth*.5}
                    y={BoxHeight+30}
                    width={BoxHeight*.20}
                    height={BoxHeight*.20}
                    fill={ColorStylePicker['side'].bg}
                    stroke="black"
                    strokeWidth={.5}
                />
            </> : ""}






            {Type =='side' ?
                <Circle
                    x={BoxWidth*.5}
                    width={BoxHeight*.20}
                    height={BoxHeight*.20}
                    fill={ColorStyle.bg}
                    stroke="black"
                    strokeWidth={.5}
                />
            : <></>}

            <Circle
                x={BoxWidth}
                y={BoxHeight*.5}
                width={BoxHeight*.20}
                height={BoxHeight*.20}
                fill={ColorStyle.bg}
                stroke="black"
                strokeWidth={.5}
            />

            {Type == 'root' || Type =='side' ?
                <Circle
                    x={BoxWidth*.5}
                    y={BoxHeight}
                    width={BoxHeight*.20}
                    height={BoxHeight*.20}
                    fill={ColorStyle.bg}
                    stroke="black"
                    strokeWidth={.5}
                />
            : <></>}

            <Circle
                y={BoxHeight*.5}
                width={BoxHeight*.20}
                height={BoxHeight*.20}
                fill={ColorStyle.bg}
                stroke="black"
                strokeWidth={.5}
            />
        </Group>


    </Group>
}
