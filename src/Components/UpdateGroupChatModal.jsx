import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    console.log(selectedChat);
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can remove someone ! ",
        status: "error",
        duaration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id === userToRemove._id) {
      toast({
        title: "Admin can't be removed itself",
        duration: 5000,
        status: "warning",
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.users.length === 3) {
      toast({
        title: "Group require 3 members so cannot remove",
        duration: 5000,
        status: "warning",
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/remove-member",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Unknown Error ",
        status: "error",
        duaration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Cannot rename empty group name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
      setGroupChatName("");
      toast({
        title: "Unknown error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Unknown Error occured",
        placeholder: "bottom-left",
        status: "error",
        duration: 5000,
        isClosable: "true",
      });
    }
  };
  const SelectedUserHandler = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already in group",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        status: "error",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone ! ",
        status: "error",
        duaration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/add-member",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Unknown Error ",
        status: "error",
        duaration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<ViewIcon />}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="34px"
            fontFamily="'Poppins'"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" w="100%" pb={2}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  admin={selectedChat.groupAdmin._id}
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search user to add to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <Box width="100%">
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => SelectedUserHandler(user)}
                  />
                </Box>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
