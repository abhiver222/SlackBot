import React, { useState, useEffect } from "react";
import { Container, List, ListItem, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SERVER_URL, testMessageData, testResponseData } from "./utils";
import io from "socket.io-client";
import { MessageCard } from "./MessageCard";
import { ChatInput } from "./ChatInput";
import styled from "@emotion/styled";

const SlackMessageBot = () => {
  const [sentMessages, setSentMessages] = useState([]);
  const [messageResponses, setMessageResponses] = useState({});

  const addSentMessage = (messageData) => {
    setSentMessages([...sentMessages, messageData]);
  };

  useEffect(() => {
    const socket = io(SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to server socket");
    });

    socket.on("slackReplyEvent", (data) => {
      console.log("slack reply event", data);
      const { child, parent, replyContent } = data;
      const replies = { ...messageResponses };
      const replyObj = { message: replyContent, ts: child };
      if (replies[parent]) {
        replies[parent].push(replyObj);
      } else {
        replies[parent] = [replyObj];
      }
      setMessageResponses(replies);
    });

    return () => {
      socket.disconnect();
    };
  }, [messageResponses]);

  return (
    <SlackBotContainer>
      <Typography
        variant="h2"
        align="center"
        style={{ color: "white" }}
        gutterBottom
      >
        SlackBot
      </Typography>
      <ChatWindow>
        <List sx={{ mt: 1 }}>
          {sentMessages?.map((messageObj) => {
            const { message, ts } = messageObj;
            const replies = messageResponses[ts];
            return (
              <ListItem key={ts}>
                <MessageCard message={message} replies={replies} />
              </ListItem>
            );
          })}
        </List>
      </ChatWindow>
      <ChatInput addSentMessage={addSentMessage} />
    </SlackBotContainer>
  );
};

const SlackBotContainer = styled(Container)`
  height: 97vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 8px;
`;

const ChatWindow = styled(Box)`
  width: 80%;
  flex-grow: 1;
  max-height: 80%;
  overflow-y: auto;
  background-color: #3a3f4a;
  padding: 8px;
  margin-top: 16px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column-reverse;
`;

export default SlackMessageBot;
