/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    placeholderColor: (theme) => theme("colors"),
    extend: {
      colors: {
        background: "#16162e",
        header: "#000001",
        footer: "#1d1d3c",

        // Brand Colors
        xcyan: "#7dd5f9",
        xpink: "#e6b1f9",
        xdarkblue: "#0a1161",
        xwhite: "#fefefe",
        xdarkwhite: "#cbcbcb",
        xdarkgray: "#a5a5a5",
        // Gradient #1
        xlightcyan: "#9ee6fc",
        xlightpink: "#ebb9e7",
        // Gradient #2
        xoffwhite: "#cbf2fe",
        xyellow: "#e1dfa2",

        // Brand Colors Variant
        "xwhite-op05": "rgba(254,254,254,0.05)",
        "xwhite-op10": "rgba(254,254,254,0.1)",
        "xwhite-op20": "rgba(254,254,254,0.2)",
        "xwhite-op30": "rgba(254,254,254,0.3)",
        "xwhite-op40": "rgba(254,254,254,0.4)",
        "xwhite-op60": "rgba(254,254,254,0.6)",
        "xwhite-op75": "rgba(254,254,254,0.75)",

        // to be confirmed
        darkblue: "#21213B",
        error: "#F53F3F",

        // used in multistep modal
        lightblue: "#9598B9",
        modalbg: "#EEEEEE",
        modalbg2: "rgba(149,152,185,0.1)",
        modaloverlay: "rgba(20, 20, 48, 0.7)",
      },
      fontSize: {
        "x-xs": ["0.75rem", 1],
        "x-sm": ["0.875rem", 1],
        "x-base": ["1rem", 1],
        "x-lg": ["1.125rem", 1],
        "x-xl": ["1.25rem", 1],
        "x-2xl": ["1.5rem", 1],
      },
      lineHeight: {
        xsnug: 1.4,
        xloose: 2.1,
      },
      fontWeight: {
        xextralight: 275,
        xlight: 300,
        xmedium: 400,
        xbold: 700,
        xextrabold: 800,
      },
      fontFamily: {
        termina: ["Termina"],
      },
      maxWidth: {
        "pc-screen": "1200px",
      },
      backgroundImage: {
        "modal-bg-large": "url('src/styles/images/modal.png')",
        "modal-bg": "url('src/styles/images/modal-bg-normal.png')",
        // "clan-info": "url('src/styles/images/clan.png')",
        "my-info": "url('src/styles/images/my-info.png')",
        logout: "url('src/styles/images/logout.png')",
      },
      animation: {
        wiggle: 'wiggle 200ms ease-in-out 2',
      }
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
