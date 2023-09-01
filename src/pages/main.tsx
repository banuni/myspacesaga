import { Avatar, Box, Center, Flex, Grid, Text } from "@chakra-ui/react";
import { SignIn, useAuth, useUser } from "@clerk/nextjs";
import { UploadButton } from "~/utils/uploadthing";
import { useState } from "react";
import "@uploadthing/react/styles.css";

import { api } from "~/utils/api";

const Page = () => {
  const [showOrigin, setShowOrigin] = useState(false);
  const utils = api.useContext();
  const user = useUser();
  const { signOut } = useAuth();
  const { data: userData } = api.user.get.useQuery();
  const { mutate: update } = api.user.update.useMutation();
  if (!user) {
    return <SignIn />;
  }

  const factionColor = "gold";

  const { faction, rank, origin, name } = userData?.user || {};
  return (
    <Box padding="20px" h="100%">
      <Flex direction="column" h="100%" justifyContent="space-between">
        <Center>
          <Box textAlign="center" pb="30px">
            <Avatar
              height="200px"
              width="200px"
              src={userData?.user?.profileImageUrl || undefined}
              ignoreFallback
            />
            <Text mt="20px" color="gray" fontWeight="400" fontSize="26px">
              {userData?.user?.name}
            </Text>
          </Box>
        </Center>
        <Grid
          templateColumns={"90px 2fr"}
          rowGap="40px"
          columnGap="10px"
          mb="10px"
        >
          <Text align="end">Origin:</Text>
          <Flex justify="space-between">
            <Text variant="secondary">
              {showOrigin ? origin : "-CLASSIFIED-"}
            </Text>
            <Text variant="action" onClick={() => setShowOrigin(!showOrigin)}>
              {showOrigin ? ">Hide" : "<Show"}
            </Text>
          </Flex>

          <Text align="end">Faction:</Text>
          <Text variant="secondary" color={factionColor}>
            {faction}
          </Text>

          <Text align="end">Rank:</Text>
          <Text variant="secondary">{rank}</Text>
        </Grid>
        <Flex flexGrow={1} gap="10px" justify="space-between" align="center">
          <Text
            variant="action"
            alignSelf="flex-end"
            onClick={() => void signOut()}
          >
            Logout
          </Text>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              utils.user.get.setData(
                (() => {
                  return;
                })(),
                (prev) => {
                  if (!prev) return prev;
                  if (!prev.user) return prev;
                  console.log("updating!");
                  return {
                    ...prev,
                    user: {
                      ...prev.user,
                      profileImageUrl: res?.at(0)?.url || "",
                    },
                  };
                }
              );
              void utils.user.invalidate();
            }}
            appearance={{
              button({ isUploading }) {
                return {
                  backgroundColor: isUploading ? "#e9e9e9" : "#A31831",
                };
              },
              allowedContent: () => ({
                display: "none",
              }),
            }}
            content={{
              button({ isUploading }) {
                return isUploading ? undefined : "Choose Image";
              },
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Page;
