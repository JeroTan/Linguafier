import { Head, usePage, router } from '@inertiajs/react';
import ImageFlash from '../Utilities/ImageFlash';
import PagePlate from '../Utilities/PagePlate';
import Word from './Word';

export default function Homepage() {
    const { asset } = usePage().props;
return <>
    <Head>
        <title>Homepage</title>
        <meta name="description" content="Landing page of Linguafier"/>
    </Head>
    <PagePlate>
        <header className='relative w-full  py-10 flex justify-center' style={{height:"27rem"}}>
            <div className='relative overflow-hidden' style={{width:"90rem"}}>
                <div className='overflow-hidden'>
                <div className='absolute xl:opacity-100 sm:opacity-50 opacity-25' style={{width:"130px", left:"50px"}}>
                    <svg width="100%" height="100%" viewBox="0 0 76 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="76" height="96" fill="#00977C"/>
                    </svg>
                </div>

                <div className='absolute xl:opacity-100 sm:opacity-50 opacity-25 ' style={{left:"100px", bottom:"0px", width:"245px"}}>
                    <svg width="100%" height="100%" viewBox="0 0 143 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="142" height="95" stroke="black"/>
                    </svg>

                </div>

                <div className='absolute xl:opacity-100 sm:opacity-50 opacity-25 ' style={{right:"150px", width:"260px"}}>
                    <svg width="100%" height="100%" viewBox="0 0 147 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="146" height="127" stroke="black"/>
                    </svg>
                </div>

                <div className='absolute xl:opacity-100 sm:opacity-50 opacity-25 ' style={{right:"100px", bottom:0, width:"140px"}}>
                    <svg width="100%" height="100%" viewBox="0 0 107 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="107" height="85" fill="#00977C"/>
                    </svg>
                </div>
                </div>

                <div className='absolute w-full h-full flex justify-center items-center'>
                    <div className='flex flex-col items-center gap-y-2'>
                        <h1 className=' sm:text-6xl  text-3xl font-bold bg-my-green text-white sm:py-5 py-2 sm:px-20 xs:px-10 px-5 border-b-4 border-r-4 border-r-black border-l border-l-slate-300 border-t border-t-white border-slate-700'>LINGUAFIER</h1>
                        <small className=' font-light sm:text-2xl xs:text-base text-sm text-center'>Words That Can Make an Impact</small>
                    </div>
                </div>
            </div>
        </header>
        <main className='pt-36 pb-20 bg-my-light flex justify-center'>
            <div className='w-[90rem] flex flex-wrap gap-y-36 2xl:px-0  px-5'>

                <div className='w-full flex md:flex-nowrap flex-wrap lg:gap-x-48 md:gap-x-6'>
                    <div className='md:w-auto w-full'>
                        <h1 className='text-my-green lg:text-4xl md:text-3xl text-2xl font-semibold mb-8'>What is Linguafier?</h1>
                        <p className=' text-justify break-words font-light'>
                            Linguafier is a web application that acts like a typical <span className=' font-semibold'>dictionary</span>. There, you can see the word's definition, pronunciation, spelling and more. But it does not stop there because it also includes some <span className=' font-semibold'>gamification elements</span> to make learning more interesting . The first is the <span className='italic font-normal'>Attributes</span>. Imagine a sword with different attributes like fire, water, earth and wind, if we compare it with the mechanics of how "word", it may be positive or negative, sometimes tangible or just an idea.  Next is <span className='italic font-normal'>Variation</span>. In RPG games you may refer to it as character class like mage, marksman or tank but in here it is the part of speech like nouns or verbs. Words also have <span className='italic font-normal'>Rarity</span>. You may see words as meta depending on how rare and useful they are in a practical context.
                        </p>
                    </div>
                    <div className='md:w-auto w-full lg:translate-x-[-100px] flex justify-center md:mt-0 mt-5'>
                        <ImageFlash Src={asset+"hm_thinking.png"} Size={"13rem"} Ratio={""} />
                    </div>
                </div>

                <div className='w-full flex md:flex-nowrap flex-wrap lg:gap-x-48 md:gap-x-6'>
                    <div className=' md:w-auto w-full lg:translate-x-[100px] md:block hidden'>
                        <ImageFlash Src={asset+"hm_running.png"} Size={"11rem"} Ratio={""} />
                    </div>
                    <div>
                        <h1 className='text-my-green lg:text-4xl md:text-3xl text-2xl font-semibold mb-8 '>But why?</h1>
                        <p className=' text-justify break-words font-light'>
                            Using a language to communicate is an integral part of our lives. We do this to impose our beliefs, express our feelings, negotiate and socialize with others. Even though we can communicate without linguistic proficiency, there are still times that those single phrase can turn tables around when we do something like love letter, essay writing, arguing someone on the internet, speech of a politician, even fake news and scamming, and of course when I write this web application. Not only when we "do" stuff but also when we obtain stuff from someone. You cannot just accept something that you don't understand so you either go to Google, Dicitionary or a translator to understand it. I may not go beyond this topic but one thing that is obvious is not knowing a "word" that you have read.
                        </p>
                    </div>
                    <div className=' md:w-auto w-full lg:translate-x-[100px] md:hidden flex justify-center md:mt-0 mt-5'>
                        <ImageFlash Src={asset+"hm_running.png"} Size={"11rem"} Ratio={""} />
                    </div>
                </div>

                <div className='w-full flex md:flex-nowrap flex-wrap lg:gap-x-48 md:gap-x-6'>
                    <div>
                        <h1 className='text-my-green lg:text-4xl md:text-3xl text-2xl font-semibold mb-8'>How so?</h1>
                        <p className=' text-justify break-words font-light'>
                            There are many ways to tell an "object" how big it is: gigantic, titanic, huge, massive, large, jumbo, humongous and many more. This is not something like SI units or you may recall it as meter, centimeter or kilometer. Those words that I told you earlier, in a sense, is more like a US measurement "The length of my desk is 10iPhones" or "My car's maximum speed is 2 cheetah power". It's confusing without knowing the actual context. Since you cannot really change this system, what we can or what I have done on my part is to make way to navigate this mayhem instead of going against the system. Introducing Linguafier
                        </p>
                    </div>
                    <div className=' md:w-auto w-full lg:translate-x-[-100px] flex justify-center md:mt-0 mt-5'>
                        <ImageFlash Src={asset+"hm_haha.png"} Size={"13rem"} Ratio={""} />
                    </div>
                </div>

                <div className='w-full flex flex-col l'>
                    <div className='flex flex-wrap justify-center'>
                        <h1 className='w-full text-my-green lg:text-4xl md:text-3xl text-2xl font-semibold mb-8 text-center'>Oh! Linguafier</h1>
                        <div className='flex justify-center'>
                            <p className='text-justify break-words font-light max-w-[50rem]'>
                                While this app may not be a silver bullet for everything, it will come in handy for the parts that you might really need it. There are still more to see in Linguafier and there still more features to come.
                            </p>
                        </div>

                    </div>
                    <div className='flex justify-center mt-5'>
                        <ImageFlash Src={asset+"hm_yay.png"} Size={"13rem"} Ratio={""} />
                    </div>
                    <div className='text-center '>
                        <p>SEE THE SAMPLE BELOW</p>
                    </div>
                </div>

            </div>

        </main>
        <main className='pt-20'>
            <div className='text-center italic text-slate-500 font-light animate-pulse'>
                a random word will show up here
            </div>
            <Word Type={'no_page_plate'} />
        </main>
    </PagePlate>
</>
}
