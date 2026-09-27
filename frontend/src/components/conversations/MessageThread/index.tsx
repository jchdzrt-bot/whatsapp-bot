import { Box } from "@mui/material";
import { tokens } from "../../tokens";
import type { Message } from "../data";
import MessageBubble from "../MessageBubble";

interface MessageThreadProps {
  messages: Message[];
}

/** Scrollable conversation body (light surface) holding the message bubbles. */
export default function MessageThread({ messages }: MessageThreadProps) {
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        overflowY: "auto",
        bgcolor: tokens.color.surface2,
        minWidth: 0,
      }}
    >
      {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
    </Box>
  );
}