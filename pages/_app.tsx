import { ChakraProvider } from "@chakra-ui/react";
import Layout from "components/Layout";
import { AppProps } from "next/app";
import theme from "utils/theme";
import GameProvider from "../contexts/gameContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <GameProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GameProvider>
    </ChakraProvider>
  );
}

export default MyApp;
