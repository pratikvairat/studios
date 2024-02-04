import { Avatar, Box, Tooltip, Text } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogics";
import { ChatState } from "../context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <Box display="flex" key={message._id}>
            {(isSameSender(messages, message, index, user._id) ||
              isLastMessage(messages, index, user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="8px"
                  mr={1}
                  size="sm"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#80A1D4" : "#75C9C8"
                }`,
                borderRadius: "16px",
                padding: "6px 14px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user._id
                ),
                marginTop: isSameUser(messages, message, index, user._id)
                  ? 3
                  : 10,
              }}
            >
              {message.content}
            </span>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
