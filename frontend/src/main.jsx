import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "./context/authContext";

const fonts = {
  heading: `'Mukta'`,
  body: `'Mukta'`,
};
const theme = extendTheme({ fonts });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Routes />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
