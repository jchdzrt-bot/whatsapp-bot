import { Box, Typography } from "@mui/material";
import { tokens } from "../../tokens";
import type { Conversation } from "../data";
import ContactAvatar from "../ContactAvatar";

interface ConversationRowProps {
  conversation: Conversation;
  selected: boolean;
  onSelect: () => void;
  /** Larger touch target when the list renders full-screen on a phone. */
  mobile?: boolean;
}

/** One client row in the conversation list: avatar, name, preview, unread dot. */
export default function ConversationRow({
  conversation,
  selected,
  onSelect,
  mobile = false,
}: ConversationRowProps) {
  return (
    <Box
      component="li"
      role="button"
      tabIndex={0}
      aria-current={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      sx={{
        p: mobile ? "13px 14px" : "10px 12px",
        display: "flex",
        gap: 1.25,
        cursor: "pointer",
        listStyle: "none",
        bgcolor: selected ? tokens.color.fillSecondary : "transparent",
        ...(selected ? {} : { "&:hover": { bgcolor: tokens.color.surface2 } }),
      }}
    >
      <ContactAvatar initials={conversation.contact.initials} tint={conversation.tint} />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography
            noWrap
            sx={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conversation.contact.name}
          </Typography>
          <Typography sx={{ fontSize: 10, lineHeight: 1.3, color: tokens.color.textMuted }}>
            {conversation.lastTime}
          </Typography>
        </Box>
        <Typography
          noWrap
          sx={{
            fontSize: 12,
            color: tokens.color.textSecondary,
            lineHeight: 1.3,
            mt: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {conversation.lastMessage}
        </Typography>
      </Box>

      {conversation.unread && (
        <Box
          aria-hidden="true"
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: tokens.color.accentSolid,
            flexShrink: 0,
            mt: 1,
          }}
        />
      )}
    </Box>
  );
}