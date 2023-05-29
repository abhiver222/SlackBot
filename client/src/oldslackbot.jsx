import React, { useState, useEffect } from "react";
import { Container, List, ListItem, Box, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { Button, TextareaAutosize } from "@mui/base";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import io from "socket.io-client";
import emojione from "emojione";

const isSome = (val) => val !== undefined && val !== null;

const SlackMessageBot = () => {
  const [message, setMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);
  const [sentMessages, setSentMessages] = useState([
    { message: "test message", ts: "123" },
    { message: "test message2", ts: "456" },
  ]);
  const [messageResponses, setMessageResponses] = useState({
    123: [
      { message: "reply123", ts: "456" },
      { message: "reply456", ts: "46" },
      { message: "reply789", ts: "56" },
    ],
    456: [
      { message: "reply123", ts: "456" },
      { message: "reply456", ts: "46" },
      { message: "reply789", ts: "56" },
    ],
  });

  console.log("sentmsg", sentMessages);
  console.log("responses", messageResponses);
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const apiEndpoint =
      "https://abhislackbotserver.onrender.com/sendSlackMessage";
    setMessageSending(true);

    fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Message sent successfully", response);

          toast.success("message sent");
          //   setSentMessages([{response}, ...sentMessages])
          return response.json();
        } else {
          console.error("Failed to send message:", response.status);
          toast.error("message send failed");
          return;
        }
      })
      .then(({ messageData }) => {
        console.log("resp data", messageData);
        setSentMessages([messageData, ...sentMessages]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
    setMessageSending(false);
    setMessage("");
  };

  useEffect(() => {
    const socket = io("https://abhislackbotserver.onrender.com/");

    socket.on("connect", () => {
      console.log("Connected to server socket");
    });

    socket.on("serverEvent", (data) => {
      console.log("Received socket data from server:", data);
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

    socket.emit("clientEvent", { key: "value" });
    return () => {
      socket.disconnect();
    };
  }, [messageResponses]);

  return (
    <Container style={{ marginTop: "10%" }}>
      <Card
        variant="outlined"
        sx={{
          width: "80%",
          alignContent: "center",
          margin: "auto",
          marginTop: "5%",
          backgroundColor: "#3a3f4a",
          maxHeight: "300px",
        }}
      >
        <Typography variant="h4" style={{ marginTop: "10px", color: "white" }}>
          Send Message
        </Typography>
        <CardContent>
          <TextareaAutosize
            style={{
              width: "100%",
              backgroundColor: "#49505e",
              color: "white",
              maxWidth: "100%",
              maxHeight: "150px",
              minHeigh: "50px",
              fontSize: "18px",
            }}
            minRows={3}
            maxRows={5}
            value={message}
            onChange={handleMessageChange}
          />

          <LoadingButton
            onClick={handleSendMessage}
            endIcon={<SendIcon />}
            loading={messageSending}
            loadingPosition="end"
            variant="contained"
            style={{ marginTop: "12px" }}
            size="large"
          >
            <span>Send</span>
          </LoadingButton>
        </CardContent>
      </Card>
      <Grid
        container
        justifyContent="center"
        direction="column"
        sx={{ marginTop: "5%" }}
      >
        {sentMessages.map((message) => {
          const replies = messageResponses[message.ts];
          return (
            <Grid item xs={12} sx={{ mb: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  minHeight: "200px",
                  width: "50%",
                  margin: "auto",
                  backgroundColor: "#3a3f4a",
                  px: 2,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#49505e",
                    px: 2,
                    py: 1,
                    borderRadius: "12px",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", textAlign: "left" }}
                  >
                    {message.message}
                  </Typography>
                </Box>
                <List>
                  {replies?.map((reply) => (
                    <ListItem
                      sx={{
                        backgroundColor: "#333842",
                        color: "white",
                        borderRadius: "12px",
                        px: 2,
                        py: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {getReplyString(reply.message)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

const getReplyString = (message) => {
  if (!isSome(message)) {
    return message;
  }
  const emojiRegex = /:[a-zA-Z0-9_]+:/g;
  const emojiMessage = message.replace(emojiRegex, (shortcode) => {
    const unicode = emojione.shortnameToUnicode(shortcode);
    return unicode ? unicode : shortcode;
  });
  console.log(emojiMessage);
  return emojiMessage;
};

export default SlackMessageBot;
