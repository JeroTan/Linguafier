export default function Button(Option){
    let name = Option.Name ?? 'Button';
    let padding = Option.Padding ?? 'py-1 px-4';
    let type = Option.Type ?? 'Button';
    let size = Option.Size ?? '';
    let color = Option.Color ?? 'bg-my-green'
    return <>
        <button
            type={type}
            className={`${padding} ${size} rounded outline outline-1 outline-offset-0 shadow-myBox1 ${color} delay-75 hover:outline-4 hover:brightness-150`}
            onClick={Option.Click}
        >
            {name}
        </button>
    </>
}
