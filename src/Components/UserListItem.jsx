import { Avatar, Box, Divider, Text, Card, CardBody } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div>
      <Card
        marginY="4px"
        _hover={{
          background: "#A2D2FF",
          color: "white",
        }}
      >
        <CardBody>
          <Box onClick={handleFunction} display="flex" alignItems="center">
            <Avatar
              name={user.name}
              src={user.pic}
              padding="2px"
              margin="2px"
            />
            <Box>
              <Text fontSize="16px" fontWeight="bold">
                {user.name}
              </Text>
              <Text fontSize="14px">{user.email}</Text>
            </Box>
          </Box>
        </CardBody>

        <Divider />
      </Card>
    </div>
  );
};

export default UserListItem;
