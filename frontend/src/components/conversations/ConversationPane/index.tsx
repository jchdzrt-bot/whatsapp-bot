import { Box } from "@mui/material";
import type { Conversation } from "../data";
import ConversationHeader from "../ConversationHeader";
import MessageComposer from "../MessageComposer";
import MessageThread from "../MessageThread";

interface ConversationPaneProps {
  conversation: Conversation;
  onSendMessage: (text: string) => void;
}

/** Right column of the conversations page: header, message thread and composer. */
export default function ConversationPane({ conversation, onSendMessage }: ConversationPaneProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <ConversationHeader conversation={conversation} />
      <MessageThread messages={conversation.messages} />
      <MessageComposer onSend={onSendMessage} />
    </Box>
  );
}