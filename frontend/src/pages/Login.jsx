import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import config from "../constants";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const toast = useToast();
  const apiUrl = config.apiUrl;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) {
      console.log(user);
      navigate("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      });
      login(response?.data?.userId, response?.data?.userName);
      navigate("/");

      // Handle the response as needed
      toast({
        title: "Successfully logged in",
        position: "top",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      // Handle errors
      toast({
        title: error?.response?.data?.error,
        position: "top",
        description: "Please type in valid credentials",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          w={"450px"}
        >
          <Stack spacing={4}>
            <form onSubmit={handleLogin}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Text color={"blue.400"}>Forgot password?</Text>
                </Stack>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
        <Text fontSize={"lg"} color={"gray.400"}>
          Are you new here?{" "}
          <ChakraLink color={"blue.400"} as={ReactRouterLink} to="/register">
            register
          </ChakraLink>
        </Text>
      </Stack>
    </Flex>
  );
}
