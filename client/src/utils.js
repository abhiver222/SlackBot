import emojione from "emojione";

export const SERVER_URL = "https://abhislackbotserver.onrender.com";

export const isSome = (val) => val !== undefined && val !== null;

/**
 * preprocess function before rendering the reply string
 */
export const getReplyString = (message) => {
  if (!isSome(message)) {
    return message;
  }

  // add any emojis
  const emojiRegex = /:[a-zA-Z0-9_]+:/g;
  message = message.replace(emojiRegex, (shortcode) => {
    const unicode = emojione.shortnameToUnicode(shortcode);
    return unicode ? unicode : shortcode;
  });

  // reformat links to markdown
  const linkRegex = /<(.+?)\|(.+?)>/g;
  message = message.replace(linkRegex, "[$2]($1)");

  // reformat bolds to markdown
  const boldRegex = /\*(.+?)\*/g;
  message = message.replace(boldRegex, "**$1**");

  // reformat multiline code to markdown
  const codeBlockRegex = /```(.+?)```/gs;
  message = message.replace(codeBlockRegex, (_, p1) => {
    const code = p1.replace(/\\n/g, "\n");
    return "```\n" + code + "\n```";
  });

  // reformat unordered lists to markdown
  const bulletRegex = /•\s?(.+)/g;
  message = message.replace(bulletRegex, "- -$1");

  return message;
};

export const testMessageData = [
  { message: "test message", ts: "1" },
  { message: "test message2", ts: "2" },
  { message: "test message3", ts: "3" },
  { message: "test message4", ts: "4" },
  {
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam",
    ts: "5",
  },
];

export const testResponseData = {
  1: [
    { message: "reply123", ts: "456" },
    { message: "reply456", ts: "46" },
    { message: "reply789", ts: "56" },
  ],
  2: [
    { message: "reply123", ts: "456" },
    { message: "reply456", ts: "46" },
    { message: "reply789", ts: "56" },
  ],
  3: [
    { message: "reply123", ts: "456" },
    { message: "reply456", ts: "46" },
    {
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. VelitLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. VelitLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit",
      ts: "56",
    },
  ],
  4: [
    { message: "reply123", ts: "456" },
    {
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat nam",
      ts: "46",
    },
    {
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque varius morbi enim nunc faucibus. Nunc sed velit dignissim sodales. Faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Velit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat namVelit scelerisque in dictum non consectetur a erat nam",
      ts: "56",
    },
  ],
};
