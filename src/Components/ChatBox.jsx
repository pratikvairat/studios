import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      bg="white"
      p={3}
      overflowY="hidden"
      borderRadius="lg"
      borderWidth="1px"
      width={{ base: "100%", md: "64%" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
