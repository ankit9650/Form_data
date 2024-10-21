module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        Poppins: ['"Poppins"', "sans-serif"],
       
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};