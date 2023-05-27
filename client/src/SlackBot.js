import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';

const SlackMessageBot = () => {
  const [message, setMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false)

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const apiEndpoint = 'https://abhislackbotserver.onrender.com/sendSlackMessage';
    setMessageSending(true)

    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
      .then((response) => {
        
        if (response.ok) {
          console.log('Message sent successfully', {icon:false});
          toast.success("message sent")
        } else {
          console.error('Failed to send message:', response.status);
          toast.error("message send failed", {icon:false})
        }
      })
      .catch((error) => {

        console.error('Error sending message:', error);
      });
      setMessageSending(false)
      setMessage("")
  };

  return (
    <Container style={{ marginTop: '10%' }}>
      <Card variant="outlined" sx={{ width: "80%", alignContent:"center", margin:"auto" ,marginTop: "5%", backgroundColor: "#3a3f4a", maxHeight: "300px"}}>
        <Typography variant='h4' style={{marginTop:"10px", color:"white"}}>
            Send Message
        </Typography>
        <CardContent>
                <TextareaAutosize style={{width:"100%", backgroundColor: "#49505e", color:"white", maxWidth:"100%", maxHeight: "150px", minHeigh:"50px", fontSize: "18px"}} minRows={3} maxRows={5} value={message} onChange={handleMessageChange}/>
                
                    <LoadingButton
                        onClick={handleSendMessage}
                        endIcon={<SendIcon />}
                        loading={messageSending}
                        loadingPosition="end"
                        variant="contained"
                        style={{marginTop:"12px"}}
                        size='large'
                        >
                        <span>Send</span>
                    </LoadingButton>
                
        </CardContent>
      </Card>
    </Container>
  );
};

export default SlackMessageBot;
