import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { api } from "~/utils/api";

type FormValues = { name: string; faction: string; origin: string}

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const {mutate: createUser} = api.user.create.useMutation()

  function onSubmit(values: FormValues) {
    createUser(values);
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="name">First name</FormLabel>
        <Input
          id="name"
          placeholder="name"
          {...register("name", {
            required: "This is required",
          })}
        />
        <Input
          id="faction"
          placeholder="faction"
          {...register("faction", {
            required: "This is required",
          })}
        />
        <Input
          id="origin"
          placeholder="origin"
          {...register("origin", {
            required: "This is required",
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
