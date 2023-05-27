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
  res.send('SlackBot healthy');
});


app.get('/sendSlackMessage', async (req, res) => {
  try {
    const url = 'https://slack.com/api/chat.postMessage';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${slack_token}`
      },
      body: JSON.stringify({
        channel: '#general',
        text: 'Hello, World2!'
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
