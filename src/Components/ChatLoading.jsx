import { Box, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Box padding="6" boxShadow="lg" bg="white" display="flex">
        <SkeletonCircle size="12" margin="10px" />
        <Skeleton width="100%" gap="10px" mr="30px" pr="15px"></Skeleton>
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" display="flex">
        <SkeletonCircle size="12" margin="10px" />
        <Skeleton width="100%" gap="10px" mr="30px" pr="15px"></Skeleton>
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" display="flex">
        <SkeletonCircle size="12" margin="10px" />
        <Skeleton width="100%" gap="10px" mr="30px" pr="15px"></Skeleton>
      </Box>
      <Box padding="6" boxShadow="lg" bg="white" display="flex">
        <SkeletonCircle size="12" margin="10px" />
        <Skeleton width="100%" gap="10px" mr="30px" pr="15px"></Skeleton>
      </Box>
    </Stack>
  );
};

export default ChatLoading;
