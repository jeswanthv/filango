import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardHeader,
  Center,
  CloseButton,
  Container,
  Flex,
  Heading,
  IconButton,
  Image,
  SlideFade,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import config from "../constants";
import Fileicon from "./Fileicon";

interface File {
  type: string;
  preview: string;
  name: string;
}

export default function Filepond() {
  const apiUrl = config.apiUrl;
  const [files, setFiles] = useState<[]>([]);
  const { colorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      (files as { preview: string }[]).forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles((prevState) =>
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as []
      );
    },
    maxFiles: 1,
  });

  const uploadFile = async () => {
    const formData = new FormData();
    const user = localStorage.getItem("userId");
    formData.append("file", files[0]||"");
    formData.append("userId", user||"");
    const res = await axios.post(`${apiUrl}/api/file`, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    toast({
      title: res.data.message,
      position: "top",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    window.location.reload();
  };

  const thumbs = files.map((file:File) => (
    <SlideFade
      in
      offsetY="-20px"
      transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}
    >
      <Tooltip hasArrow label="Cancel upload" placement="top">
        <CloseButton onClick={() => setFiles([])} size="md" />
      </Tooltip>
      {file?.type?.includes("image") ? (
        <Image
          height="250px"
          mb={3}
          p={4}
          w={"full"}
          objectFit={"contain"}
          src={file.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      ) : (
        <Card p={3} mx={4} my={5}>
          <Flex color="white">
            <Center flex="1">
              <Fileicon title={file.name} />
              {/* <Icon as={FaFile} /> */}
            </Center>
            <Box flex="12">
              <CardHeader>
                <Text>{file.name}</Text>
              </CardHeader>
            </Box>
          </Flex>
        </Card>
      )}

      <Flex justifyContent={"end"}>
        <Tooltip hasArrow label="Upload" placement="right">
          <IconButton
            onClick={uploadFile}
            borderRadius={"100px"}
            colorScheme="blue"
            aria-label="Search database"
            icon={<ArrowRightIcon />}
          />
        </Tooltip>
      </Flex>
    </SlideFade>
  ));

  return (
    <Container>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            File upload
          </Heading>
          {files.length == 0 && (
            <Box
              border={1}
              borderRadius={5}
              p={"6rem"}
              backgroundColor={colorMode === "light" ? "gray.100" : "gray.600"}
              borderStyle={"dashed"}
              {...getRootProps({ className: "dropzone" })}
            >
              <input {...getInputProps()} />
              <p>
                Drag 'n' drop some file here, or click here to select the file
              </p>
            </Box>
          )}
        </Stack>
      </Flex>
      <Flex marginTop={2} align={"center"} justify={"center"}>
        <Stack w={"full"} margin={"auto"} maxW={"md"}>
          <Box p={3} borderRadius={"md"}>
            {thumbs}
          </Box>
        </Stack>
      </Flex>
    </Container>
  );
}
