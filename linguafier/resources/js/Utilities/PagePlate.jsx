//Utilities
import Navbar from './Navbar';
import Footer from './Footer';

import { usePage } from '@inertiajs/react';

export default (Body)=>{
    let insertCSS = [
        'hidden',
        'p-4',
        'p-1',
        'outline-red-400',
        'shadow-red-400',
        'focus:outline-red-400/80',
        'focus:outline-black/80',
        'fill-black',
        'w-4 h-4',
        'bg-slate-50',
        'bg-my-green',
        'bg-my-light',
    ];
    let BackgroundColor = {
        'empty':'bg-slate-50',
        'green':'bg-my-green',
        'light':'bg-my-light',
    };
return <main className='relative w-full h-full min-h-screen flex flex-col font-lexend'>
    {Body.clean ? '' : <Navbar/>}

    <div className={insertCSS.join(' ')}></div>

    <main className={`flex-1 min-h-screen h-full ${BackgroundColor[Body.background ?? 'empty']}`}>
        {Body.children}
    </main>
    {Body.clean ? '' : <Footer/>}

</main>

}
