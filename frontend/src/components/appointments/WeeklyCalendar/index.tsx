import { Box, Paper, Typography } from "@mui/material";
import type { DayHeader, TimeSlot } from "../data";
import AppointmentChip from "../AppointmentChip";
import { tokens } from "../../tokens";

/** Time gutter width + one column per visible day (same for header and rows). */
const GRID_TEMPLATE = (columns: number) => `56px repeat(${columns}, minmax(0, 1fr))`;

interface WeeklyCalendarProps {
  days: DayHeader[];
  timeSlots: TimeSlot[];
  /** Fired when an appointment chip is clicked so its details modal can open. */
  onAppointmentClick?: (appointmentId: string) => void;
  /** Fired when an empty slot is clicked so the new-appointment modal can open prefilled. */
  onEmptySlotClick?: (dateISO: string, time: string) => void;
}

/** Weekly calendar grid: day header + one row per time slot. */
export default function WeeklyCalendar({
  days,
  timeSlots,
  onAppointmentClick,
  onEmptySlotClick,
}: WeeklyCalendarProps) {
  const emptyMessage =
    days.length === 1 ? "No hay citas para este día" : "No hay citas para esta semana";

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
      <Box sx={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE(days.length) }}>
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
            gridTemplateColumns: GRID_TEMPLATE(days.length),
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
              role={appointment || !onEmptySlotClick ? undefined : "button"}
              onClick={
                appointment || !onEmptySlotClick
                  ? undefined
                  : () => onEmptySlotClick(days[index].dateISO, slot.time)
              }
              sx={{
                borderLeft: `0.5px solid ${tokens.color.border}`,
                minHeight: 44,
                p: 0.4,
                ...(appointment
                  ? {}
                  : onEmptySlotClick
                    ? {
                        cursor: "pointer",
                        "&:hover": { bgcolor: tokens.color.accentMutedBg },
                      }
                    : {}),
              }}
            >
              {appointment && (
                <AppointmentChip
                  tint={appointment.tint}
                  title={`${appointment.clientName} · ${appointment.worker} · ${appointment.service}`}
                  onClick={
                    onAppointmentClick
                      ? () => onAppointmentClick(appointment.id)
                      : undefined
                  }
                >
                  <Box
                    sx={{
                      lineHeight: 1.3,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      {appointment.clientName}
                    </Box>
                    <Box
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        opacity: 0.9,
                      }}
                    >
                      {appointment.worker} · {appointment.service}
                    </Box>
                  </Box>
                </AppointmentChip>
              )}
            </Box>
          ))}
        </Box>
      ))}

      {timeSlots.length === 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            borderTop: `0.5px solid ${tokens.color.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              color: tokens.color.textMuted,
              textAlign: "center",
              py: 3,
            }}
          >
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
