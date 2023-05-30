import React, { useState, useEffect } from "react";
import { Container, List, ListItem, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SERVER_URL } from "./utils";
import io from "socket.io-client";
import { MessageCard } from "./MessageCard";
import { ChatInput } from "./ChatInput";

const SlackMessageBot = () => {

  const [sentMessages, setSentMessages] = useState();
  const [messageResponses, setMessageResponses] = useState({});

  const addSentMessage = (messageData) => {
    setSentMessages([...sentMessages, messageData]);
  }
  
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
    <Container
      sx={{
        height: "97vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        mt: 1,
      }}
    >
      <Typography
        variant="h2"
        align="center"
        style={{ color: "white" }}
        gutterBottom
      >
        SlackBot
      </Typography>
      <Box
        sx={{
          width: "80%",
          flexGrow: 1,
          maxHeight: "80%",
          overflowY: "auto",
          backgroundColor: "#3a3f4a",
          px: 2,
          py: 1,
          mt: 2,
          mb: 1,
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <List sx={{mt:1}}>
          {sentMessages?.map((messageObj) => {
            const {message, ts} = messageObj
            const replies = messageResponses[ts];
            return (
              <ListItem key={ts}>
                <MessageCard message={message} replies={replies}/>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <ChatInput addSentMessage={addSentMessage} />
    </Container>
  );
};


  

export default SlackMessageBot;
