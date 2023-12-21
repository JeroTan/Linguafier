export default function Progress(Option){
    let Handler = Option.Handler;
    let Size = Option.Size ?? "100px";

    let style = {
        width:Size,
    }

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
        `}
        value={Handler[0]}
        max="100"
        style={style}> {Handler[0]}% </progress>
    </>
}
