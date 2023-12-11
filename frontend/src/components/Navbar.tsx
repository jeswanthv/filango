import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import filango from "../assets/Filango.png";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const user = localStorage.getItem("userName");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Successfully logged out",
      position: "top",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <>
      <Box
        position={"fixed"}
        width={"100%"}
        zIndex={"2"}
        top={"0"}
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <Flex
          mx={"5"}
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Flex alignItems={"center"}>
            <Image src={filango} width={"70px"} />
            <Text
              fontSize={"2xl"}
              fontFamily={"monospace"}
              letterSpacing={".2rem"}
            >
              FILANGO
            </Text>
          </Flex>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    {<p>{user}</p>}
                  </Center>
                  <br />
                  <MenuDivider />
                  {user? (
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  ) : (
                    <Link to="/login">
                      <MenuItem>Log in</MenuItem>
                    </Link>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
