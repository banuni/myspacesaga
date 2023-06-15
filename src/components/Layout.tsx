import type { PropsWithChildren } from "react";
import { Box, Button, Flex, Text, Link } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import novaLogo from "./nova_log.png";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ADMIN_EMAILS = ["nuni@kovrr.com", "yoav.buddy@gmail.com"];

const Layout = ({ children }: PropsWithChildren) => {
  const { route, push } = useRouter();
  const { data: userData, isLoading } = api.user.get.useQuery();
  if (isLoading || !userData) {
    return <>Loading...</>;
  }
  const isCreating = userData.isNew;
  if (route !== "/create" && isCreating) {
    void push("/create");
  }
  const isAdmin = ADMIN_EMAILS.includes(userData.user?.email || "");

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
        <Flex
          gap="5"
          borderY="1px"
          borderColor="white"
          h="50px"
          p="5px"
          alignItems="center"
        >
          <Button
            as={isCreating ? undefined : NextLink}
            href="/main"
            variant={route === "/main" ? "active" : undefined}
            isDisabled={isCreating}
          >
            Main
          </Button>
          <Button
            as={isCreating ? undefined : NextLink}
            href="/send"
            variant={route === "/send" ? "active" : undefined}
            isDisabled={isCreating}
          >
            Send LNX
          </Button>
          <Button
            as={isCreating ? undefined : NextLink}
            href="/balcony"
            variant={route === "/balcony" ? "active" : undefined}
            isDisabled={isCreating}
          >
            Star Balcony
          </Button>
          {isAdmin && (
            <Button
              as={NextLink}
              href="/admin"
              variant={route === "/admin" ? "active" : undefined}
            >
              Admin
            </Button>
          )}
          {isAdmin && (
            <Button
              as={NextLink}
              href="/admin-balcony"
              variant={route === "/admin-balcony" ? "active" : undefined}
            >
              Admin
            </Button>
          )}
          {isCreating && (
            <Button variant={route === "/create" ? "active" : undefined}>
              Create
            </Button>
          )}
        </Flex>
        <Box h="calc(100% - 235px)">{children}</Box>
      </Box>
    </>
  );
};

export default Layout;
