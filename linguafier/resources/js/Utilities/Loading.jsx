export default function Loading(){
    return <div className="py-5 flex justify-center">
        <div className="w-16 h-16">
            <svg className="animate-spin bg-my-light" width='100%' height='100%' viewBox="0 0 24 24">
                <circle className="opacity-100 stroke-my-green fill-none" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <circle className="opacity-50 stroke-green-800 fill-slate-400" cx="12" cy="12" r="10" strokeWidth="1"></circle>
                <path className="opacity-100 fill-emerald-200" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    </div>
}
