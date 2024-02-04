import { CloseIcon, StarIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ admin, user, handleFunction }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      margin={1}
      marginBottom={2}
      variant="solid"
      cursor="pointer"
      fontSize="12px"
      colorScheme={admin === user._id ? "blue" : "purple"}
    >
      {user.name}

      {admin === user._id ? (
        <StarIcon
          alignItems="center"
          justifyContent="center"
          marginLeft={2}
          marginBottom={1}
        />
      ) : (
        <CloseIcon
          marginLeft={2}
          marginBottom={1}
          padding="1px"
          onClick={handleFunction}
        />
      )}
    </Badge>
  );
};

export default UserBadgeItem;
