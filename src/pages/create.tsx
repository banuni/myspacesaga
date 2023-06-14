import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { inputStyle } from "~/theme/theme";
import { useRouter } from "next/router";

type FormValues = { name: string; faction: string; origin: string };

export default function CreationPage() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter()
  const utils = api.useContext()
  const { mutateAsync: createUser } = api.user.create.useMutation();

  async function onSubmit(values: FormValues) {
    await createUser(values);
    await utils.user.invalidate();
    await router.push('/main')
  }

  return (
    <Box p="20px">
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="name">
            <Text>Character Name</Text>
          </FormLabel>
          <Input
            {...inputStyle}
            id="name"
            placeholder="Captain Aziz Jamili"
            {...register("name", {
              required: "This is required",
            })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="faction">
            <Text>Faction</Text>
          </FormLabel>
          <Input
            {...inputStyle}
            id="faction"
            placeholder="Space Marines"
            {...register("faction", {
              required: "This is required",
            })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="origin">
            <Text>Origin</Text>
          </FormLabel>
          <Input
            {...inputStyle}
            id="origin"
            placeholder="Sector ﬁ"
            {...register("origin", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          variant="primary"
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
