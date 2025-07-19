const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      }
    },
  },
  plugins: [
    plugin(function({addVariant}) {
      addVariant('neon', '.neon &')
    })
  ],
}
