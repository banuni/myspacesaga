import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "~/components/Layout";
import { theme } from "~/theme/theme";
import { orbitron } from "~/theme/font";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <main className={orbitron.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
