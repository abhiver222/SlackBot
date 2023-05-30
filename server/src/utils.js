export const CLIENT_URL = "https://slack-bot-wheat.vercel.app";
export const SLACK_SEND_API = "https://slack.com/api/chat.postMessage"

export const isSome = (val) => val !== undefined && val !== null;

export const getReplyEvent = ({event}) => {
    // change variable names
    console.log("eventinfo", event, event.event);
    
    // non message event
    if (!isSome(event) || event.event.type !== "message") {
      return null;
    }
    // const ts = event.ts;
    // const thread_ts = event.thread_ts;
    const {ts, thread_ts} = event
    console.log("ts", ts);
    console.log("thread_ts", thread_ts);
  
    // not a reply
    if (!isSome(thread_ts) || thread_ts === ts) {
      return null;
    }
  
    return { parent: thread_ts, child: ts, replyContent: event.event.text };
  };