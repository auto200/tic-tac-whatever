import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  //@ts-ignore
  config,
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
        minHeight: "100vh",
      },
    },
  },
});
export default theme;
