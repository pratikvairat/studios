import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import React, { useEffect } from "react";
import Login from "../Components/Login";
import SignUp from "../Components/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent marginBottom={16}>
      <Box
        d="flex"
        w="100%"
        justifyContent="center"
        p={3}
        background="white"
        borderRadius="lg"
        m="40px 0 15px 0"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="'Seymour One', sans-serif"
          textAlign="center"
        >
          Studios
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        colorSchema="green"
      >
        <Tabs isFitted variant="enclosed" colorSchema="green">
          <TabList mb="1em">
            <Tab _selected={{ color: "white", bg: "green.500" }}>Login</Tab>
            <Tab _selected={{ color: "white", bg: "green.500" }}>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
