/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./resources/**/*.{js,ts,jsx,tsx}",
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
        colors:{
            'my-green': '#00977C',
            'my-light': '#ECFFE0',
            'my-yellow': "#FFD816",
        },
        boxShadow:{
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
  },
  plugins: [],
}

