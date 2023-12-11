import { Icon } from "@chakra-ui/react";
import React from "react";
import { FaFile } from "react-icons/fa";
import {
  FaFileImage,
  FaFileWord,
  FaFilePdf,
  FaFilePowerpoint,
} from "react-icons/fa";

const Fileicon = ({ title }) => {
  if (title.includes("jp")) {
    return <Icon fontSize={"20px"} as={FaFileImage} />;
  } else if (title.includes("doc")) {
    return <Icon fontSize={"20px"} as={FaFileWord} />;
  } else if (title.includes("pdf")) {
    return <Icon fontSize={"20px"} as={FaFilePdf} />;
  } else if (title.includes("ppt")) {
    return <Icon fontSize={"20px"} as={FaFilePowerpoint} />;
  } else {
    return <Icon fontSize={"20px"} as={FaFile} />;
  }
};

export default Fileicon;
