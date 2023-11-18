import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const fonts = {
  heading: `'Mukta'`,
  body: `'Mukta'`,
};
const theme = extendTheme({ fonts });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Routes />
    </ChakraProvider>
  </React.StrictMode>
);
