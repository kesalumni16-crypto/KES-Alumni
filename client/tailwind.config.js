/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#7CFC00',
        'highlight-green': '#ADFF2F',
        'primary-green-dark': '#6BDB00',
        'highlight-green-dark': '#9AE62F',
      },
    },
  },
  plugins: [],
}

