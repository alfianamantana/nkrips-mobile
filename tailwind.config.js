/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily : {
        satoshi : ["Satoshi"]
      },
      colors : {
        primary : "#ED0226",
        success : "#5CB489",
        blue_color : "#028AED",
        orange_color : "#ED8F02",

        "Neutral/10" : "#FFFFFF",
        "Neutral/20" : "#F5F5F5",
        "Neutral/30" : "#EDEDED",
        "Neutral/40" : "#E0E0E0",
        "Neutral/50" : "#C2C2C2",
        "Neutral/60" : "#9E9E9E",
        "Neutral/70" : "#757575",
        "Neutral/80" : "#616161",
        "Neutral/90" : "#404040",
        "Neutral/100" : "#0A0A0A",

        "Primary/Main"    : "#ED0226",
        "Primary/Surface" : "#FFE0E5",
        "Primary/Border"  : "#C7E9F3",
        "Primary/Hover"   : "#489DB7",

        "Success/Main"    : "#5CB489",
        "Success/Surface" : "#EEFFF6",
        "Success/Border"  : "#B8DBCA",
        "Success/Hover"   : "#367A59",

        "Warning/Main"    : "#FAAD14",
        "Warning/Surface" : "#FFF7E8",
        "Warning/Border"  : "#FCE4B6",
        "Warning/Hover"   : "#E19600",

        "Danger/Main"    : "#CB3A31",
        "Danger/Surface" : "#FFF4F2",
        "Danger/Border"  : "#EEB4B0",
        "Danger/Hover"   : "#BD251C"
      }
    },
  },
  plugins: [],
}

