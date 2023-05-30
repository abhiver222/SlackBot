export const CLIENT_URL = "https://slack-bot-wheat.vercel.app";
export const SLACK_SEND_API = "https://slack.com/api/chat.postMessage";
export const SLACK_CHANNEL = "#slackbotdemo"

export const isSome = (val) => val !== undefined && val !== null;

export const getReplyEvent = ({ event }) => {
  // non message event
  if (!isSome(event) || event.type !== "message") {
    return null;
  }

  const { ts, thread_ts, text } = event;
  // not a reply
  if (!isSome(thread_ts) || thread_ts === ts) {
    return null;
  }

  return { parent: thread_ts, child: ts, replyContent: text };
};
