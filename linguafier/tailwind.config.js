/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./resources/**/*.{js,ts,jsx,tsx}",
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  safelist:[
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
    'hover:fill-black',
    'fill-red-500',
    'fill-sky-400',
    'fill-yellow-500',
    'text-red-500',
    'text-sky-400',
    'text-yellow-500',
    'sm:ml-3',
    'min-w-96',
    'min-w-[24rem]',
  ],
  theme: {
    extend: {
        colors:{
            'my-green': '#00977C',
            'my-light': '#ECFFE0',
            'my-yellow': "#FFD816",
            'my-green90': "color-mix(in srgb, #00977C 90%, white);"
        },
        boxShadow:{
            'myBox1': "1px 1px 0 0",
            'myBox1_2': "1px 2px 0 0",
            'myBox1_3': "1px 3px 0 0",
            'myBox3': "3px 3px 0 0",
            'myBox5': "5px 5px 0 0",
        },
        dropShadow:{
            'myDrop3' : "3px 3px 0 #000000",
            'myDrop1' : "1px 1px 0 #000000",
        },
        fontFamily: {
            lexend: ['Lexend'],
            sniglet: ['Sniglet'],
        }
    },
    screens:{
        'xs':'400px',
        'sm':'640px',
        'md':'768px',
        'lg':'1024px',
        'xl':'1280px',
        '2xl':'1536px',
    }
  },
  plugins: [],
}

