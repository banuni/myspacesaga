import type { PropsWithChildren } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import novaLogo from "./nova_log.png";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }: PropsWithChildren) => {
  const { route } = useRouter();
  return (
    <>
      <Head>
        <title>Nova Log</title>
        <meta name="description" content="Nunzi / Goom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        className=""
        background="radial-gradient(circle, rgba(60,59,64,1) 0%,  rgba(24,47,41,1) 11%, rgba(0,4,28,1) 100%)"
        w="100%"
        h="100%"
      >
        <Flex justifyContent="space-evenly" alignItems="center" p="20px" h="185px">
          <Image src={novaLogo} alt="" width="145" />
          <Text variant="title" textAlign="center">
            A Safe realm for all Factions
          </Text>
        </Flex>
        <Flex
          gap="5"
          borderY="1px"
          borderColor="white"
          h="50px"
          p="5px"
          alignItems="center"
        >
          <Button variant={route === "/main" ? "active" : undefined}>
            <Link href="/main">Main</Link>
          </Button>
          <Button variant={route === "/send" ? "active" : undefined}>
            <Link href="/send">Send LNX</Link>
          </Button>
          <Button variant={route === "/balcony" ? "active" : undefined}>
            <Link href="/balcony">Star Balcony</Link>
          </Button>
        </Flex>
        <Box h="calc(100% - 235px)">{children}</Box>
      </Box>
    </>
  );
};

export default Layout;
