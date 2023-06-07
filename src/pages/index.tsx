import { Text } from "@chakra-ui/react";
import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.user.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Text variant="primary">Nova Log...</Text>
      <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
    </>
  );
};

export default Home;
