const path = require('path');
module.exports = {
  purge: [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './src/**/*.{vue,js,ts,jsx,tsx}'),
  ],
  prefix: 'tw-',
  theme: {
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
    },
    extend: {},
  },
  plugins: [],
};
