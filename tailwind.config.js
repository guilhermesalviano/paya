// File: tailwind.config.js
module.exports = {
  content: ["./renderer/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-pattern': "url('../images/cat-logo.png')",
      }
    }
  },
  plugins: [],
};