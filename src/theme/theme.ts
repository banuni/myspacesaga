import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    styles: {
        global: { body: "Orbitron" },
    },
    colors: {
        red: "#A31831",
        grey: "#e9e9e9",
    },
    components: {
        Button: {
            baseStyle: {
                backgroundColor: "transparent",
                color: "white",
                padding: 0,
                fontSize: "12px",
            },
            variants: {
                active: {
                    borderColor: "red",
                    borderWidth: "2px",
                    borderRadius: "15px",
                },
                nav: {
                    backgroundColor: "red",
                },
            },
            defaultProps: {
                variant: "default",
                fontSize: "10px",
            },
        },
        Text: {
            defaultProps: {
                variant: "primary",
            },
            variants: {
                primary: {
                    color: "white",
                    fontSize: "20px",
                },
                secondary: {
                    color: 'gray',
                    fontSize: '20px'
                },
                action: {
                    color: 'red',
                    fontSize: '20px'
                },
                title: {
                    fontSize: "24px",
                    color: "white",
                },
            },
        },
    },
});