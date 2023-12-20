export default function Progress(){
    return <>
    <progress className={`
        [&::-webkit-progress-bar]:bg-slate-200
        [&::-webkit-progress-bar]:rounded
        [&::-webkit-progress-bar]:overflow-hidden
        [&::-webkit-progress-bar]:shadow-myBox3
        [&::-webkit-progress-bar]:outline
        [&::-webkit-progress-bar]:outline-1
        [&::-webkit-progress-bar]:outline-black
        [&::-webkit-progress-value]:bg-my-green

        `} value="32" max="100"> 12% </progress>
        </>
}
