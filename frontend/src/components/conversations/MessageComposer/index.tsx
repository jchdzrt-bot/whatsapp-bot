import Send from "@mui/icons-material/Send";
import { Box, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../tokens";

interface MessageComposerProps {
  onSend: (text: string) => void;
}

/** Composer at the bottom of the open conversation: input + send button. */
export default function MessageComposer({ onSend }: MessageComposerProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed === "") return;
    onSend(trimmed);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleSend();
      }}
      sx={{
        p: "12px 16px",
        borderTop: `0.5px solid ${tokens.color.border}`,
        display: "flex",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Escribe un mensaje... (esto tomará control de la conversación)"
        value={text}
        onChange={(event) => setText(event.target.value)}
        sx={{ flex: 1 }}
      />
      <IconButton
        type="submit"
        aria-label="Enviar"
        size="small"
        sx={{
          boxSizing: "border-box",
          width: 36,
          height: 36,
          bgcolor: tokens.color.fillSecondary,
          border: `0.5px solid ${tokens.color.borderStrong}`,
          "&:hover": { bgcolor: tokens.color.fillSecondaryHover },
        }}
      >
        <Send sx={{ fontSize: 15 }} />
      </IconButton>
    </Box>
  );
}