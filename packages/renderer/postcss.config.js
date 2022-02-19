const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const { join } = require('path');

module.exports = {
  plugins: [
    tailwindcss({
      config: join(__dirname, './tailwind.config.js'),
    }),
    autoprefixer({}),
  ],
};
