import { Box, Paper } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../tokens";
import { cloneConversations, type Conversation } from "../data";
import ConversationList from "../ConversationList";
import ConversationPane from "../ConversationPane";

/** Visually hidden heading, mirrors the `sr-only` h2 in the design mockup. */
const srOnlySx = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

/** Current local time as `HH:MM` for messages sent from the composer. */
function currentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Conversations page, ported from notes/design/conversations_page.html into MUI
 * components. No "Tomar control" button. Conversation switching and message
 * sending keep local (component) state for now; wiring to the backend comes
 * later.
 */
export default function ConversationsDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>(cloneConversations);
  const [selectedId, setSelectedId] = useState(() => conversations[0].id);

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // Opening the conversation clears its unread dot.
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id && conversation.unread ? { ...conversation, unread: false } : conversation,
      ),
    );
  };

  const handleSendMessage = (text: string) => {
    const conversationId = selected.id;
    const time = currentTime();
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              lastMessage: text,
              lastTime: time,
              messages: [
                ...conversation.messages,
                { id: `manual-${conversation.messages.length + 1}`, text, time, sender: "business" },
              ],
            }
          : conversation,
      ),
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: tokens.color.surface1,
        borderRadius: `${tokens.radius.card}px`,
        border: `0.5px solid ${tokens.color.border}`,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: 480,
      }}
    >
      <Box component="h2" sx={srOnlySx}>
        Conversaciones: lista de chats de clientes y conversación abierta con mensajes
      </Box>

      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <ConversationPane conversation={selected} onSendMessage={handleSendMessage} />
    </Paper>
  );
}