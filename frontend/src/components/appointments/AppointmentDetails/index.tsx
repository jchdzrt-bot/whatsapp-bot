import Close from "@mui/icons-material/Close";
import { Box, Button, Dialog, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { Appointment } from "../../../api/types";
import { tokens } from "../../tokens";
import { formatDayLabel } from "../dateUtils";

interface AppointmentDetailsProps {
  open: boolean;
  /** The appointment being inspected; null while the modal is closed. */
  appointment: Appointment | null;
  /** Display name of the assigned worker, e.g. "María López". */
  workerLabel: string;
  onClose: () => void;
  /** Persists the cancellation (PATCH status → "cancelled") in the backend. */
  onCancel: (appointment: Appointment) => Promise<void>;
}

const STATUS_LABELS: Record<Appointment["status"], string> = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  needs_rescheduling: "Requiere reprogramación",
  completed: "Completada",
};

const labelSx = {
  fontSize: 12,
  lineHeight: 1.3,
  color: tokens.color.textSecondary,
};

const valueSx = {
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.4,
  color: tokens.color.text,
};

/** "Jueves, 15 de septiembre" — falls back to the raw YYYY-MM-DD string. */
function formatAppointmentDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;
  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(parsed.getTime()) ? date : formatDayLabel(parsed);
}

/**
 * "Detalle de la cita" modal: shows every field of an appointment and offers a
 * two-step cancel action that persists through PATCH /appointment/:id.
 */
export default function AppointmentDetails({
  open,
  appointment,
  workerLabel,
  onClose,
  onCancel,
}: AppointmentDetailsProps) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Reset the two-step cancel flow every time the modal opens on an appointment.
  useEffect(() => {
    setConfirming(false);
    setCancelling(false);
    setCancelError(null);
  }, [open, appointment?.id]);

  const clientName =
    appointment?.clientName?.trim() || appointment?.clientPhoneNumber || "Cliente";

  const handleCancel = async () => {
    if (!appointment) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await onCancel(appointment);
    } catch {
      setCancelError("No se pudo cancelar la cita. Inténtalo de nuevo.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="appointment-details-title"
      slotProps={{
        backdrop: { sx: { bgcolor: "rgba(0, 0, 0, 0.45)" } },
        paper: {
          sx: {
            width: "100%",
            maxWidth: 420,
            m: 2,
            p: 2.5,
            bgcolor: tokens.color.surface2,
            borderRadius: "12px",
            border: `0.5px solid ${tokens.color.border}`,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography id="appointment-details-title" sx={{ fontSize: 16, fontWeight: 500 }}>
          Detalle de la cita
        </Typography>
        <IconButton
          aria-label="Cerrar"
          size="small"
          onClick={onClose}
          sx={{
            boxSizing: "border-box",
            width: 28,
            height: 28,
            color: tokens.color.textSecondary,
          }}
        >
          <Close sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      {appointment && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {confirming ? (
            <>
              <Typography sx={{ fontSize: 13, lineHeight: 1.5, color: tokens.color.text }}>
                ¿Seguro que quieres cancelar la cita de{" "}
                <strong>{clientName}</strong>? Se notificará al cliente y el
                espacio quedará libre.
              </Typography>
              {cancelError && (
                <Typography sx={{ fontSize: 12, color: tokens.color.dangerText }}>
                  {cancelError}
                </Typography>
              )}
            </>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 0.75 }}>
              <Typography sx={labelSx}>Cliente</Typography>
              <Typography sx={valueSx}>{clientName}</Typography>
              <Typography sx={labelSx}>Teléfono</Typography>
              <Typography sx={valueSx}>{appointment.clientPhoneNumber}</Typography>
              <Typography sx={labelSx}>Trabajador</Typography>
              <Typography sx={valueSx}>{workerLabel || "Trabajador"}</Typography>
              <Typography sx={labelSx}>Servicio</Typography>
              <Typography sx={valueSx}>{appointment.service}</Typography>
              <Typography sx={labelSx}>Fecha</Typography>
              <Typography sx={valueSx}>{formatAppointmentDate(appointment.date)}</Typography>
              <Typography sx={labelSx}>Hora</Typography>
              <Typography sx={valueSx}>{appointment.time}</Typography>
              <Typography sx={labelSx}>Estado</Typography>
              <Typography sx={valueSx}>{STATUS_LABELS[appointment.status]}</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Acciones */}
      <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
        {confirming ? (
          <>
            <Button
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 36,
                fontSize: 13,
                textTransform: "none",
                color: tokens.color.textSecondary,
              }}
            >
              Volver
            </Button>
            <Button
              onClick={handleCancel}
              disabled={cancelling}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 36,
                fontSize: 13,
                textTransform: "none",
                color: tokens.color.surface1,
                bgcolor: tokens.color.dangerText,
                boxShadow: "none",
                "&:hover": { filter: "brightness(0.94)", boxShadow: "none" },
                "&.Mui-disabled": {
                  color: tokens.color.textMuted,
                  bgcolor: tokens.color.surface3,
                },
              }}
            >
              {cancelling ? "Cancelando..." : "Sí, cancelar cita"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 36,
                fontSize: 13,
                textTransform: "none",
                color: tokens.color.textSecondary,
              }}
            >
              Cerrar
            </Button>
            <Button
              onClick={() => setConfirming(true)}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 36,
                fontSize: 13,
                textTransform: "none",
                color: tokens.color.surface1,
                bgcolor: tokens.color.dangerText,
                boxShadow: "none",
                "&:hover": { filter: "brightness(0.94)", boxShadow: "none" },
              }}
            >
              Cancelar cita
            </Button>
          </>
        )}
      </Box>
    </Dialog>
  );
}