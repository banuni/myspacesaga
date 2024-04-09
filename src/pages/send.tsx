import {
  Box,
  Center,
  Flex,
  Grid,
  Text,
  GridItem,
  NumberInput,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Input, NumberInputField } from "~/components/Input";
import { api } from "~/utils/api";

type FormValues = {
  amount: number;
  walletId: string;
};
const Page = () => {
  const { data: user } = api.user.get.useQuery();
  const { data: trx } = api.user.transactions.useQuery();
  const utils = api.useContext();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const toast = useToast({ colorScheme: "whiteAlpha" });
  const { mutate: sendLnx } = api.user.transferTo.useMutation({
    onSuccess: () => {
      const { amount, walletId } = getValues();
      toast({
        title: "Success!",
        description: `transferred ${amount} LNX to ${walletId}`,
      });
      reset();
      void utils.user.invalidate();
    },
    onError: (e) => toast({ title: "Error", description: e.message }),
  });
  const walletId = user?.user?.walletId;
  const balance = user?.user?.balance;
  const log =
    trx &&
    trx?.map((t) => {
      if (t.from === walletId) {
        return `Sent ${t.amount} LNX to ${t.to || "?"}`;
      }
      return `Got ${t.amount} LNX from ${t.from || "???"}`;
    });

  const onSubmit = (v: FormValues) => {
    const { walletId, amount } = v;
    sendLnx({ target: walletId, amount });
  };
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
        {/*  eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="2fr 2fr 1fr"
            rowGap="10px"
          >
            <GridItem>
              <Text>Wallet ID</Text>
            </GridItem>
            <GridItem>
              <Input {...register("walletId")} />
            </GridItem>
            <GridItem rowSpan={2}>
              <Box h="100%">
                <Button
                  textAlign="center"
                  variant="action"
                  w="100px"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Send LNX!
                </Button>
              </Box>
            </GridItem>
            <GridItem>
              <Text>Amount</Text>
            </GridItem>
            <GridItem>
              <NumberInput>
                <NumberInputField
                  {...register("amount", { valueAsNumber: true })}
                />
              </NumberInput>
            </GridItem>
          </Grid>
        </form>
      </Box>
      <Text mt="20px" ml="20px" mb="5px">
        LNX Log
      </Text>
      <Box backgroundColor="black" flexGrow={1} overflow="auto" p="5px">
        {!log
          ? "loading"
          : log.map((t, i) => (
              <Text variant="secondary" fontSize="14px" key={i} p="2px">
                {`> ${t}`}
              </Text>
            ))}
      </Box>
    </Flex>
  );
};

export default Page;
