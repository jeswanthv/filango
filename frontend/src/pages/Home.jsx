import { Box, Card, CardBody, Flex, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilePond from "../components/Filepond";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <>
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
          <Card mx={4} mt={5}>
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
