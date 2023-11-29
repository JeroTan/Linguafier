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
            'my-yellow': '#ECFFE0'
        },
        boxShadow:{
            'myBox': "5px 5px 0 0",
            'myBox1': "3px 3px 0 0",

        },
        dropShadow:{
            'myDrop1' : "3px 3px 0",
        },
        fontFamily: {
            lexend: ['Lexend'],
            sniglet: ['Sniglet'],
        }
    },
  },
  plugins: [],
}

