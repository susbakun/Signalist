import flowbite from 'flowbite-react/tailwind'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#EAEAEA',
          'link-button': '#07a290'
        },
        dark: {
          main: '#101827',
          'link-button': '#057e78'
        }
      },
      fontFamily: {
        anta: '"Anta", sans-serif'
      }
    }
  },
  plugins: [flowbite.plugin()]
}
