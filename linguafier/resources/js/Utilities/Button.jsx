import Icon from "./Icon";

export default function Button(Option){
    let name = Option.Name ?? 'Button';
    let padding = Option.Padding ?? 'py-1 px-4';
    let type = Option.Type ?? 'Button';
    let size = Option.Size ?? '';
    let color = Option.Color ?? 'bg-my-green'
    let disabled = Option.Disabled ?? undefined;
    let textColor = Option.TextColor;

    function icon(){
        if(Option.Icon)
            return <Icon InClass={ Option.IconInClass ? Option.IconInClass : `` } OutClass={Option.IconOutClass ?Option.IconOutClass : `w-4 w-4`} Name={Option.Icon} />

    }

    return <>
        <button
            type={type}
            className={`${padding} ${size} rounded outline outline-1 outline-offset-0 outline-black shadow-myBox3 shadow-black ${color} ${textColor ? textColor : "text-slate-200"}  delay-75 hover:outline-4 hover:brightness-150 hover:text-black flex justify-center items-center gap-1 fill-slate-200 hover:fill-black disabled:opacity-70`}
            onClick={Option.Click}
            disabled={disabled}
        >
            {icon()}

            {name == "Button" && Option.Icon ? "" : <span>{name}</span> }

        </button>
    </>
}
