import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'
import { createServer } from 'http';
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const clientUrl = "https://slack-bot-wheat.vercel.app"
const io = new Server(server, { cors: { origin: clientUrl} });
const PORT = process.env.PORT || 3000;

const slack_token = process.env.slack_token
const slack_verification_token = process.env.slack_verification_token

app.use(express.json());
app.use(cors({origin: [clientUrl]}))


app.get('/', (req, res) => {
  console.log("healthy")
  res.send('SlackBot healthy');
});

const isSome = (val) => val !== undefined && val !== null
const sockets = []

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
    res.status(200).send({messageData: data});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
})

io.on('connection', (socket) => {
  console.log('A client connected');

  sockets.append(socket)
  socket.on('clientEvent', (data) => {
    console.log('Received data from client:', data);
  });

  socket.emit('serverEvent', 'Hello from the server!');
});

app.post('/slackEvent', async (req, res) => {
  console.log("in slack event listener")
  if(slack_verification_token !== req.body.token){
    console.log("invalid token")
    res.status(500).send("invalid request")
    return
  }
  console.log("valid event", req.body)
  const reply = getReplyEvent(req.body)
  console.log("reply", reply)
  if(isSome(reply)){
    console.log("emitting reply event", reply)
    // io.emit('slackReplyEvent', "reply")
    // io.sockets.emit('slackReplyEvent', "reply")
    console.log("sockets", sockets)
    if(sockets.length===0){
      console.log("no socket")
      return
    }
    const sock = sockets[0]
    sock.emit('serverEvent', 'Jello server!');
  }
  res.status(200).send({challenge: req.body.challenge})
})

const getReplyEvent = (event) => {
  console.log("event", event, event.event)
  if(!isSome(event) || event.event.type !== "message"){ // non message event
    return null
  }
  const ts = event.event.ts
  const thread_ts = event.event.thread_ts
  console.log("ts", ts)
  console.log("thread_ts", thread_ts)
  if(!isSome(thread_ts) || thread_ts === ts){ // not a reply
    return null
  }
  return {parent: thread_ts, child: ts, replyContent: event.event.text}
}


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
