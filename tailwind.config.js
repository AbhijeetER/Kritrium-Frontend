export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          bg:        "#DCDCDD",
          surface:   "#F8F8F9",
          border:    "#C5C3C6",
          iron:      "#46494C",
          slate:     "#4C5C68",
          cyan:      "#1985A1",
          "cyan-dim":"rgba(25,133,161,0.08)",
          red:       "#C0392B",
          green:     "#1A8C5C",
          amber:     "#B7620A",
        },
        fontFamily: {
          mono: ["'JetBrains Mono'", "monospace"],
          sans: ["'Inter'", "sans-serif"],
        },
        transitionDuration: { DEFAULT: "180ms" },
      },
    },
  }