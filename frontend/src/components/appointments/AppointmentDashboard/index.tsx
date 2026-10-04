import { Box, CircularProgress, Paper, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { calendarHint } from "../data";
import type { AppointmentInfo, DayHeader, TimeSlot } from "../data";
import AppointmentDetails from "../AppointmentDetails";
import AppointmentsToolbar from "../AppointmentsToolbar";
import NewAppointment from "../NewAppointment";
import StatsCards from "../StatsCards";
import WeekNavigator from "../WeekNavigator";
import WeeklyCalendar from "../WeeklyCalendar";
import { cancelAppointment, createAppointment, getAppointments } from "../../../api/appointments";
import { getWorkers } from "../../../api/business";
import type {
  Appointment,
  CreateAppointmentPayload,
  Worker,
} from "../../../api/types";
import { useAppSelector } from "../../../store/hooks";
import { breakpoints, tokens } from "../../tokens";
import {
  formatDayLabel,
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
 * Day-of-week keys in the same order as Date#getDay() (0 = Sunday), matching
 * the location `openHours` / worker `workingHours` WeeklyHours shape.
 */
const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Minutes since midnight for an "HH:mm" time (-1 when the string is malformed). */
function timeToMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return -1;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** HH:mm for a minutes-since-midnight value, e.g. 570 → "09:30". */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Every HH:mm start time between `start` (inclusive) and `end` (exclusive),
 * stepping by `stepMinutes`. Used to render all 30-min calendar rows inside
 * the location's opening hours.
 */
function buildTimeRangeSlots(
  start: string,
  end: string,
  stepMinutes: number,
): string[] {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  if (startMinutes < 0 || endMinutes <= startMinutes) return [];

  const slots: string[] = [];
  for (let at = startMinutes; at < endMinutes; at += stepMinutes) {
    slots.push(minutesToTime(at));
  }
  return slots;
}

/**
 * Appointment dashboard. The displayed week (or single day on phones), stats
 * and calendar rows are all computed from real backend data
 * (business/locations/workers/appointments).
 */
export default function AppointmentDashboard() {
  const business = useAppSelector((state) => state.workspace.business);
  const locations = useAppSelector((state) => state.workspace.locations);
  const selectedLocationId = useAppSelector(
    (state) => state.workspace.selectedLocationId,
  );
  const workspaceError = useAppSelector((state) => state.workspace.error);

  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  // When the modal is opened from an empty calendar slot, those date/time
  // values are prefilled. Null means "no prefill" → today's date, empty time.
  const [newAppointmentPrefill, setNewAppointmentPrefill] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [anchor, setAnchor] = useState(() => new Date());

  // Appointment whose details are open in the "Detalle de la cita" modal.
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Phones/compact viewports show one day at a time; wider screens the week.
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.calendarSingleDayMax})`);

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

  const week = useMemo(() => weekDates(anchor), [anchor]);

  // On phones only the anchor day is visible; on wider screens the whole week.
  const visibleDates = useMemo(
    () => (isMobile ? [anchor] : week),
    [isMobile, anchor, week],
  );

  // Full week (Mon–Sun) used by the "Esta semana" stat card.
  const weekISO = useMemo(
    () => new Set(week.map((date) => toISODateString(date))),
    [week],
  );

  // Dates currently rendered in the calendar (1 day on phones, 7 on desktop).
  const visibleISO = useMemo(
    () => new Set(visibleDates.map((date) => toISODateString(date))),
    [visibleDates],
  );

  const todayISO = useMemo(() => toISODateString(new Date()), []);

  const days = useMemo<DayHeader[]>(
    () =>
      visibleDates.map((date) => ({
        label: dayLabel(date),
        date: date.getDate(),
        dateISO: toISODateString(date),
        isToday: toISODateString(date) === todayISO,
      })),
    [visibleDates, todayISO],
  );

  const navLabel = useMemo(
    () => (isMobile ? formatDayLabel(anchor) : formatWeekRangeLabel(week)),
    [isMobile, anchor, week],
  );

  const stats = useMemo(() => {
    const active = appointments.filter((appointment) => appointment.status !== "cancelled");
    return [
      { label: "Citas hoy", value: active.filter((a) => a.date === todayISO).length },
      { label: "Esta semana", value: active.filter((a) => weekISO.has(a.date)).length },
    ];
  }, [appointments, todayISO, weekISO]);

  // The selected location's openHours decides which calendar rows exist.
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId),
    [locations, selectedLocationId],
  );

  // Appointment shown in the details modal (null while it is closed).
  const selectedAppointment = useMemo(
    () =>
      selectedAppointmentId
        ? appointments.find(
            (appointment) => appointment.id === selectedAppointmentId,
          ) ?? null
        : null,
    [appointments, selectedAppointmentId],
  );

  const selectedWorkerLabel = useMemo(() => {
    if (!selectedAppointment) return "";
    const worker = workers.find(
      (candidate) => candidate.id === selectedAppointment.workerId,
    );
    return worker ? `${worker.firstName} ${worker.lastName}`.trim() : "Trabajador";
  }, [selectedAppointment, workers]);

  const timeSlots = useMemo<TimeSlot[]>(() => {
    const byDayAndTime = new Map<string, Appointment>();
    for (const appointment of appointments) {
      if (appointment.status === "cancelled" || !visibleISO.has(appointment.date)) continue;
      const key = `${appointment.date}__${appointment.time}`;
      // One chip per (day, time) slot; booking conflicts are rejected backend-side.
      if (!byDayAndTime.has(key)) byDayAndTime.set(key, appointment);
    }

    // Always render every 30-minute slot between the location's opening and
    // closing hours for each visible day, so empty time rows stay visible too.
    const slotTimes = new Set<string>();
    for (const date of visibleDates) {
      const weekdayKey = WEEKDAY_KEYS[date.getDay()];
      const ranges = selectedLocation?.openHours?.[weekdayKey];
      if (!Array.isArray(ranges)) continue;
      for (const range of ranges) {
        if (!range || typeof range !== "object") continue;
        for (const slot of buildTimeRangeSlots(
          String(range.start),
          String(range.end),
          30,
        )) {
          slotTimes.add(slot);
        }
      }
    }

    // Guarantee existing appointments always stay visible even when a manual
    // entry falls outside the configured hours, and keep the old appointment
    // only rows as a fallback when the location has no openHours data.
    for (const appointment of appointments) {
      if (appointment.status !== "cancelled" && visibleISO.has(appointment.date)) {
        slotTimes.add(appointment.time);
      }
    }

    const times = Array.from(slotTimes).sort((a, b) =>
      a.localeCompare(b, "es-MX", { numeric: true }),
    );

    return times.map((time) => ({
      time,
      cells: visibleDates.map((date) => {
        const appointment = byDayAndTime.get(`${toISODateString(date)}__${time}`);
        if (!appointment) return null;

        const worker = workers.find((candidate) => candidate.id === appointment.workerId);
        return {
          id: appointment.id,
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
  }, [appointments, visibleDates, visibleISO, workers, selectedLocation]);

  const showPrevious = () => {
    const previous = new Date(anchor);
    // Arrows move day by day on phones (single-day view) and week by week on desktop.
    previous.setDate(previous.getDate() - (isMobile ? 1 : 7));
    setAnchor(previous);
  };

  const showNext = () => {
    const next = new Date(anchor);
    next.setDate(next.getDate() + (isMobile ? 1 : 7));
    setAnchor(next);
  };

  const handleSaveAppointment = async (payload: CreateAppointmentPayload) => {
    const created = await createAppointment(payload);
    // Refresh the calendar with the new appointment.
    setAppointments((current) => [...current, created]);
  };

  const openAppointmentDetails = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
  };

  /** Opens the "Nueva cita" modal prefilled with the clicked empty slot. */
  const openAppointmentAt = (dateISO: string, time: string) => {
    setNewAppointmentPrefill({ date: dateISO, time });
    setNewAppointmentOpen(true);
  };

  /**
   * Persists the cancellation through PATCH /appointment/:id and replaces the
   * local copy, so the calendar/stats drop the cancelled appointment and the
   * details modal closes.
   */
  const handleCancelAppointment = async (appointment: Appointment) => {
    const cancelled = await cancelAppointment(appointment.id);
    setAppointments((current) =>
      current.map((candidate) => (candidate.id === cancelled.id ? cancelled : candidate)),
    );
    setSelectedAppointmentId(null);
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
            onNewAppointment={() => {
              // Toolbar button starts from today's date with an empty time.
              setNewAppointmentPrefill(null);
              setNewAppointmentOpen(true);
            }}
          />

          {error && (
            <Typography sx={{ fontSize: 12, color: tokens.color.dangerText, mb: 1.5 }}>
              {error}
            </Typography>
          )}

          <StatsCards stats={stats} />
          <WeekNavigator
            rangeLabel={navLabel}
            onPrevious={showPrevious}
            onNext={showNext}
            isDay={isMobile}
          />
          <WeeklyCalendar
            days={days}
            timeSlots={timeSlots}
            onAppointmentClick={openAppointmentDetails}
            onEmptySlotClick={openAppointmentAt}
          />

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
              defaultDate={newAppointmentPrefill?.date ?? todayISO}
              defaultTime={newAppointmentPrefill?.time ?? ""}
              onSave={handleSaveAppointment}
            />
          )}

          <AppointmentDetails
            open={selectedAppointment !== null}
            appointment={selectedAppointment}
            workerLabel={selectedWorkerLabel}
            onClose={() => setSelectedAppointmentId(null)}
            onCancel={handleCancelAppointment}
          />
        </>
      )}
    </Paper>
  );
}
