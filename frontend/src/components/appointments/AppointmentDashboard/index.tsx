import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { calendarHint } from "../data";
import type { AppointmentInfo, DayHeader, TimeSlot } from "../data";
import AppointmentsToolbar from "../AppointmentsToolbar";
import NewAppointment from "../NewAppointment";
import StatsCards from "../StatsCards";
import WeekNavigator from "../WeekNavigator";
import WeeklyCalendar from "../WeeklyCalendar";
import { createAppointment, getAppointments } from "../../../api/appointments";
import { getWorkers } from "../../../api/business";
import type {
  Appointment,
  CreateAppointmentPayload,
  Worker,
} from "../../../api/types";
import { useAppSelector } from "../../../store/hooks";
import { tokens } from "../../tokens";
import {
  formatWeekRangeLabel,
  dayLabel,
  toISODateString,
  weekDates,
} from "../dateUtils";

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

/** Deterministic chip tint per worker so a worker always has the same color. */
function tintForWorker(workerId: string): AppointmentInfo["tint"] {
  let hash = 0;
  for (const char of workerId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 2 === 0 ? "violet" : "aqua";
}

/**
 * Appointment dashboard. The displayed week, stats and calendar rows are all
 * computed from real backend data (business/locations/workers/appointments).
 */
export default function AppointmentDashboard() {
  const business = useAppSelector((state) => state.workspace.business);
  const selectedLocationId = useAppSelector(
    (state) => state.workspace.selectedLocationId,
  );
  const workspaceError = useAppSelector((state) => state.workspace.error);

  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [weekAnchor, setWeekAnchor] = useState(() => new Date());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workers and appointments whenever the selected location changes.
  // Business + locations are loaded once by the Home shell (workspace store).
  useEffect(() => {
    if (!selectedLocationId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getWorkers(selectedLocationId),
      getAppointments(selectedLocationId),
    ])
      .then(([workerData, appointmentData]) => {
        if (cancelled) return;
        // Same guard as locations: only arrays must reach the calendar math.
        setWorkers(Array.isArray(workerData) ? workerData : []);
        setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar las citas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocationId]);

  const week = useMemo(() => weekDates(weekAnchor), [weekAnchor]);

  const weekISO = useMemo(
    () => new Set(week.map((date) => toISODateString(date))),
    [week],
  );

  const todayISO = useMemo(() => toISODateString(new Date()), []);

  const days = useMemo<DayHeader[]>(
    () =>
      week.map((date) => ({
        label: dayLabel(date),
        date: date.getDate(),
        isToday: toISODateString(date) === todayISO,
      })),
    [week, todayISO],
  );

  const weekRangeLabel = useMemo(() => formatWeekRangeLabel(week), [week]);

  const stats = useMemo(() => {
    const active = appointments.filter((appointment) => appointment.status !== "cancelled");
    return [
      { label: "Citas hoy", value: active.filter((a) => a.date === todayISO).length },
      { label: "Esta semana", value: active.filter((a) => weekISO.has(a.date)).length },
      {
        label: "Por confirmar",
        value: active.filter((a) => a.status === "needs_rescheduling").length,
      },
    ];
  }, [appointments, todayISO, weekISO]);

  const timeSlots = useMemo<TimeSlot[]>(() => {
    const byDayAndTime = new Map<string, Appointment>();
    for (const appointment of appointments) {
      if (appointment.status === "cancelled" || !weekISO.has(appointment.date)) continue;
      const key = `${appointment.date}__${appointment.time}`;
      // One chip per (day, time) slot; booking conflicts are rejected backend-side.
      if (!byDayAndTime.has(key)) byDayAndTime.set(key, appointment);
    }

    const times = Array.from(
      new Set(
        appointments
          .filter(
            (appointment) =>
              appointment.status !== "cancelled" && weekISO.has(appointment.date),
          )
          .map((appointment) => appointment.time),
      ),
    ).sort((a, b) => a.localeCompare(b, "es-MX", { numeric: true }));

    return times.map((time) => ({
      time,
      cells: week.map((date) => {
        const appointment = byDayAndTime.get(`${toISODateString(date)}__${time}`);
        if (!appointment) return null;

        const worker = workers.find((candidate) => candidate.id === appointment.workerId);
        return {
          clientName:
            appointment.clientName?.trim() ||
            appointment.clientPhoneNumber ||
            "Cliente",
          worker: worker
            ? `${worker.firstName} ${worker.lastName}`.trim()
            : "Trabajador",
          service: appointment.service,
          tint: tintForWorker(appointment.workerId),
        };
      }),
    }));
  }, [appointments, week, weekISO, workers]);

  const showPreviousWeek = () => {
    const previous = new Date(weekAnchor);
    previous.setDate(previous.getDate() - 7);
    setWeekAnchor(previous);
  };

  const showNextWeek = () => {
    const next = new Date(weekAnchor);
    next.setDate(next.getDate() + 7);
    setWeekAnchor(next);
  };

  const handleSaveAppointment = async (payload: CreateAppointmentPayload) => {
    const created = await createAppointment(payload);
    // Refresh the calendar with the new appointment.
    setAppointments((current) => [...current, created]);
  };

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

      {workspaceError ? (
        <Typography
          sx={{
            fontSize: 12,
            color: tokens.color.dangerText,
            mt: 2,
            textAlign: "center",
          }}
        >
          {workspaceError}
        </Typography>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          <AppointmentsToolbar
            onNewAppointment={() => setNewAppointmentOpen(true)}
          />

          {error && (
            <Typography sx={{ fontSize: 12, color: tokens.color.dangerText, mb: 1.5 }}>
              {error}
            </Typography>
          )}

          <StatsCards stats={stats} />
          <WeekNavigator
            rangeLabel={weekRangeLabel}
            onPrevious={showPreviousWeek}
            onNext={showNextWeek}
          />
          <WeeklyCalendar days={days} timeSlots={timeSlots} />

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

          {business && selectedLocationId && (
            <NewAppointment
              open={newAppointmentOpen}
              onClose={() => setNewAppointmentOpen(false)}
              business={business}
              locationId={selectedLocationId}
              workers={workers.map((worker) => ({
                value: worker.id,
                label: `${worker.firstName} ${worker.lastName}`.trim(),
              }))}
              services={Object.keys(business.service ?? {})}
              defaultDate={todayISO}
              onSave={handleSaveAppointment}
            />
          )}
        </>
      )}
    </Paper>
  );
}
