import ArrowBack from "@mui/icons-material/ArrowBack";
import SmartToy from "@mui/icons-material/SmartToy";
import { Box, IconButton, Typography } from "@mui/material";
import { tokens } from "../../tokens";
import type { Conversation } from "../data";
import ContactAvatar from "../ContactAvatar";

interface ConversationHeaderProps {
  conversation: Conversation;
  /** When provided, renders a back arrow that returns to the list (phones). */
  onBack?: () => void;
}

/**
 * Contact details + bot status pill for the open conversation.
 * (No "Tomar control" button per the implementation notes.)
 */
export default function ConversationHeader({ conversation, onBack }: ConversationHeaderProps) {
  return (
    <Box
      sx={{
        p: "12px 16px",
        borderBottom: `0.5px solid ${tokens.color.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
        {onBack && (
          <IconButton
            aria-label="Volver a la lista de conversaciones"
            size="small"
            onClick={onBack}
            sx={{
              boxSizing: "border-box",
              width: 32,
              height: 32,
              color: tokens.color.textSecondary,
            }}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <ContactAvatar initials={conversation.contact.initials} tint={conversation.tint} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {conversation.contact.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: tokens.color.textMuted, lineHeight: 1.3 }}>
            {conversation.contact.phone}
          </Typography>
        </Box>
      </Box>

      {conversation.botActive && (
        <Box
          component="span"
          sx={{
            px: "3px 8px",
            borderRadius: 100,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: tokens.color.tintMintBg,
            color: tokens.color.tintMintText,
          }}
        >
          <SmartToy sx={{ fontSize: 11 }} aria-hidden="true" />
          <Box component="span" sx={{ fontSize: 11 }}>
            Bot activo
          </Box>
        </Box>
      )}
    </Box>
  );
}