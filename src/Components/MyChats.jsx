import React, { useEffect, useState } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState([]);
  const toast = useToast();
  const fetchChats = async () => {
    try {
      {
        console.log(user.token);
      }
      console.log(`user : ${user}`);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured",
        description: "Unable to load chats at this time",
        position: "bottom",
        status: "warning",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    console.log(`fetchAgain: ${fetchAgain}`);
    console.log(fetchAgain);
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={2}
      background="white"
      width={{ base: "100%", md: "35%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={2}
        px={3}
        fontSize={{ base: "28px", md: "14px" }}
        fontFamily="'Poppins'"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "14px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            Create Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding={2}
        background="#0FBBBD"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="scroll"
      >
        {chats ? (
          <Box>
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                background={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                mt={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Box>
            ))}
          </Box>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
