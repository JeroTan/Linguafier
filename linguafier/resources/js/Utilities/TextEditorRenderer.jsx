//HOOKS
import { useCallback, useEffect, useMemo, useState, useRef, createContext, useContext } from 'react'

export default function TextEditorRenderer(Option){
    //** STRUCT */
    const TextNode = Option.TextNode ?? [{type:"text", content:""}];

    //** MEMO */
    const contentPlate = useCallback( (type, content)=>{
        switch(type){
            case 'text':{
                return <div>
                    {content}
                </div>
            break
            }case 'bold':{
                return <span className='font-bold'>
                    {content}
                </span>

            break;
            }case 'italic':{
                return <span className=' italic'>
                    {content}
                </span>
            break;
            }case 'underline':{
                return <span className=' underline underline-offset-1'>
                    {content}
                </span>
            break;
            }case 'image':{

            break;
            }
        }
    }, [] );
    const contents = useMemo( () => {
        function spreadNode(energy, position = false, content = false){
            return energy.map((x, i)=>{
                if(x.child !== undefined && x.child.length > 0){
                    x.content = spreadNode(x.child, x.position, x.content );
                }

                return contentPlate(x.type, x.content);
            });
        }
        return spreadNode(TextNode);
    }, [TextNode]);



    //** Render */
    return <>
        {contents}
    </>
}
