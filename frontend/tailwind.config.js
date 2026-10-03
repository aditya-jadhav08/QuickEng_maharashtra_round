/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant":"#4a454d",
        "on-background":"#e8e0e7",
        "background":"#151217",
        "on-primary":"#3a294b",
        "error-container":"#93000a",
        "on-secondary-fixed":"#211829",
        "secondary":"#d1c1da",
        "primary-fixed":"#f0dbff",
        "primary-fixed-dim":"#d6bde9",
        "error":"#ffb4ab",
        "on-error-container":"#ffdad6",
        "primary":"#d6bde9",
        "inverse-primary":"#6a567c",
        "inverse-on-surface":"#332f34",
        "on-secondary":"#372c3f",
        "inverse-surface":"#e8e0e7",
        "on-primary-fixed-variant":"#523f63",
        "surface-container-high":"#2c292e",
        "tertiary":"#f2b6d0",
        "on-primary-fixed":"#251435",
        "on-secondary-fixed-variant":"#4e4256",
        "surface-bright":"#3b383d",
        "primary-container":"#9e88b1",
        "on-tertiary-fixed":"#330e23",
        "on-surface":"#e8e0e7",
        "surface-container-highest":"#373339",
        "tertiary-fixed-dim":"#f2b6d0",
        "on-secondary-container":"#bfb0c8",
        "on-surface-variant":"#ccc4cd",
        "on-tertiary-container":"#431c31",
        "tertiary-fixed":"#ffd8e8",
        "tertiary-container":"#b7819a",
        "on-tertiary":"#4b2338",
        "on-primary-container":"#332244",
        "outline":"#958e97",
        "surface-dim":"#151217",
        "surface-tint":"#d6bde9",
        "secondary-fixed-dim":"#d1c1da",
        "surface":"#151217",
        "surface-container-lowest":"#100d12",
        "secondary-container":"#4e4256",
        "surface-variant":"#373339",
        "on-tertiary-fixed-variant":"#65394f",
        "on-error":"#690005",
        "surface-container":"#211e23",
        "surface-container-low":"#1d1a1f",
        "secondary-fixed":"#edddf6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "3rem",
        "margin": "1.25rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "gutter-desktop": "1.5rem",
        "gutter": "1rem",
        "space-xs": "0.25rem"
      },
      fontFamily: {
        "headline-lg": ["Plus Jakarta Sans"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        "headline-lg": ["32px", {"lineHeight":"40px", "fontWeight":"600"}]
      }
    },
  },
  plugins: [],
}
