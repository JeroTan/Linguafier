//HOOKS
import { useEffect, useMemo, useState } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

// UTILITIES


//ExtraFunc

export default function TextEditor(Option) {
    //** STRUCT */
    let Handler = Option.Handle;
    const initialValue = useMemo(
        () =>
            [
            {
                type: 'paragraph',
                children: [{ text: 'A line of text in a paragraph.' }],
            },
            ],
        []
    )

    //** Use State */
    const [editor] = useState(()=>withReact(createEditor()));

    //** Use Effect */
    useEffect(()=>{
        Handler[1](editor);
    }, [editor]);


    //Render
    return <>
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
    </>
  }
