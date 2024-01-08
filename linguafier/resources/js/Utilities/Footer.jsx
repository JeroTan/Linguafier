import ImageFlash from "./ImageFlash";
import Icon from "./Icon";

//HOOKS
import { usePage } from "@inertiajs/react";


export default ()=>{
    const { asset } = usePage().props;

return <>
    <footer className="bg-my-green90 flex justify-center pt-12 pb-8 md:px-8 px-4">
        <div className="flex lg:flex-nowrap flex-wrap gap-4 gap-x-8" style={{width:"72rem"}}>
            <div className="flex md:flex-nowrap flex-wrap gap-4 gap-x-8">
                <div className="shrink-0 md:w-auto w-full flex justify-center">
                    <div>
                    <ImageFlash Src={`${asset}onlymechanics.svg`} Size={"10rem"} />
                    </div>
                </div>
                <div className="grow w-full">
                    <h1 className="text-white text-2xl pb-1 md:text-start text-center">Creator</h1>
                    <p className=" break-words text-slate-200 text-sm font-light text-justify">
                        Language is essential for communication, it allows us to express what we need to tell others. While proficiency is not required, there will be times we need to be better at it like writing a love letters or debating in the internet. A single word may turn tables upside down. The word we use can make an impact. Why words? When we learn the language we always start with a word . Introducing Linguafier, a web app that acts like a dictionary BUT with gamification elements such as Attributes (kinda like fire, ice and lightning), Variation (like a class in RPG), and Rarity (like gacha). It also has a hierarchy maps where you can see how it relates with other words. There still other things to see in this app but I leave the rest to you. Have a nice day!
                    </p>
                    {/* Using a language to communicate is integral part of our lives. We do this to impose our beliefs, express our feelings, negotiate with others and to socialize. Even though we can communicate without linguistic profeciency, there are still times that those single phrase can turn tables around when we do something like love letter, essay writing, arguing someone on the internet, speech of a politician, even fake news and scammers, and of course when I write this web application. Not only when we "do" stuff but also when we obtain a stuff from someone. You cannot just accept something that you don't understand so you either go to Google, Dicitionary or translator to understand it first. I may not go beyond about this topic but one thing that is obvious is not knowing a "word" that you have read. Why is that? There are many ways to tell an "object" how big it is: gigantic, titanic, huge, massive, large, jumbo, humongous and many more. This is not something like SI units or you may recall it as meter, decameter, hectometer or kilometer. Those words that I told you earlier, in a sense, is more like a US measurement "The length of my desk is 10iPhones" or "My car's maximum speed is 2 cheetah power". It's confusing without knowing the actual context. Since you cannot really change this system, what we can or what I have done in my part is to make way to navigate this mayhem instead of going against the system. Introducing Linguafier, a web application that act like a typical dictionary where you can see the word's definition. But it does not stop there because it also have some gamification elements like: Attributes, like can it cause positive or negative effects; Variation, most likely part of speech like nouns or verb but you can think of it as fire, water, earth and wind; Rarity, Imagine the words smoething like a yugioh cards. It also have hierarchy map where you can see the where the words relates to, for instance the word big relates to the words I told earlier. There are still more to see in Linguafier and there still more features to come. While this app may not be a silver bullet for everything, it will come in handy for the parts that you might really need it. Regardless, thank you for using this app. */}
                </div>
            </div>

            <div className="shrink-0 lg:w-auto w-full flex flex-col gap-2">
                <h1 className="text-white text-2xl pb-1 lg:text-start text-center">Socials</h1>
                <div className="flex flex-wrap lg:justify-start justify-center gap-2">
                    <div className="p-2 rounded-lg border-b-4 border-r-4 border-t border-l border-black h-fit w-fit bg-my-green cursor-pointer hover:bg-teal-800 hover:scale-110">
                        <Icon Name={`facebook`} OutClas={`w-6`} InClass={`fill-white`} />
                    </div>
                    <div className="p-2 rounded-lg border-b-4 border-r-4 border-t border-l border-black h-fit w-fit bg-my-green cursor-pointer hover:bg-teal-800 hover:scale-110">
                        <Icon Name={`twitter`} OutClas={`w-6`} InClass={`fill-white`} />
                    </div>
                    <div className="p-2 rounded-lg border-b-4 border-r-4 border-t border-l border-black h-fit w-fit bg-my-green cursor-pointer hover:bg-teal-800 hover:scale-110">
                        <Icon Name={`youtube`} OutClas={`w-6`} InClass={`fill-white`} />
                    </div>
                </div>
            </div>
        </div>

    </footer>
</>
}
