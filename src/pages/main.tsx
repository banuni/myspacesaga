import { Avatar, Box, Center, Flex, Grid, Text } from "@chakra-ui/react";
import { useState } from "react";

const Page = () => {
  const [showOrigin, setShowOrigin] = useState(false);
  const faction = "Totachim";
  const factionColor = "gold";
  const rank = "Gibor";
  const origin = "LarpGladiator";
  const name = "Shimshon Yovavson";
  return (
    <Box padding="20px" h="100%">
      <Flex direction="column" h="100%" justifyContent="space-between">
        <Center>
          <Box textAlign="center" pb="30px">
            <Avatar
              height="200px"
              width="200px"
              src="https://blogscdn.thehut.net/app/uploads/sites/571/2020/09/Viking-beard-main_1630574627.jpg"
              ignoreFallback
            />
            <Text mt="20px" color="gray" fontWeight="400" fontSize="26px">
              {name}
            </Text>
          </Box>
        </Center>
        <Grid templateColumns={"90px 2fr"} rowGap="40px" columnGap="10px">
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
        <Flex direction="row-reverse" flexGrow={1}>
          <Text variant="action" alignSelf="flex-end">
            Edit Profile
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Page;
