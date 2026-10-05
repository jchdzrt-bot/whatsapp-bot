import { Box, Typography } from "@mui/material";
import type { Conversation } from "../data";
import ConversationHeader from "../ConversationHeader";
import MessageComposer from "../MessageComposer";
import MessageThread from "../MessageThread";
import { tokens } from "../../tokens";

interface ConversationPaneProps {
  conversation: Conversation | null;
  onSendMessage: (text: string) => void;
  /** When provided, the header shows a back arrow (phones full-screen thread). */
  onBack?: () => void;
}

/** Right column of the conversations page: header, message thread and composer. */
export default function ConversationPane({
  conversation,
  onSendMessage,
  onBack,
}: ConversationPaneProps) {
  if (!conversation) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
          bgcolor: tokens.color.surface2,
        }}
      >
        <Typography sx={{ fontSize: 13, color: tokens.color.textMuted }}>
          Selecciona una conversación para ver los mensajes
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <ConversationHeader conversation={conversation} onBack={onBack} />
      <MessageThread messages={conversation.messages} />
      <MessageComposer onSend={onSendMessage} />
    </Box>
  );
}