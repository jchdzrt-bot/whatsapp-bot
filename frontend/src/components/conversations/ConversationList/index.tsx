import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../tokens";
import type { Conversation } from "../data";
import ConversationRow from "../ConversationRow";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Left rail: search box + scrollable list of conversations. */
export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered =
    normalizedQuery === ""
      ? conversations
      : conversations.filter(
          (conversation) =>
            conversation.contact.name.toLocaleLowerCase().includes(normalizedQuery) ||
            conversation.lastMessage.toLocaleLowerCase().includes(normalizedQuery),
        );

  return (
    <Box
      component="section"
      aria-label="Conversaciones"
      sx={{
        borderRight: `0.5px solid ${tokens.color.border}`,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box sx={{ p: 1.5, borderBottom: `0.5px solid ${tokens.color.border}` }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar conversación..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>

      <Box component="ul" sx={{ overflowY: "auto", flex: 1, m: 0, p: 0 }}>
        {filtered.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
            selected={conversation.id === selectedId}
            onSelect={() => onSelect(conversation.id)}
          />
        ))}
        {filtered.length === 0 && (
          <Box sx={{ p: 2, fontSize: 12, color: tokens.color.textMuted }}>
            Sin conversaciones que coincidan
          </Box>
        )}
      </Box>
    </Box>
  );
}