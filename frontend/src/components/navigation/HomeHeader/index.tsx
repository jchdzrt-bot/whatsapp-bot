import { Avatar, Box, Typography } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { tokens } from "../../tokens";

/** Initials for the business avatar, e.g. "Barbería Ana" → "BA". */
function initialsOf(name: string): string {
  if (typeof name !== "string") return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
  }
  return name.trim().slice(0, 2);
}

/**
 * App shell header: the business avatar + name pinned to the top-left corner,
 * above the location switcher and the Calendario / Chat navigation bars.
 */
export default function HomeHeader() {
  const business = useAppSelector((state) => state.workspace.business);

  if (!business) return null;

  return (
    <Box
      component="header"
      aria-label="Negocio"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 2,
        py: 1.25,
        bgcolor: tokens.color.surface1,
        borderBottom: `0.5px solid ${tokens.color.borderSoft}`,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: 13,
          fontWeight: 500,
          bgcolor: tokens.color.accent,
          color: "#ffffff",
        }}
      >
        {initialsOf(business.name)}
      </Avatar>
      <Typography sx={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}>
        {business.name}
      </Typography>
    </Box>
  );
}