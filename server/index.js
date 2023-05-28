import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "https://slack-bot-wheat.vercel.app" } });
const PORT = process.env.PORT || 3000;

const slack_token = process.env.slack_token

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  console.log("healthy")
  res.send('SlackBot healthy');
});


app.post('/sendSlackMessage', async (req, res) => {
  console.log("sending slack message")
  try {
    const url = 'https://slack.com/api/chat.postMessage';
    const message = req.body.message
    console.log(message)
    if(message === undefined){
      res.status(200).send('Empty message')
      return
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${slack_token}`
      },
      body: JSON.stringify({
        channel: '#general',
        text: message
      })
    });

    const data = await response.json();
    console.log('Done', data);
    res.send('Message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
})

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('clientEvent', (data) => {
    console.log('Received data from client:', data);
  });

  socket.emit('serverEvent', 'Hello from the server!');
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
