import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      500: "#A435F0",
      600: "#8710d8",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#f7f9fa",
      },
    },
  },
  radii: {
    md: "8px",
    lg: "12px",
  },
});

export default theme;