import {
  Input as ChakraInput,
  NumberInputField as ChakraNumberInputField,
  type InputProps,
  type NumberInputFieldProps,
} from "@chakra-ui/react";
import React from "react";
export const inputStyles = {
  borderColor: "red",
  borderRadius: "15px",
  borderWidth: "2px",
  color: "white",
  _focus: {
    borderColor: "white",
  },
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <ChakraInput ref={ref} {...inputStyles} {...props} />;
  }
);

export const NumberInputField = React.forwardRef<
  HTMLInputElement,
  NumberInputFieldProps
>((props, ref) => {
  return <ChakraNumberInputField ref={ref} {...inputStyles} {...props} />;
});

Input.displayName = "Input";
NumberInputField.displayName = "NumberInputField";
