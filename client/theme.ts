// theme.ts

// 1. import `extendTheme` function
import { extendTheme, withDefaultColorScheme, type ThemeConfig } from "@chakra-ui/react";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme(withDefaultColorScheme({ colorScheme: "green" }), { config });

export { theme };
