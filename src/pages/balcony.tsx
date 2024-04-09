import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import balconyLogo from "./balcony.png";

const barItems: [string, number][] = [
  ["Simple Drink", 10],
  ["Space Beer", 15],
  ["Cocktail", 20],
  ["Lunasa Prison Shot", 15],
];

const foodItems: [string, number][] = [
  ["Milky-Way Ice Cream", 10],
  ["Galactic Pizza (1/4)", 10],
  ["Galactic Pizza", 30],
];

const special: [string, number][] = [
  ["Book: Peace and Prosperity among the Stars", 40],
];

const Page = () => {
  return (
    <Box backgroundColor="rgba(41, 38, 110, 0.75)" h="100%">
      <Flex
        justifyContent="space-evenly"
        alignItems="center"
        p="20px"
        h="185px"
      >
        <Image src={balconyLogo} alt="" width="145" />
        <Box>
          <Text variant="title" textAlign="center" color="gold" fontSize="32px">
            Bar Menu
          </Text>
          <Text variant="title" textAlign="center" color="gold" fontSize="20px">
            Wallet ID: BALCONY / balcony / BalCoNy
          </Text>
        </Box>
      </Flex>
      <Box p="20px" lineHeight="36px">
        {[barItems, foodItems, special].map((items, idx) => {
          return (
            <Box mb="20px" key={idx}>
              {items.map(([name, price]) => {
                return (
                  <Flex key={name} justify="space-between">
                    <Text variant="menuItem">{name}</Text>
                    <Text variant="menuItem" color="#71f1ff">
                      {price} LNX
                    </Text>
                  </Flex>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Page;
