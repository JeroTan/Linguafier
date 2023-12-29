//HOOKS
import { useCallback, useEffect, useMemo, useState, useRef, createContext, useContext } from 'react'
import parse from "html-react-parser";
// Import the Slate editor factory.

// UTILITIES



//Main
export default function TextEditorSimple(Option) {
    //** STRUCT */
    let Handler = Option.Handle;
    let ErrorBag = Option.ErrorBag;
    let Padding = Option.Padding ?? "py-1 px-4";
    let Size = Option.Size ?? "min-w-[24rem]";
    let BgColor = Option.BgColor ?? "bg-white";

    //**>> Use State */

    //**<< Use State */

    //**>> MEMOIZONE
    const Placeholder = useMemo(()=>{
        return Option.Placeholder;
    }, [Option.Placeholder]);

    const Dynamic = useMemo(()=>{
        return Option.Dynamic ?? false;
    }, [Option.Dynamic]);

    const UpdateHandler = useCallback((value)=>{ // Insert the New Value to handler when stuff gets updated
        if(!Dynamic){
            Handler[1](value);
            return true;
        }

        function domainExpansion(energy, limitless, voided){ // Traverse through depth by 1 or infinitely;
            // THIS WILL REQUIRE A MASSIVE AMOUNT OF ENERGY(memory) BE CAREFUL;
            // energy - the Full Object/Array; Limitless is the array to traverse; Voided is the value to insert at the end of limitless;
            if(limitless.length < 1){
                return voided;
            }
            //-------------------------------------Traverse Next Arr/Obj---Reduce the limitless by 1----ValueNeededToInsert
            energy[limitless[0]] = domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0) || [], voided);
            return energy;
        };

        Handler[1]((prev)=>{
            let restructPrev = structuredClone(prev);
            restructPrev = domainExpansion( restructPrev, Dynamic.split("."), value );
            return restructPrev;
        });
    }, [Option.Dynamic]);

    const ShowHandler = useMemo(()=>{
        if(!Dynamic)
            return Handler[0];

        function domainExpansion(energy, limitless){
            if(limitless.length == 1){
                return energy[limitless[0]];
            }
            return domainExpansion(energy[limitless[0]], limitless.filter((x,i)=>i!=0));
        }
        return domainExpansion(Handler[0], Dynamic.split("."));
    }, []);

    const StateColor = useMemo((value)=>{
        if(ErrorBag){
            return 'red-400';
        }else{
            return 'black';
        }
    }, [ErrorBag]);


    //**<< MEMOIZONE

    //** Use Ref */
    const MainEditor = useRef();

    //** REENDER */
    return <div className={`flex ${Size}`}>
        <div
            id='textEditor'
            tabIndex={0}
            ref={MainEditor}
            className={`shrink grow-0 ${Padding} w-full rounded outline outline-1 outline-${StateColor} outline-offset-0 shadow-myBox3 shadow-${StateColor} delay-100 focus:outline-2 focus:outline-offset-2 focus:outline-${StateColor}/80  placeholder:font-light ${BgColor} min-h-[30px] empty:before:content-[attr(placeholderHere)] empty:before:text-slate-400 empty:before:font-light`}
            onInput={(event)=>{
                //console.log(event);
                //console.log(event.target.innerHTML);///////////////////////////////////////////////////
                UpdateHandler(event.target.innerHTML);
                //console.log(event.target.innerHTML);
            }}
            placeholderHere={Placeholder}
            onKeyDown={(event)=>{
                // if (event.key === '`' && event.ctrlKey) {
                //     event.preventDefault()
                // }
            }}
            onPaste={(event)=>{

                let d = event.clipboardData;
                console.log(d.types);
                if(!d.types.some(x=>x=="Files")){
                    let regex = /\bstyle\s*=\s*(['"])(.*?)\1/gm
                    let sanitizeData = String(d.getData("text/plain"));
                    sanitizeData = sanitizeData.replace(regex, "");
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return false;
                    selection.deleteFromDocument();
                    selection.getRangeAt(0).insertNode(document.createTextNode(sanitizeData));
                    //selection.addRange(1);
                    selection.collapseToEnd();
                    MainEditor.current.click();
                    event.preventDefault();
                }
            }}
            contentEditable
            style={{
                wordBreak: 'break-all',
                overflowWrap: 'break-word',

            }}
            suppressContentEditableWarning={true}
            spellCheck
        >
            {parse(ShowHandler)}
        </div>
    </div>
}

/*
::,.            ..',;;;;;:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;:::;'..           ..:cccccc:cccccccccccccccccccccccc:::::::
K0k,           .'coxOO0000KKKKKKKKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKKKKKKKKKK0kl'         ...;ONNNNNNNNNNNNNNNNNNNNNNNNNXXXXXXXXXXXXX
::c.            .:oxk00KKKKKKKKXXXXXXXXXNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNXXXXXXXXXKKXKKKKkc.   .    ...,ONNNNNNNNNNNNNNNNNNNNNNNNXXXNNNNNNNNNNN
c,.            .,ldxkO00KKKKKKXXXXXXXXXXNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNXXXXXKKKKKKXXKKKKKKK0x,.       .;;oKXXNNNNXNNXXXXXXXXNNNNNNNNNNNNNNNNNNNNN
0xc'.          .:oxkkO00KKKKKKXXXXXXXXNXXNNNNNNNNNNNNNNNNNNNNNNNNNNNXXXK0OOOkkkkkkOOkxxk00KKKKKKKOl.    . .:O0KXXXNNXXXNNNNNNXNNNNNNNNNNNNNNNNNNNNNNNN
0Oo;.          'lxkkkOO00KKKXXXXXXXXXXXNNNNNNNNNNNNNNNNNNNNNNNNNXXXK0kdc;',;:ldxkO000OkxxkkO0KKKK0d'     .:xOKXXXNNNNNNNNNNNNNXNNNNNNNNNNNNNNNNNNNNNNN
KOo,          .;okkOkOO000KKKKXXXXXXXXXNNXXXXNNNNNNNNNNNNNNNNXXXXK0OxolccldxkO00KKKKKK000OOO0KKKKKk:.   .ck0KKXNNNNNNNNNNNNNNNNXXKKXNXNNNNNNNNNNNNNNNN
K0k:. ...     .:dkkkkkO0OkkkkkkkxdxxxxkxxkO0KKXXXXXXXXNNNNNXXXXK00OOkxdodkOOOOkkxdodkO00000000KKKK0o.  .lO0KXXXNNNNNNNNNNNNXK0XX0OO0XNNNNNNNNNNNNNNNNN
KK0d,..cc.     ;dkkkkdoolccc;,;;,''......';coxO0KKXXXXXNNNXXXKK0000OxdolccoxoclodxxddxkO00KKKKKKKK0x,..;kKKXXXXXNNNNNNNNNNNKkx0XKOO000XNNNNNNNNNNNNNNN
KK0Ol,'cc'.    'oxkxdc;;::cc:cllllllc;,'',;:oddxkO0KXXXNNNNXXKKKKKK0Okx:..,;,..,oc:lxOO000KKKKKKKKKx;..lKXXXXXXXNNNNNNNNXNNXK0KKXXK0kx0O0NXXNNXXNNNNNN
XKK0x;.;c'..   .lxxxdlclloodolc:;,'..... .';loxxxkO0XXNNNNNXXXKKXXX0O0X0xdxxxolkKOxddk0KKKKXXKKKKXKd;',dKXXXXXXNNNNXXNNNXXXNXXOxkO00dxxco0XXXXNXXXXXXX
XXKKk;.,:,.,.  'lxxxoloddddo:,'..;;..,;,'cxdloO0OOO0KXNNNNNXXXXXXNXKXXXXXKKKK0KK00000KKXXXXXXXXKXXKxllxOKXXXKXNNNNXXXNNNNXNXNXkx0KOxdkd:lOXXXXXXXXXXXX
XKOkd,'';:;c;..,lxkxdddxxddo:'.'ckOdok00OKXKkkKXXK000XXNNNNXXXXXXNNXXXKKKKKXKKKKKKKXXXXXXXXXXXXXKXKOdkKKKXXXKXNNXXXXXXNNXXNXNXkxKXXKxxxllOXXXXXXXXXXXX
KKOdc,:c,;loc. 'lxkkxxkkkkkkxoldxO00KKXXXXXXXXXXXK00KXXNNNNNXXXXXXNNXXXXXXXXXXXXXXXXNNNXXXXXXXXKKKKOk0KKXXXKXXNNNNXXXXXNNXXNXXOodKXXK0Ol;dKXXXXKKKKKKK
KKKK0xodc;lo:. .cxkkkO0000000OO0000KKKKKKXXXXXXXXKK0KXXNNNNNXXXXXXNNNNNNNNXNNNXXXNNNNNNXNNXXXXXKKKK0OKKXXXKKXNXNNNNXXXXXXXXXXXKd:dKXXXKk:,dKKKKKKKKKKK
00KXKOdxx:,lc. .;dkkOO0KKKKKKXKKKKKXXXXXXXXXXXXXXKKKKKXNNNNNXXXXXXXXNNNNNNNNNNNNNNNNNNNNNXXXXXXKKK000KXXXXXXXNNNNNXXXXXXXXXXXXXKxc:ok00l,,,cx000000000
O0KKOookko';o,.';lxkkO0KKKXXXXXXXXXXXXXXXXXXXXXXKKKKKKXXNNNNNXXXXXXXNNNNNNNNNNNNNNNNNXXXXXXXXXXKKKOO0XXXXXXXXNNNNNXXXXXXXKKKKKK0Oo;,;::,,:;'':lxkkkkkO
k0K0l'oOkd:':l:,,:dxkOO0KKXXXXXXXXXXXXXXXXNXXXXXKKKKKKXXXNNNNXXXXXXNNNNNNNNNNNNNNNNNNXXXXXXXXXXKK0OOKXXXXXXXXNXXNNXXXXXXKK000Okxd:,cldkkkOkxxxk0KKKKKK
OK0O;.:xxxd;':dl;,cdxOO0KKKKXXXXXXXXXXXXNNXXXXXXKKKKKKXXXNNNNNXXXXXXXNNNNNNNNNNNNNNNNXXXXXXXXXKK0000XXNXXKXXXXXXXXXXXXKK0OOOOOOO00KKXXXXXXXXXXNXXXXXXX
0KOl. .:oddo;:dxdc:oxkO0KKKKKXXXXXXXXXXXXXXXXXXXKKKKKKXXXNNNNNXXXXXXXXNNNNNNNNNNNNNNNXXXXXXXXXKK00O0XXK00KXXXXXXKKK00OOOO000KKKKKKKXXXXXXXXXXXXXXXXXXX
0k:.   .';ldlcoxxdc:okO00KKKKXXXXXXXXXXXXXXXXXXKKKKKKXXXNNNNNNNXXXXXXXNNNNNNNNNNNNNNNNXXXXXXXXK000dclooxOKXXXXXK0kxxkkkOOOOO0000000KKKKKKKKKKKKKKKKXXX
d:.       'lolldxd:,cxO00KKKKXXXXXXXXXXXXNXXNXXKKKKKKXXXNNNNNNNXXXXXXXXNNNNNNNNNNNXXNNNXXXXXXKKKK0l..;oO0KXXXK0xoloodddxxxkkkkOOOOOO000000000KKKKKKKKK
..         .;cccodo::oxO0KKKKKXXXXXXXXXXXXXXNXXKKKKKKKXXNNNNNXXKKKKKKXXNNNNNNNNNNNXXXXXXXXXXKKKKK0l,:dk00KKKOxl:::ccclllooodddxxxxkkkkkkOOOOOO00000000
            ..,:;:lc:ldkO0KKKKKXXXXXXXXXXXXXXXKOkOOOkxk0KXXXXKkllddxOXNXNNNNNNNNNNNXXXXXXXXXXKKKK0dldkO00Okoc;;;;;;;:::::cclllloooddddxxxxxxkkkkkkkOOO
              ..,;;;;cdxkO0KKKKKXXXXXXXXXXXXXXXOo:c:,',lkO00OxlclodOKXXNNNNNNNNNNNNNXXXXXXXXXXXKKKkxkOkkdl;,,,,,;;;;;;;;:::::ccccclllloooooddddddxxxxx
                ..',;cdxkkO0KKKKKKXXXXXXXXXXXXXX0xoolooodxxxkkO0KKXXXXXNXNNNNNNNNXXXXXXXXXXXXXXXKKOxxdl:,,',,,,;;;;;;;;:::::::::::cccccccllllllloooooo
                   ..;oxkkkO00KKKKKXXXXXXXXXXXXXXXKKK00OkxxkOKXXXXXXNNXXXXNNNNNXXXXXXXXXXXXXXXXXKKkoc;'''',,,,,,;;;;::::ccccccllllllllllllllllllllllll
                     .ckkOOOO000KKKKXXXXXXXXXXXXXXXXXXXXKKKKKXXNNNNNXXXXXXXXXXXXXXXXXXXXXXXXXXXXKKx;...'''',,,,;::ccllooodddddddxxxxxxxxddddddddoooooo
                      ;xOOOOOO000KKKKXXXKKXXXKKXXXXXXXXNNXXXXXXXXXXXXKKK0OO0KXXXXXXXXXXXXXXXXXXXKKo....''',;;:clooddxxkkkkkOOOOOOOOOOOOOOOOOkkkkkkkxxx
....                  'dOO0O000O00KKKXKKK0kxddxkkkxxxxxxkkkkkxdooooddxxkkO0KXXXXXXXXXXXXXXXXXXXXK0c....',;:clodxxkkOO00000000KKKKKKKK000000000000OOOOO
,,,''.....            .cOO00000OO0KKXXXXKK0kdlccccloooodddddxxkkkkO000KKXXXXXXXXXXXXXXXXXXXXXXXKKk;..',;clodxkOO000KKKKKKKKXXXXXXXXXXXKKKKKKKKKKKKKKK0
oolllcc:;'...          'dOO00000OOO0KXXXXXXXXXKKKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKXXXXXXXXXKK0o'',:codxkO00KKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
kkkkxxxdol:;'..         ;xOO00000OOO0KXXXXXXXXXKKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKK00d::coxkkO00KKKXXXXXXXXXXXXXXXXXXXXXXXXXNNNNNNNNNNXXXN
000OOOOOkxdoc;'.         ;xOO000000O00KXXXXXXXXXKKKKKKKKKKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKKK0OOO0kxxkO00KKKXXXXXXXXXXXXXXXXXXXNNNNNNNNNNNNNNNXXXXXXXN
KKKKK0000OOkdlc,..        ,dkO000000O0KKKKXXXXXXKKKKKXXKKKKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKKKOkkOOOK0O0KKKXXXXXXXXXXNNXXXXXXNNNNNXXNNNNNNNNNNNNXXNNXXXX
XXXXXXXXXXKK0Okxo;..       .:xOO00000000KKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKKKOkxxkOkOKKKKKXXXXXXXXNNNNXXXXXXXNNNNNXXXXNNNNNNNNNNNNNNNNXXN
XXXXXXXXXXXXXXXXK0kd:'.      .:dkOO0O0000KKKXXXXXXXXXXXXNNNNNNNNNNNNNXXXXXXXXXXXXXXXKKK0OxdddkOkk0XXKXXXXXXXXXNNNNNNXXXXNNNNNNNXXXXNNNNNNNNNNNNNNNNNNN
XXXXXXXXXXXXXXXXKKK0ko,.       .,ldkOO000KKKKXXXXXXXXXXXNNNNNNNNNNNNNNXNNXXXXXXXXXKKK0kdoodxkkkk0XXXXXXXXXXXNNNNNNNXXXXNNNNNNNNXXXNNNNNNNNNNNNXXXNNNNN
XXXXXXXXXXXXXXXXXKK0ko,.        ..'cdkOOO00KKKKXXXXXXXXNNNNNNNNNNNNNNNXNXXXXXXXXKKK0kxooodxkOkk0XXXXXXXXXXXXXNNNNNNXNNNNNNNNNNXXXXNNNNNNNNNNNXXXNNNNNN
NNXNNXXNNXXXXXXXXKK0ko'         .'..,coxkOO00KKKKXXXXXXXNNNNNNNNNNNXXXXXXXXXXXKKK0kdooodxkkkk0XXXXXXXXXXXXKKXXXNNXXNNNNNNNNNNNXXXNNNNNNNNNNNNNNNNNNNNN
NNNNNXXNNXXXXXXXXXK0kc.        .':,...,:ldxkO0KKKXXXXXXXXNNXXXXXXXXXXXXXXXXKKK0OxollodxxxkO0KXXXXXXXXXXXXXKKKKXXXXNNNNNNNNNNNNXXXNNNNNNNNNNNNNNNNNNNNN
XNNNXXNNXXXXXXXXXXK0o.         .,:c,. ..,;cldkO00KKKKXXXXXXXXXXXXXXXXXXXKKKK0koccllodxkkO0XXXXNXXXXXXXXKXXXKKKXXNNNNNNNNNNNNNXXXNNNNNNNNNNNNNNNNNNNNNN
XXXNXXNXXXNXXXXXXXKx'   ...    .;:cc;.  ..'',:ldkO000KKKKKKKKKKKKKKKKKK0Okxdoc::clloxkOKXXXNNNNXXXXXXXXKXXNXXXNNNNNNNNNNNNNNNXXNNNNNNNNNNNNNNNNXXNNNNN
dXNNXNNNXNXNNXXXKKx,   'oo;.  .;clllc:'.   ...',;cldxkkOOOOOOOOOOOOOOkxdoc:::;;;:coxOKXNNNNNNNNNXXXXXXXXXXNNXXNNNNNNNNNNNNNNXXXNNNNNNNNNNNNNNNNXXNNNNN
:kXNNNNNNXXNXXXX0o'   .cOOl. .:odddddoc;..    .....',;:clllooooloodoolc::;,''..;lx0XXXNNNNNNNNNNXXXXXXXXXNNXNNNNNNNNNNNNNNNNXXNNNNNNNNNNNNNNNNNNNNNNNN
llKNNNNNNXNNXXNKl.    .oO0d..ldxkkkkkxdoc;..      ....',;;:clccccllcc:,......'ckKXXXNNNNNNNNNNNNNXNXXXXXXNNNNNNNNNNNNNNNNNNNXNNNNNNNNNNNNNNNNNNNNNNNNN
OcxXXNNNNNNNXXNO'     .cOKOccxOOOOOOOOOkxdl:..        ..',;;:ccc:;;,'.   .;coOKXXXXNNNNNNNNNNNNNNNXXXXXXXNNNNNNNNNNNNNNNNNNXNNNNNNNNNNNNNNNNNNNNNNNNNN
XocONXNNNNNNNXN0:. ..'.,kKKOxk00000000000Okxo:'.         ..........   .'cx0KKXXXXNNNNNNNNNNNNNNNNNXXXXXXXNNNNNNNNNNNNNNNNNXXNNNNNNNNNNNNNNNNNNNNNNNNNN
X0clKNNNNNNNNXXKOdlldxc:kKXK0O0000KKKKKK0000Oxoc,..                .':dOKKXXXXXNNNNNNNNNNNNNNNNNNXXXXXXXXNNNNNNNNXXNNNNNNNXNNNNNNNNNNNNNXXNNNNNNNNNNNN
XXx:xXXNNNNNXXXXKKK000kdOXXXXK00KKKKKKKKKKKKK00Okdl:;'....      .,cdO0KXXXXXXNNNNNNNNNNNNNNNNNXXXXXXXXKXXNNNNNNNXXXNNNNNNXNNNNNNNNNNNNXXXNNNNNNNNNNNNX
XXKol0XXNNNNXXXXXXXKKK0kOKXXXXK0KKKKKKKKKKKKKKKK000OOd;'....',clood0XXXXXXNNNNNNNNNNNNNNNNNNNXXXXNNNNXXXNNNNNNNXXXXNNNNNNXNNNNNNNNNNNNXNNNNNNNNNNNNNXX
NXXkcxXXNNNNXXXXXXXXKKKOOKXXXXXKKKKKKKKKKKKXXXXXKKXOl...;cccccccc,.'oOXNNNNNNNNNNNNNNNNNNNNNNNNNXNNNNXXNNNNNNNXXXXNNNNNNXXNNNNNNNNNNNNNNNNNNNNNNNNNXXX
NNXKol0NNNNNXXXXXXXXXXK0OKXXNXXXKKKKKXXXXKXXXXXXXKx'.;loc;.....'ol'  .cONNNNNNNNNNNNNNNNNNNNNNNNNNNNXXXNNNNNNXXXXXNNNNNXXNNNNNNNNNNNNNNNNNNNNNNNNXXXXX
NNXXklkXNNNNNXXXXXXXXXXKO0XXNXNXXXXXXXXXXXXXXXXXKl. ,kOxl' ':;..oddl'  .:ONNNNNNNNNNNNNNNNNNNNNNNNNNXXNNNNNNXXXXXNNNNNNXXNNNNNNNNNNNNNNNNNNNNNXXXXXXXN
XXXX0odKNNNNNNXXXXXXXXXXO0XXNXNNXXXXXXXXXXXXXXXO;   .;k0Ol......',',.    .:dOXNNNNNNNNNNNNNNNNNNNNNXXNNNNNNXXXXXXNNNNNNNNNNNNNNNNNNNNNNNNNNNNXXXXXXXXX
XXXXKxlOXXXXXXXXXXXXXXXX00KXXXXXXXXXXKKKXKKXXXk,     .:lc;'...              .:kXNXXXXXXXXXXXXXXXXXXXXXXXXXXXKKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXKXXXXKKKK
c::::;',:::ccc:::::::::c:;::::::::::::::::::::.      .....                    .;cccccccccccccccc:::::c:ccc::::::ccccc:::::::::::cc:::cccccc::::c::::::
⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
