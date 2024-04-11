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
import Image from "next/image";
import balconyLogo from "./balcony.png";
import { useRef, useState } from "react";
import { orbitron } from "~/theme/font";
import { api } from "~/utils/api";

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
    <Box backgroundColor="rgba(41, 38, 110, 0.75)" pb="30px">
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
            Wallet ID: BALCONY
          </Text>
        </Box>
      </Flex>
      <Box p="20px" lineHeight="36px">
        {[barItems, foodItems, special].map((items, idx) => {
          return (
            <Flex mb="20px" key={idx} flexDirection="column" gap="10px">
              {items.map(([name, price]) => {
                return (
                  <Flex
                    key={name}
                    justify="space-between"
                    gap="10px"
                    alignItems="center"
                  >
                    <Text variant="menuItem">{name}</Text>

                    <Button
                      variant="solid"
                      onClick={() => handleBuyClick(name, price)}
                      minW="140px"
                    >
                      Buy {price} LNX
                    </Button>
                  </Flex>
                );
              })}
            </Flex>
          );
        })}
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
                  toast({
                    variant: "left-accent",
                    colorScheme: "toastGood",
                    title: "Success!",
                    description: `${currentItem?.name || ""} bought!`,
                  });
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
