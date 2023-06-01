import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ChakraProvider } from "@chakra-ui/react";

import Layout from "~/components/Layout";
import { theme } from "~/theme/theme";
import { orbitron } from "~/theme/font";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <main className={orbitron.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
