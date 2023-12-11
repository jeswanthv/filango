import {
  Box,
  Flex,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import File from "../components/File";
import FilePond from "../components/Filepond";
import config from "../constants";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<[]|null>(null);

  const apiUrl = config.apiUrl;

  const fetchData = async (user:String|null) => {
    try {
      const response = await axios.get(`${apiUrl}/api/files`, {
        params: { user },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      // Handle errors
      console.log(error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (!user) {
      navigate("/login");
    }
    fetchData(user);
  }, []);

  return (
    <>
      <div >
        <Box margin={"4rem auto"} maxW={"1200px"}>
          <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Flex align={"center"} justify={"center"}>
              <Stack mt={5} spacing={4} w={"1000px"} maxW={"md"}>
                <FilePond />
              </Stack>
            </Flex>
          </Flex>
        </Box>
        <Box margin={"auto"} maxW={"1000px"}>
          <StatGroup mx={5}>
            <Stat>
              <StatLabel>Total Files</StatLabel>
              <StatNumber>{data?.length}</StatNumber>
            </Stat>
          </StatGroup>
          {data?.map((file) => (
            <File file={file} />
          ))}
        </Box>
      </div>
    </>
  );
};

export default Home;
