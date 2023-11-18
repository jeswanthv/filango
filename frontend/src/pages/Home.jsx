import {
  Box,
  Card,
  CardBody,
  Checkbox,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/Navbar";
import FilePond from "../components/Filepond";

const Home = () => {
  return (
    <>
      <Navbar />
      <div width="100%">
        <Box margin={"auto"} maxW={"1200px"}>
          <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Flex align={"center"} justify={"center"}>
              <Stack mt={5} spacing={4} w={"full"} maxW={"md"}>
                <FilePond />
              </Stack>
            </Flex>
          </Flex>
        </Box>
        <Box mt={5} margin={"auto"} maxW={"800px"}>
          <Card mt={5}>
            <CardBody>
              <Text>View a list of all your files.</Text>
            </CardBody>
          </Card>
        </Box>
      </div>
    </>
  );
};

export default Home;
