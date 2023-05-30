import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import Card from "@mui/material/Card";
import { List, ListItem, Box,} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { getReplyString } from './utils';

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
    console.log(props)
    const {message, replies} = props
    return (
        <Card
                variant="outlined"
                sx={{ width: "100%", backgroundColor: "#49505e" }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#0d47a1",
                      px: 2,
                      py: 1,
                      borderRadius: "0px",
                      color: "white",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    <Typography variant="h6">{message}</Typography>
                  </Box>
                  {replies && (
                    <CardContent>
                      <List sx={{ py: 0 }}>
                        {replies?.map((reply) => (
                            <Box key={reply.ts}>
                              <ListItem
                                sx={{
                                  backgroundColor: "#333842",
                                  color: "white",
                                  borderRadius: "12px",
                                  px: 2,
                                  py: 1,
                                  mt: 1,
                                }}
                              >
                                <Typography variant="body1">
                                    <ReactMarkdown children={getReplyString(reply.message)} remarkPlugins={[remarkGfm]}/>
                                </Typography>
                              </ListItem>
                            </Box>
                          )
                        )}
                      </List>
                    </CardContent>
                  )}
                </Card>
    )
}