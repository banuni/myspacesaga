import type { PropsWithChildren } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import novaLogo from "./nova_log.png";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ADMIN_EMAILS = ["banuni@gmail.com", "yoav.buddy@gmail.com"];

const links = [
  { href: "/main", label: "Main" },
  { href: "/send", label: "Send LNX" },
  { href: "/balcony", label: "Star Balcony" },
  { href: "/admin", label: "Admin", isAdmin: true },
  { href: "/admin-balcony", label: "Admin Balcony", isAdmin: true },
  { href: "/topups", label: "Top Up History", isAdmin: true },
  { href: "/create", label: "Create", isCreating: true },
];

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
        <Flex
          gap="5"
          borderY="1px"
          borderColor="white"
          h="50px"
          p="5px"
          alignItems="center"
        >
          {links.map(
            ({
              href,
              label,
              isAdmin: linkIsAdmin,
              isCreating: linkIsCreating,
            }) => {
              if (
                (linkIsAdmin && !isAdmin) ||
                (linkIsCreating && !isCreating)
              ) {
                return null;
              }
              return (
                <Button
                  key={href}
                  as={isCreating ? undefined : NextLink}
                  href={href}
                  variant={route === href ? "active" : undefined}
                  isDisabled={isCreating}
                >
                  {label}
                </Button>
              );
            }
          )}
        </Flex>
        <Box h="calc(100svh - 235px)" overflowY="auto" overflowX="auto">
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
