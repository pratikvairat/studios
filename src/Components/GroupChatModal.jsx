import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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
      setSearchResults(data);
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
  const handleCancel = () => {
    setLoading(false);
    setSearchResults([]);
    setSearch("");
    setGroupChatName("");
    setSelectedUsers([]);
    onClose();
  };
  const SelectedUserHandler = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        duration: 3000,
        position: "top",
        status: "info",
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Group and members must not be empty",
        status: "warning",
        position: "top",
        isClosable: true,
        duration: 5000,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: `New Group ${groupChatName} created`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "botton",
      });
      setSelectedUsers([]);
      setGroupChatName("");
    } catch (error) {
      toast({
        title: "Failed to create the chat!",
        description: JSON.stringify(error.response.data.message),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="'Poppins'"
            display="flex"
            justifyContent="center"
          >
            Group a Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            mr={3}
            alignItems="center"
            flexDirection="column"
          >
            <FormControl>
              <Input
                placeholder="Group name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search users to add"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" flexWrap="wrap" display="flex">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResults?.slice(0, 4).map((user) => (
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
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
            <Button colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
