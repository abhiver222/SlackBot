import React, { useState, useEffect } from 'react';
import { Container} from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Button, TextareaAutosize } from '@mui/base';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import emojione from 'emojione';


const SlackMessageBot = () => {
  const [message, setMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false)
  const [sentMessages, setSentMessages] = useState([])
  const [messageResponses, setMessageResponses] = useState({})

  const emojiRegex = /:[a-zA-Z0-9_]+:/g;


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
    }).then((response) => {  
              
        if (response.ok) {
          console.log('Message sent successfully', response);
          
          toast.success("message sent")
        //   setSentMessages([{response}, ...sentMessages])
          return response.json()
        } else {
          console.error('Failed to send message:', response.status);
          toast.error("message send failed")
          return
        }
      }).then(({messageData}) => {
        console.log("resp data", messageData)
        setSentMessages([messageData, ...sentMessages])
      }).catch((error) => {
        console.error('Error sending message:', error);
      });
      setMessageSending(false)
      setMessage("")
  };

    useEffect(() => {
        const socket = io('https://abhislackbotserver.onrender.com/'); 

        socket.on('connect', () => {
            console.log('Connected to server socket');
        });

        socket.on('serverEvent', (data) => {
            console.log('Received socket data from server:', data);
        });
        socket.on('slackReplyEvent', (data) => {
            console.log("slack reply event", data)
            const {child, parent, replyContent} = data
            const replies = {...messageResponses}
            const replyObj = {message: replyContent, ts: child}
            if(replies[parent]){
                replies[parent].push(replyObj)
            }else{
                replies[parent] = [replyObj]
            }
            setMessageResponses(replies)
        })

        socket.emit('clientEvent', { key: 'value' });
        return () => {
            socket.disconnect();
        };
    }, [messageResponses]);

    const testSocket = () => {
        console.log("socket button")
        const socket = io('https://abhislackbotserver.onrender.com/'); 
        socket.emit('clientEvent', { key: 'button' });
    }

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
                    <Button onClick={testSocket}>test socket</Button>
                
        </CardContent>
      </Card>
      <div>
        {sentMessages.map(message => {
            const replies = messageResponses[message.ts]
            return (
                <Card variant="outlined" sx={{ width: "50%", alignContent:"left", margin:"auto" ,marginTop: "5%", backgroundColor: "#3a3f4a", maxHeight: "300px"}}>
                    <Typography variant='h6' style={{marginTop:"10px", color:"white"}}>
                        {message.message}
                        <br/>
                        {message.ts}
                        <br/>
                        <ul>
                            {replies?.map(reply => <li>{getReplyString(reply.message)} { " " } {reply.ts}</li>)}
                        </ul>
                    </Typography>
                </Card>
            )})}
      </div>
    </Container>
  );
};

const getReplyString = (message) => {
    const emojiRegex = /:[a-zA-Z0-9_]+:/g;
    const emojiMessage = message.replace(emojiRegex, (shortcode) => {
        const unicode = emojione.shortnameToUnicode(shortcode);
        return unicode ? unicode : shortcode;
    });
    console.log(emojiMessage)
    return emojiMessage

}

export default SlackMessageBot;
