import { Box, Paper } from "@mui/material";
import AppointmentChip from "../AppointmentChip";
import { days, timeSlots } from "../data";
import { tokens } from "../tokens";

/** Time gutter width + 7 weekday columns (same for header and rows). */
const GRID_TEMPLATE = "56px repeat(7, minmax(0, 1fr))";

/** Weekly calendar grid: day header + one row per time slot. */
export default function WeeklyCalendar() {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: tokens.color.surface2,
        borderRadius: `${tokens.radius.inner}px`,
        border: `0.5px solid ${tokens.color.border}`,
        overflow: "hidden",
      }}
    >
      {/* Day headers: Lun → Dom, today highlighted */}
      <Box sx={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE }}>
        <Box />
        {days.map((day) => (
          <Box
            key={day.label}
            sx={{
              textAlign: "center",
              px: 0.5,
              py: 1,
              borderLeft: `0.5px solid ${tokens.color.border}`,
              color: day.isToday ? tokens.color.accentText : tokens.color.textSecondary,
              bgcolor: day.isToday ? tokens.color.accentMutedBg : "transparent",
            }}
          >
            <Box sx={{ fontSize: 12, fontWeight: day.isToday ? 500 : 400 }}>{day.label}</Box>
            <Box sx={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{day.date}</Box>
          </Box>
        ))}
      </Box>

      {/* Time slot rows */}
      {timeSlots.map((slot) => (
        <Box
          key={slot.time}
          sx={{
            display: "grid",
            gridTemplateColumns: GRID_TEMPLATE,
            borderTop: `0.5px solid ${tokens.color.border}`,
          }}
        >
          <Box
            sx={{
              fontSize: 11,
              lineHeight: 1.3,
              color: tokens.color.textMuted,
              pt: 0.75,
              pr: 0.75,
              textAlign: "right",
            }}
          >
            {slot.time}
          </Box>
          {slot.cells.map((appointment, index) => (
            <Box
              key={`${slot.time}-${index}`}
              sx={{
                borderLeft: `0.5px solid ${tokens.color.border}`,
                minHeight: 44,
                p: 0.4,
                ...(appointment
                  ? {}
                  : {
                      "&:hover": { bgcolor: tokens.color.accentMutedBg },
                    }),
              }}
            >
              {appointment && (
                <AppointmentChip
                  tint={appointment.tint}
                  title={`${appointment.worker} · ${appointment.service}`}
                >
                  {appointment.worker} · {appointment.service}
                </AppointmentChip>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Paper>
  );
}