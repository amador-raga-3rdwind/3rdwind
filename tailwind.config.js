/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,css}"],
  important: true,
  corePlugins: {
    preflight: false},    
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
