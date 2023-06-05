import {
  Box,
  Center,
  Flex,
  Grid,
  Input,
  Text,
  GridItem,
  NumberInputField,
  NumberInput,
} from "@chakra-ui/react";

const inputStyles = {
  borderColor: "red",
  borderRadius: "15px",
  borderWidth: "2px",
  color: "white",
  _focus: {
    borderColor: "white",
  },
};

const Page = () => {
  const walletId = "1234421";
  const balance = 400;
  const log = [
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
    "Sent 100 to Wallet ID 4444333 at 04:04:04",
  ];
  return (
    <Flex h="100%" direction="column">
      <Box p="20px">
        <Flex gap="10px">
          <Text variant="primary">Wallet ID:</Text>
          <Text variant="secondary">{walletId}</Text>
        </Flex>
        <Center my="40px">
          <Box textAlign="center">
            <Text fontSize="48px" variant="secondary">
              {balance}
            </Text>
            <Text variant="secondary">LNX Balance</Text>
          </Box>
        </Center>
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="2fr 2fr 1fr"
          rowGap="10px"
        >
          <GridItem>
            <Text>Wallet ID</Text>
          </GridItem>
          <GridItem>
            <Input name="walletId" {...inputStyles} />
          </GridItem>
          <GridItem rowSpan={2}>
            <Box h="100%">
              <Text textAlign="center" variant="action" w="100px">
                Send LNX!
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text>Amount</Text>
          </GridItem>
          <GridItem>
            <NumberInput>
              <NumberInputField name="amount" {...inputStyles} />
            </NumberInput>
          </GridItem>
        </Grid>
      </Box>
      <Text mt="20px" ml="20px" mb="5px">
        LNX Log
      </Text>
      <Box backgroundColor="black" flexGrow={1} overflow="auto" p="5px">
        {log.map((t, i) => (
          <Text variant="secondary" fontSize="14px" key={i} p="2px">
            {`> ${t}`}
          </Text>
        ))}
      </Box>
    </Flex>
  );
};

export default Page;
