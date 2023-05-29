import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, Box, Grid,TextField} from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Button, TextareaAutosize } from '@mui/base';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import emojione from 'emojione';

const isSome = (val) => val !== undefined && val !== null

const SlackMessageBot = () => {
  const [message, setMessage] = useState('');
  const [messageSending, setMessageSending] = useState(false)
  const [sentMessages, setSentMessages] = useState([{message:"test message", ts:"1"}, {message:"test message2", ts:"2"}, {message:"test message3", ts:"3"}, {message:"test message4", ts:"4"}, {message:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam", ts:"5"}])
  const [messageResponses, setMessageResponses] = useState({"1": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}], 
  "2": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
  "3": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
  "4": [{message:"reply123",ts:"456"}, {message:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam",ts:"46"}, {message:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat nam",ts:"56"}]})
  
//   {"1": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}], 
//                             "2": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
//                             "3": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}],
//                             "4": [{message:"reply123",ts:"456"}, {message:"reply456",ts:"46"}, {message:"reply789",ts:"56"}]}



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
        setSentMessages([...sentMessages, messageData])
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

    return (
        <Container sx={{height: '97vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', py: 1, mt:1}}>
      <Typography variant="h2" align="center" style={{color: "white"}} gutterBottom>
        SlackBot
      </Typography>
      <Box sx={{ width: '80%', flexGrow: 1, maxHeight: '80%', overflowY: 'auto', backgroundColor: "#3a3f4a", px: 2, py: 1, mt: 2,mb: 1, display: 'flex', flexDirection: 'column-reverse'}}>
        <List>
          {sentMessages.map((message, index) => {
            const replies = messageResponses[message.ts];
            return (
              <ListItem key={index}>
                <Card variant="outlined" sx={{ width: '100%', backgroundColor: "#49505e" }}>
                  <Box sx={{ backgroundColor: "#0d47a1", px: 2, py: 1, borderRadius: '0px', color: 'white', maxHeight: "100px", overflow:"auto" }}>
                    <Typography variant="h6">
                      {message.message}
                    </Typography>
                  </Box>
                  {replies && 
                    <CardContent>
                      <List sx={{py:0}}>
                        {replies?.map((reply, replyIndex) => 
                          <ListItem key={replyIndex} sx={{ backgroundColor: "#333842", color:"white", borderRadius: '12px', px: 2, py: 1, mt: 1}}>
                            <Typography style={{ maxHeight: "80px", overflow: "auto"}} variant='body1'>{getReplyString(reply.message)}</Typography>
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  }
                </Card>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ width: '80%', display: 'flex', alignItems: 'center' }}>
        <TextField fullWidth multiline rows={2} variant="outlined" value={message} onChange={handleMessageChange} placeholder="What's on your mind?" inputProps={{ style: {color: "white"}}} sx={{ backgroundColor: "#49505e", color:"white", mr: 2}}/>
        <Button variant="contained" onClick={handleSendMessage} disabled={messageSending}>
          <SendIcon />
        </Button>
      </Box>
    </Container>
  );
};

const getReplyString = (message) => {
    if(!isSome(message)){
        return message
    }
    const emojiRegex = /:[a-zA-Z0-9_]+:/g;
    const emojiMessage = message.replace(emojiRegex, (shortcode) => {
        const unicode = emojione.shortnameToUnicode(shortcode);
        return unicode ? unicode : shortcode;
    });
    console.log(emojiMessage)
    return emojiMessage

}

export default SlackMessageBot;
