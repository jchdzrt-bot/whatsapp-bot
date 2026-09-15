import { Box } from "@mui/material";
import type { ReactNode } from "react";
import type { AppointmentTint } from "../data";
import { tokens } from "../tokens";

const TINT_STYLES: Record<AppointmentTint, { bgcolor: string; color: string }> = {
  violet: { bgcolor: tokens.color.tintVioletBg, color: tokens.color.tintVioletText },
  aqua: { bgcolor: tokens.color.tintAquaBg, color: tokens.color.tintAquaText },
};

interface AppointmentChipProps {
  tint: AppointmentTint;
  children: ReactNode;
  /** Optional native tooltip, e.g. "Ana · Corte". */
  title?: string;
}

/** Small tinted appointment pill, e.g. "Ana · Corte". */
export default function AppointmentChip({ tint, children, title }: AppointmentChipProps) {
  const style = TINT_STYLES[tint];

  return (
    <Box
      component="div"
      title={title}
      sx={{
        width: "fit-content",
        maxWidth: "100%",
        bgcolor: style.bgcolor,
        color: style.color,
        fontSize: 11,
        lineHeight: 1.4,
        fontWeight: 500,
        px: 0.75,
        py: 0.35,
        borderRadius: `${tokens.radius.chip}px`,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer",
        "&:hover": { filter: "brightness(0.96)" },
      }}
    >
      {children}
    </Box>
  );
}