import flowbite from 'flowbite-react/tailwind'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    screens: {
      'mobile': {'max': '639px'},
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          main: '#F5F5F5',
          'link-button': '#07a290'
        },
        dark: {
          main: '#101827', //#0D1116
          'link-button': '#057e78'
        }
      },
      fontFamily: {
        roboto: '"Roboto", sans-serif',
        montserrat: '"Montserrat", sans-serif'
      }
    }
  },
  plugins: [flowbite.plugin()]
}
