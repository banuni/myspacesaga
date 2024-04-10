import { extendTheme } from "@chakra-ui/react";

export const inputStyle = {
  borderColor: "red",
  borderRadius: "15px",
  borderWidth: "2px",
  color: "white",
  _focus: {
    borderColor: "white",
  },
};

export const theme = extendTheme({
  styles: {
    global: { body: "Orbitron" },
  },
  colors: {
    toastGood: {
      100: "white",
      600: "#FFD700",
    },
    toastBad: {
      100: "white",
      600: "#A31831",
    },
    red: {
      custom: "#A31831",
    },

    grey: { custom: '"#e9e9e9"' },
  },
  components: {
    Button: {
      baseStyle: {
        _active: {
          backgroundColor: "none",
        },
        backgroundColor: "transparent",
        color: "white",
        padding: 0,
        fontSize: "12px",
      },
      variants: {
        primary: {
          borderWidth: "2px",
          borderRadius: "15px",
          borderColor: "white",
          _hover: {
            borderColor: "red.custom",
            color: "red.custom",
          },
          _active: {
            borderColor: "gold",
            color: "gold",
          },
        },
        active: {
          borderColor: "red.custom",
          borderWidth: "2px",
          borderRadius: "15px",
        },
        nav: {
          backgroundColor: "red.custom",
        },
      },
      defaultProps: {
        variant: "default",
        fontSize: "10px",
      },
    },
    Text: {
      baseStyle: {
        color: "white",
      },
      defaultProps: {
        variant: "primary",
      },
      variants: {
        primary: {
          color: "white",
          fontSize: "20px",
        },
        secondary: {
          color: "gray",
          fontSize: "18px",
        },
        action: {
          userSelect: "none",
          color: "red.custom",
          fontSize: "20px",
          _hover: {
            color: "white",
          },
        },
        title: {
          fontSize: "24px",
          color: "white",
        },
        menuItem: {
          fontSize: "22px",
          lineHeight: "32px",
        },
      },
    },
  },
});
