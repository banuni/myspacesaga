import { Box, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import novaLogo from "./nova_log.png";

export const LoadingScreen = () => {
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
        w="100svw"
        h="100svh"
      >
        <Flex
          justifyContent="space-evenly"
          alignItems="center"
          p="20px"
          h="185px"
        >
          <Image src={novaLogo} alt="" width="145" />
          <Text variant="title" textAlign="center">
            A Safe realm for all Factions
          </Text>
        </Flex>
        <Box h="calc(100svh - 235px)" overflowY="auto" overflowX="auto">
          <Text>Loading...</Text>
        </Box>
      </Box>
    </>
  );
};
