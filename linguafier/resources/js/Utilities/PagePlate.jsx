//Utilities
import Navbar from './Navbar';
import Footer from './Footer';

export default (Body)=>{

    let insertCSS = [
        'hidden',
        'p-4',
        'p-1',
        'outline-red-400',
        'shadow-red-400',
        'focus:outline-red-400/80',
        'focus:outline-black/80',

    ];
return <main className='relative w-full h-full min-h-screen flex flex-col font-lexend'>
    {Body.clean ? '' : <Navbar/>}

    <div className={insertCSS.join(' ')}></div>

    <main className='flex-1 min-h-screen h-full bg-my-green'>
        {Body.children}
    </main>
    {Body.clean ? '' : <Footer/>}

</main>

}
