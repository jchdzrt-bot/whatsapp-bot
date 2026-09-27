import { Box } from "@mui/material";
import { tokens } from "../../tokens";
import type { ConversationTint } from "../data";

const TINT_STYLES: Record<ConversationTint, { bgcolor: string; color: string }> = {
  violet: { bgcolor: tokens.color.tintVioletBg, color: tokens.color.tintVioletText },
  aqua: { bgcolor: tokens.color.tintAquaBg, color: tokens.color.tintAquaText },
  coral: { bgcolor: tokens.color.tintCoralBg, color: tokens.color.tintCoralText },
  muted: { bgcolor: tokens.color.fillSecondary, color: tokens.color.textSecondary },
};

interface ContactAvatarProps {
  initials: string;
  tint: ConversationTint;
  /** Diameter in px; defaults to 34 to match the mockup rows. */
  size?: number;
}

/** Round tinted avatar with a contact's initials. */
export default function ContactAvatar({ initials, tint, size = 34 }: ContactAvatarProps) {
  const style = TINT_STYLES[tint];

  return (
    <Box
      component="div"
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: style.bgcolor,
        color: style.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size >= 38 ? 14 : 12,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
}