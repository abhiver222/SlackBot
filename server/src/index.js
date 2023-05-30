import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  CLIENT_URL,
  SLACK_SEND_API,
  SLACK_CHANNEL,
  isSome,
  getReplyEvent,
} from "./utils.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_URL } });
const PORT = process.env.PORT || 3000;

const slack_token = process.env.slack_token;
const slack_verification_token = process.env.slack_verification_token;

app.use(express.json());
app.use(cors({ origin: [CLIENT_URL] }));

app.get("/", (req, res) => {
  console.log("healthy");
  res.send("SlackBot healthy");
});

let connectedSocket = null;
io.on("connection", (socket) => {
  console.log("A client connected");
  connectedSocket = socket;
});

/**
 * post handler to send messages to slack send messagee endpoint
 */
app.post("/sendSlackMessage", async (req, res) => {
  console.log("sending slack message");
  try {
    const url = SLACK_SEND_API;
    const message = req.body.message;
    if (message === undefined) {
      res.status(200).send("Empty message");
      return;
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${slack_token}`,
      },
      body: JSON.stringify({
        channel: SLACK_CHANNEL,
        text: message,
      }),
    });

    const data = await response.json();
    const messageData = { ts: data.message.ts, message: data.message.text };
    res.status(200).json({ messageData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});

/**
 * post handler to receive webhook events from Slack events API
 */
app.post("/slackEvent", async (req, res) => {
  console.log("in slack event listener");
  if (slack_verification_token !== req.body.token) {
    console.log("invalid token");
    res.status(500).send("invalid request");
    return;
  }

  const reply = getReplyEvent(req.body);

  if (isSome(reply)) {
    console.log("emitting reply event", reply);
    if (!isSome(connectedSocket)) {
      console.log("no socket");
      return;
    }
    connectedSocket.emit("slackReplyEvent", reply);
  }
  res.status(200).send({ challenge: req.body.challenge });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
