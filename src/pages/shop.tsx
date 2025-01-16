import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import Image, { type StaticImageData } from "next/image";
import barBanner from "./bar-banner.gif";
import tortillaImage from "./tortilla.png";
import icecreamImage from "./ice-cream.png";
import waffleImage from "./waffle.png";
import nachosImage from "./nachos.png";

import { useRef, useState } from "react";
import { orbitron } from "~/theme/font";
import { api } from "~/utils/api";

const barItems: [string, string, number][] = [
  ["Earthian's", "Drinks", 10],
  ["Patriotic Front's", "Beer", 15],
  ["Brakalian", "Cocktail", 20],
  ["Forgotten", "Breezer", 20],
  ["Corpo's", "Shot", 10],
];

const foodItems: [string, string, number, StaticImageData?][] = [
  // ["Falakorian", "Tortilla", 20, tortillaImage],
  // ["Pluto", "Ice Cream", 15, icecreamImage],
  // ["Segmented", "Waffle", 15, waffleImage],
  ["Maker's", "Munchies", 10, nachosImage],
];

const merchItems: [string, string, number][] = [
  // ["One Fleet Rank", "", 25],
  // ["Captain's Star", "", 35],
  // ["Book - Peace & Prosperity", "", 40],
  // ["Booklet - Fighting In The Shades (Only for Fleeters)", "", 20],
];

const Page = () => {
  const [currentItem, setCurrentItem] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const cancelRef = useRef(null);
  const toast = useToast();

  const { mutate: doBuyItem, isLoading } = api.user.buyItem.useMutation({
    onSuccess: () => {
      toast({
        variant: "left-accent",
        colorScheme: "toastGood",
        title: "Success!",
        description: `${currentItem?.name || ""} bought!`,
      });
      setCurrentItem(null);
    },
    onError: (error) => {
      toast({
        variant: "left-accent",
        colorScheme: "toastBad",

        title: "Transaction not completed!",
        description: error.message,
      });
      setCurrentItem(null);
    },
  });
  const handleBuyClick = (name: string, price: number) => {
    setCurrentItem({ name, price });
  };
  const handleCancelBuy = () => {
    setCurrentItem(null);
  };

  return (
    <Box backgroundColor="rgba(122, 0, 119, 0.49)" pb="30px">
      <Box p="5">
        <Image src={barBanner} alt="" />
      </Box>
      <Box p="20px" lineHeight="36px">
        {[barItems, foodItems, merchItems].map((items, idx) => {
          const highlightColor =
            idx === 0 ? "rgb(253, 53, 72)" : "rgb(254, 180, 0)";

          return (
            <>
              <Flex mb="20px" key={idx} flexDirection="column" gap="10px">
                {items.map(([name, highlighted, price, imageSrc]) => {
                  return (
                    <Flex
                      key={name}
                      justify="space-between"
                      gap="10px"
                      alignItems="center"
                    >
                      <Text variant="menuItem" flexGrow={1}>
                        {name}&nbsp;
                        <Text color={highlightColor} display="inline">
                          {highlighted}
                        </Text>
                      </Text>

                      <Button
                        // variant="solid"
                        border="solid 2px rgb(21, 222, 233)"
                        color="rgb(21, 222, 233)"
                        onClick={() => handleBuyClick(name, price)}
                        minW="100px"
                      >
                        {price} LNX
                      </Button>
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={name}
                          width={50}
                          height={50}
                        />
                      )}
                    </Flex>
                  );
                })}
              </Flex>
              <Box w="100%" h="20px" />
            </>
          );
        })}
        <Flex justify="space-around">
          <Button
            as="a"
            href="https://www.bitpay.co.il/app/me/F2E2ED19-B03B-65DE-7FD1-D2E55CB58CAA963D"
          >
            LOAD LNX
          </Button>
        </Flex>
        ...
      </Box>
      <AlertDialog
        isOpen={!!currentItem}
        onClose={handleCancelBuy}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className={orbitron.className}>
            <AlertDialogBody>
              <Box mb="5px" color="gray">
                Are you sure you want to buy
              </Box>
              <Text
                fontWeight="bold"
                color="black"
                display="inline"
                fontSize="lg"
              >
                {currentItem?.name}
              </Text>{" "}
              for{" "}
              <Text
                fontSize="lg"
                color="#71f1ff"
                bgColor="black"
                display="inline"
                fontWeight="bold"
                p="3px"
                whiteSpace={"nowrap"}
                borderRadius="5px"
                m="2px"
              >
                {currentItem?.price} LNX
              </Text>
              ?
            </AlertDialogBody>
            <AlertDialogFooter
              display="flex"
              justifyContent="space-between"
              w="100%"
            >
              <Button
                bgColor="rgba(41, 38, 110)"
                isLoading={isLoading}
                onClick={() => {
                  if (!currentItem?.price) {
                    return;
                  }
                  doBuyItem({
                    item: currentItem?.name,
                    amount: currentItem?.price,
                  });
                }}
              >
                Buy!
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelBuy}
                disabled={isLoading}
                ref={cancelRef}
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Page;
