const aditionalSizes = {};

for (let i = 0; i < 21; i++) {
  aditionalSizes[100 + i * 4] = `${25 + i}rem`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", ".chakra-ui-dark"],
  theme: {
    extend: {
      width: {
        ...aditionalSizes,
      },
      height: {
        ...aditionalSizes,
      },
    },
  },
  plugins: [],
};
