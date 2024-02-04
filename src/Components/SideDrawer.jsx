import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import SearchIcon from "../img/search.svg";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../config/chatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    selectedChat,
    setSelectedChat,
    setChats,
    chats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);

      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Cannot chat right now",
        status: "warning",
        position: "bottom-center",
        isClosable: true,
        duration: 5000,
      });
    }
  };
  const searchHandler = async () => {
    setLoading(true);
    if (!search) {
      toast({
        title: "Please enter name or email to search",
        status: "warning",
        position: "top-left",
        isClosable: true,
        duration: 5000,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "An unknown error occurs",
        status: "warning",
        position: "top-left",
        isClosable: true,
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Box
        bg="white"
        display="flex"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        borderWidth="5px"
        padding="5px 10px 5px 10px"
      >
        <Tooltip label="Search users" hasArrow placement="bottom-end">
          <Button variant="ghost" padding="6px" onClick={onOpen}>
            <img src={SearchIcon}></img>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="'Seymour One', sans-serif">
          Studios
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <BellIcon height="28px" width="28px" m={1} />
              {notification.length && <Badge color="red">New</Badge>}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length ? (
                "No new message"
              ) : (
                <>
                  {notification.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notification)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat !== undefined
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notification.chat.users
                          )}`}
                    </MenuItem>
                  ))}
                </>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              padding={1}
              as={Button}
              rightIcon={<ChevronDownIcon height="22px" width="22px" />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <UserProfile user={user}>
                <MenuItem>My Profile</MenuItem>
              </UserProfile>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="2px">Search users</DrawerHeader>
          <DrawerBody>
            <Box display="flex">
              <Input
                placeholder="Search user by name or email"
                mr={1}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <Button
                marginLeft={2}
                background="skyblue"
                onClick={searchHandler}
              >
                <img src={SearchIcon} />
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <Box>
                {searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
                {console.log(selectedChat)}
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
