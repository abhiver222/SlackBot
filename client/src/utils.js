import emojione from "emojione";

export const isSome = (val) => val !== undefined && val !== null;

export const getReplyString = (message) => {
    if (!isSome(message)) {
      return message;
    }
  
    const emojiRegex = /:[a-zA-Z0-9_]+:/g;
    message = message.replace(emojiRegex, (shortcode) => {
      const unicode = emojione.shortnameToUnicode(shortcode);
      return unicode ? unicode : shortcode;
    });
  
    const linkRegex = /<(.+?)\|(.+?)>/g;
    message = message.replace(linkRegex, '[$2]($1)');
  
    const boldRegex = /\*(.+?)\*/g;
    message = message.replace(boldRegex, '**$1**');
  
    const codeBlockRegex = /```(.+?)```/gs;
    message = message.replace(codeBlockRegex, (_, p1) => {
      const code = p1.replace(/\\n/g, '\n');
      return '```\n' + code + '\n```';
    });
  
    const bulletRegex = /•\s?(.+)/g;
    message = message.replace(bulletRegex, '- -$1');
  
    return message
  };