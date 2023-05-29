import React, { useState, useEffect } from "react";
import { Container, List, ListItem, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import io from "socket.io-client";
import { MessageCard } from "./MessageCard";
import { ChatInput } from "./ChatInput";

const SlackMessageBot = () => {

  const [sentMessages, setSentMessages] = useState([
    { message: "test message", ts: "1" },
    { message: "test message2", ts: "2" },
    { message: "test message3", ts: "3" },
    { message: "test message4", ts: "4" },
    {
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam",
      ts: "5",
    },
  ]);

  const addSentMessage = (messageData) => {
    setSentMessages([...sentMessages, messageData]);
  }

  const [messageResponses, setMessageResponses] = useState({
    1: [
      { message: "reply123", ts: "456" },
      { message: "reply456", ts: "46" },
      { message: "reply789", ts: "56" },
    ],
    2: [
      { message: "reply123", ts: "456" },
      { message: "reply456", ts: "46" },
      { message: "reply789", ts: "56" },
    ],
    3: [
      { message: "reply123", ts: "456" },
      { message: "reply456", ts: "46" },
      { message: "reply789", ts: "56" },
    ],
    1685335786.825419: [
      { message: "reply123", ts: "456" },
      {
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam",
        ts: "46",
      },
      {
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat nam",
        ts: "56",
      },
    ],
  });

  //   {"1": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
  //                             "2": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
  //                             "3": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
  //                             "4": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}]}

  
  useEffect(() => {
    const socket = io("https://abhislackbotserver.onrender.com/");

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
          {sentMessages.map((messageObj) => {
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
