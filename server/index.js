import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'

const app = express();
const PORT = process.env.PORT || 3000;

const slack_token = process.env.slack_token

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS


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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
