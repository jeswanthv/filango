import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Link as ChakraLink,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import config from "../constants";

export default function Login() {
  const toast = useToast();
  const apiUrl = config.apiUrl;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) {
      console.log(user);
      navigate("/");
    }
  }, []);

  const handleLogin = async (e:SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      });
      localStorage.setItem("userId", response?.data?.userId);
      localStorage.setItem("userName", response?.data?.userName);
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
        title: (error as any)?.response?.data?.error,
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
