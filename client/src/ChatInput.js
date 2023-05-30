import React, { useState } from "react";
import { Button } from "@mui/base";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { SERVER_URL } from "./utils";

export const ChatInput = (props) => {
    console.log(props)
    const { addSentMessage } = props
    const [message, setMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    const handleMessageChange = (event) => {
      setMessage(event.target.value);
    };
  
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };
  
    // const handleSendMessage = () => {
    //   console.log("handle send");
    //   if (message.length === 0) {
    //     setMessage("");
    //     return;
    //   }
    //   setMessageSending(true);
    //   const apiEndpoint =
    //     `${SERVER_URL}/sendSlackMessage`;
  
    //   fetch(apiEndpoint, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ message }),
    //   })
    //     .then((response) => {
    //       if (response.ok) {
    //         console.log("Message sent successfully", response);
  
    //         toast.success("message sent");
    //         //   setSentMessages([{response}, ...sentMessages])
    //         return response.json();
    //       } else {
    //         console.error("Failed to send message:", response.status);
    //         toast.error("message send failed");
    //         return;
    //       }
    //     })
    //     .then(({ messageData }) => {
    //       console.log("resp data", messageData);
    //       // setSentMessages([...sentMessages, messageData]);
    //       addSentMessage(messageData)
    //     })
    //     .catch((error) => {
    //       console.error("Error sending message:", error);
    //     });
    //   setMessageSending(false);
    //   setMessage("");
    // };

    const handleError = () => {
      console.error("Failed to send message:");
      toast.error("message send failed");
    }

    const handleSendMessage = async () => {
      console.log("handle send");
      if (message.length === 0) {
        setMessage("");
        return;
      }
      setMessageSending(true);
      const apiEndpoint =
        `${SERVER_URL}/sendSlackMessage`;
      
      try{
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        })
        if (response.ok) {
          console.log("Message sent successfully", response);
          toast.success("message sent");
          const { messageData } = await response.json();
          console.log("resp data", messageData);
          setMessage("");
          addSentMessage(messageData)
        } else {
          handleError()
        }
      } catch(e){
        console.error("Unable to call server", e)
        handleError()
      }
      setMessageSending(false);
    };
  

    return (
        <Box sx={{ width: "80%", display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          inputProps={{ style: { color: "white" } }}
          sx={{ backgroundColor: "#49505e", color: "white", mr: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={messageSending}
          color="secondary"
        >
          <SendIcon color="secondary" />
        </Button>
      </Box>
    )
}