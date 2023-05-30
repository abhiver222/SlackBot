import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Card from "@mui/material/Card";
import { List, ListItem, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { getReplyString } from "./utils";
import  styled  from '@emotion/styled';


/**
 * interface Reply {
 *   message: string
 *   ts: string
 * }
 *
 * interface MessageCardProps {
 *   message: string
 *   replies?: Reply[]
 * }
 */

export const MessageCard = (props) => {
  console.log(props);
  const { message, replies } = props;
  return (
    <MessageReplyCard variant="outlined">
      <MessageBubble>
        <Typography variant="h6">{message}</Typography>
      </MessageBubble>
      {replies && (
        <CardContent>
          <List sx={{ py: 0 }}>
            {replies?.map((reply) => (
              <Box key={reply.ts}>
                <ReplyBubble>
                  <Typography
                    variant="body1"
                    style={{ overflow: "auto", maxHeight: "60px" }}
                  >
                    <ReactMarkdown
                      children={getReplyString(reply.message)}
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, ...props }) => (
                          <p {...props} style={{ margin: "0" }} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} style={{ marginRight: "0" }} />
                        ),
                      }}
                    />
                  </Typography>
                </ReplyBubble>
              </Box>
            ))}
          </List>
        </CardContent>
      )}
    </MessageReplyCard>
  );
};

const MessageReplyCard = styled(Card)`
width: 100%; 
background-color: #49505e;
`

const MessageBubble = styled(Box)`
  background-color: #0d47a1;
  padding: 8px;
  border-radius: 0;
  color: white;
  max-height: 100px;
  overflow: auto;
`;

const ReplyBubble = styled(ListItem)`
  background-color: #333842;
  color: white;
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
`;