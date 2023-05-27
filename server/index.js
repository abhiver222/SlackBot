import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'

const app = express();
const PORT = process.env.PORT || 5000;

const slack_token = "xoxb-5339714760289-5351142889520-EuRZhPD7ORmnrYStqWYaDpZ3"

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS


app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.get('/sendSlackMessage', async (req, res) => {
  try {
    const url = 'https://slack.com/api/chat.postMessage';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
    console.log(err);
    res.status(500).send('Error sending message');
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
