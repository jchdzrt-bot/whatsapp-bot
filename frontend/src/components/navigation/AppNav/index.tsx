import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Chat from "@mui/icons-material/Chat";
import { Box, Button } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Routes } from "../../../router/routes";
import { tokens } from "../../tokens";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { to: Routes.HOME, label: "Calendario", icon: <CalendarMonth sx={{ fontSize: 15 }} /> },
  { to: `/${Routes.CONVERSATIONS}`, label: "Chat", icon: <Chat sx={{ fontSize: 15 }} /> },
];

/**
 * Sticky top bar shown inside the authenticated Home shell. Segmented buttons
 * switch between the calendar and the conversations sections.
 */
export default function AppNav() {
  const navigate = useNavigate();
  const onCalendar = useMatch(Routes.HOME) !== null;
  const onConversations = useMatch(`/${Routes.CONVERSATIONS}`) !== null;

  const isActive = (to: string) => (to === Routes.HOME ? onCalendar : onConversations);

  return (
    <Box
      component="nav"
      aria-label="Navegación principal"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.25,
        bgcolor: tokens.color.surface1,
        borderBottom: `0.5px solid ${tokens.color.border}`,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.to);
        return (
          <Button
            key={item.to}
            size="small"
            startIcon={item.icon}
            onClick={() => navigate(item.to)}
            sx={{
              boxSizing: "border-box",
              height: 34,
              fontSize: 13,
              px: 1.75,
              borderRadius: "8px",
              textTransform: "none",
              color: active ? tokens.color.accentText : tokens.color.textSecondary,
              bgcolor: active ? tokens.color.accentMutedBg : "transparent",
              "&:hover": {
                color: active ? tokens.color.accentText : tokens.color.text,
                bgcolor: active ? tokens.color.accentMutedBg : tokens.color.surface2,
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Box>
  );
}