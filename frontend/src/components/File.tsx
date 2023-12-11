import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Center,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import config from "../constants";
import Fileicon from "./Fileicon";

interface FileProps {
  file: {
    id: number;
    title: string;
    url: string;
  };
}

const File = (props:FileProps) => {
  const apiUrl = config.apiUrl;

  const { file } = props;
  const [signedUrl, setSignedUrl] = useState(file.url);

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleDelete = async () => {
    console.log("delete");
    const user = localStorage.getItem("userId");
    const res = await axios.delete(`${apiUrl}/api/file/${file.id}`, {
      data: { userId: parseInt(user || "") },
    });
    toast({
      title: res.data.message,
      position: "top",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    window.location.reload();
  };
  return (
    <>
      <Card mx={4} my={5}>
        <Flex color="white">
          <Center flex="1">
            <Fileicon title={file.title} />
            {/* <Icon as={FaFile} /> */}
          </Center>
          <Box flex="12">
            <CardHeader>
              <Text>{file.title}</Text>
            </CardHeader>
          </Box>

          <Flex alignItems={"center"} justifyContent={"center"} flex="1">
            <Menu>
              <MenuButton>
                <Icon as={BsThreeDotsVertical} />
              </MenuButton>
              <Portal>
                <MenuList>
                  <a href={file.url} target="_blank">
                    <MenuItem>Open</MenuItem>
                  </a>

                  <MenuItem
                    onClick={() => {
                      setOverlay(<OverlayOne />);
                      onOpen();
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
            {/* <Center flex="1">
            
          </Center> */}
          </Flex>
        </Flex>
      </Card>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Delete File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure ?</Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup gap={2}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleDelete} colorScheme="red">
                Delete
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default File;
