import { extendTheme } from "@chakra-ui/react";
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({
  //@ts-ignore
  config,
  // styles: {
  //   global: {
  //     "html, body, #__next": {
  //       // width: "100%",
  //       // height: "100%",
  //     },
  //   },
  // },
});
export default theme;
