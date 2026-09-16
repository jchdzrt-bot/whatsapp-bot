import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import NewAppointment from "../NewAppointment";
import { calendarHint } from "../data";
import ShopHeader from "../ShopHeader";
import StatsCards from "../StatsCards";
import WeekNavigator from "../WeekNavigator";
import WeeklyCalendar from "../WeeklyCalendar";
import { tokens } from "../tokens";

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

/**
 * Appointment dashboard home, ported from
 * notes/design/appointment_dashboard_home.html into MUI components.
 * Pure UI — data is static and wired later to the redux store/backend.
 */
export default function AppointmentDashboard() {
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: tokens.color.surface1,
        borderRadius: `${tokens.radius.card}px`,
        border: `0.5px solid ${tokens.color.borderSoft}`,
        p: 2.5,
      }}
    >
      <Box component="h2" sx={srOnlySx}>
        Panel de citas: calendario semanal con citas y botón para agregar nuevas
      </Box>

      <ShopHeader onNewAppointment={() => setNewAppointmentOpen(true)} />
      <StatsCards />
      <WeekNavigator />
      <WeeklyCalendar />

      <Typography
        sx={{
          fontSize: 12,
          lineHeight: 1.4,
          color: tokens.color.textMuted,
          mt: 1.25,
        }}
      >
        {calendarHint}
      </Typography>

      <NewAppointment
        open={newAppointmentOpen}
        onClose={() => setNewAppointmentOpen(false)}
      />
    </Paper>
  );
}