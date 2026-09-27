import SmartToy from "@mui/icons-material/SmartToy";
import { Box, Typography } from "@mui/material";
import { tokens } from "../../tokens";
import type { Message } from "../data";

interface MessageBubbleProps {
  message: Message;
}

/** Single chat message: client text on the left, business/bot replies on the right. */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const isClient = message.sender === "client";

  return (
    <Box sx={{ alignSelf: isClient ? "flex-start" : "flex-end", maxWidth: "75%", minWidth: 0 }}>
      <Box
        sx={{
          bgcolor: isClient ? tokens.color.surface3 : tokens.color.accent,
          color: isClient ? tokens.color.text : "#ffffff",
          borderRadius: isClient ? "12px 12px 12px 2px" : "12px 12px 2px 12px",
          p: "8px 12px",
          fontSize: 13,
          lineHeight: 1.4,
        }}
      >
        {message.text}
      </Box>
      <Typography
        sx={{
          fontSize: 10,
          color: tokens.color.textMuted,
          lineHeight: 1.3,
          mt: 0.4,
          ...(isClient ? { ml: 0.5 } : { mr: 0.5, textAlign: "right" }),
        }}
      >
        {message.time}
        {!isClient && message.isBot && (
          <SmartToy aria-hidden="true" sx={{ fontSize: 10, verticalAlign: "-1px", ml: 0.25 }} />
        )}
      </Typography>
    </Box>
  );
}