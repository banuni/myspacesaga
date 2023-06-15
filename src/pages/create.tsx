import { useForm, Controller } from "react-hook-form";
import {
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
import {
  Select,
  type OptionBase,
  type ChakraStylesConfig,
} from "chakra-react-select";

const selectStyle: ChakraStylesConfig = {
  control: (e) => ({
    ...e,
    borderRadius: "15px",
    borderColor: "red",
    color: "white",
  }),
  dropdownIndicator: (e) => ({ ...e, display: "none" }),

  menuList: (b) => ({
    ...b,
    backgroundColor: "rgba(0,0,0,0.5)",
  }),
};
const FACTION_OPTIONS = [
  "None",
  "Human Fleet",
  "The Patriotic Front",
  "Celestial Conglomerate",
].map((v) => ({ value: v, label: v }));
const RANK_OPTIONS = [
  "None",
  "Private",
  "Corporal",
  "Sergeant",
  "Senior Sergeant",
  "Sergeant Major",
  "Second Lieutenant",
  "First Lieutenant",
  "Commander ",
  "Major",
  "Captain",
  "Colonel",
  "Major-General",
  "Vice-Admiral",
  "Admiral",
  "Fleet Admiral",
].map((v) => ({ value: v, label: v }));

interface Option extends OptionBase {
  value: string;
}
type FormValues = { name: string; faction: Option; origin: Option, rank: Option };

export default function CreationPage() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const router = useRouter();
  const utils = api.useContext();
  const { mutateAsync: createUser } = api.user.create.useMutation();

  async function onSubmit(values: FormValues) {
    await createUser({
      name: values.name,
      origin: values.origin.value,
      faction: values.faction.value,
      rank: values.rank.value,
    });
    await utils.user.invalidate();
    await router.push("/main");
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
          <Controller
            rules={{required: true}}
            name="faction"
            control={control}
            render={({ field }) => {
              
              return (
                <Select
                chakraStyles={selectStyle}
                {...field}
                options={FACTION_OPTIONS}
                //   [
                //   { value: "Human Fleet", label: "Human Fleet" },
                //   { value: "Human Fleet", label: "Human Fleet" },
                //   {
                //     value: "The Patriotic Front",
                //     label: "The Patriotic Front",
                //   },
                //   {
                //     value: "Celestial Conglomerate",
                //     label: "Celestial Conglomerate",
                //   },
                // ]}
                />
                );
              }}
              />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="origin">
            <Text>Origin</Text>
          </FormLabel>
          <Controller
            name="origin"
            rules={{required: true}}
            control={control}
            render={({ field }) => {
              return (
                <Select
                chakraStyles={selectStyle}
                {...field}
                options={[
                  { value: "Human", label: "Human" },
                  { value: "Robot", label: "Robot" },
                  {
                    value: "H.MTX (Android GEN A)",
                    label: "H.MTX (Android GEN A)",
                  },
                  {
                    value: "H.Z (Android GEN B)",
                    label: "H.Z (Android GEN B)",
                  },
                  { value: "NeoSapien", label: "NeoSapien" },
                  { value: "XenoVita (Alien)", label: "XenoVita (Alien)" },
                ]}
                />
                );
              }}
              />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="Rank">
            <Text>Rank</Text>
          </FormLabel>
          <Controller
            name="rank"
            rules={{required: true}}
            control={control}
            render={({ field }) => {
              return (
                <Select
                  chakraStyles={selectStyle}
                  {...field}
                  options={RANK_OPTIONS}
                />
              );
            }}
          />
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
