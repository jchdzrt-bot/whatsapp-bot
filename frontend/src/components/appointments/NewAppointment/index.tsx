import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Person from "@mui/icons-material/Person";
import WhatsApp from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  Business,
  CreateAppointmentPayload,
} from "../../../api/types";
import { isPastDateTime } from "../dateUtils";
import { tokens } from "../../tokens";

type AppointmentOrigin = "bot" | "manual";

interface NewAppointmentProps {
  open: boolean;
  onClose: () => void;
  business: Business;
  locationId: string;
  /** Real workers of the selected location, e.g. [{ value, label }]. */
  workers: { value: string; label: string }[];
  /** Real service names from the business, e.g. ["Corte de cabello"]. */
  services: string[];
  /** Today in YYYY-MM-DD — the default date of the form. */
  defaultDate: string;
  /** HH:mm prefilled in the time field when the modal opens from an empty slot. */
  defaultTime?: string;
  onSave: (payload: CreateAppointmentPayload) => Promise<void>;
}

/**
 * "Nueva cita" modal. Worker/service options come from the backend and the save
 * action persists the appointment through the /appointment endpoint.
 */
export default function NewAppointment({
  open,
  onClose,
  business,
  locationId,
  workers,
  services,
  defaultDate,
  defaultTime,
  onSave,
}: NewAppointmentProps) {
  const [workerId, setWorkerId] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [origin, setOrigin] = useState<AppointmentOrigin>("bot");
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Keep the selects valid while the options load or change.
  useEffect(() => {
    setWorkerId((current) =>
      workers.some((worker) => worker.value === current)
        ? current
        : (workers[0]?.value ?? ""),
    );
    setService((current) =>
      services.includes(current) ? current : (services[0] ?? ""),
    );
  }, [workers, services]);

  // Apply the caller-provided defaults (e.g. the date/time of the empty slot
  // clicked on the calendar) every time the modal opens, and clear any state
  // left behind by a previous submission or cancel.
  useEffect(() => {
    if (!open) return;
    setDate(defaultDate);
    setTime(defaultTime ?? "");
    setClientName("");
    setClientPhone("");
    setShowErrors(false);
    setSaveError(null);
    setSaving(false);
  }, [open, defaultDate, defaultTime]);

  const nameError = showErrors && clientName.trim() === "";
  const phoneError = showErrors && clientPhone.trim() === "";
  const timeError = showErrors && time.trim() === "";
  const pastDateTimeError =
    showErrors && !timeError && isPastDateTime(date, time);
  const missingOptions = workerId === "" || service === "";

  const handleSave = async () => {
    setShowErrors(true);
    if (
      clientName.trim() === "" ||
      clientPhone.trim() === "" ||
      time.trim() === "" ||
      isPastDateTime(date, time) ||
      missingOptions
    ) {
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      await onSave({
        businessId: business.id,
        locationId,
        workerId,
        clientPhoneNumber: clientPhone.trim(),
        clientName: clientName.trim(),
        service,
        date,
        time,
        status: "confirmed",
        source: origin,
      });
      onClose();
      setShowErrors(false);
      setClientName("");
      setClientPhone("");
      setTime("");
    } catch {
      setSaveError("No se pudo guardar la cita. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const fieldLabelSx = {
    fontSize: 12,
    lineHeight: 1.3,
    color: tokens.color.textSecondary,
    mb: 0.5,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="new-appointment-title"
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
        <Typography id="new-appointment-title" sx={{ fontSize: 16, fontWeight: 500 }}>
          Nueva cita
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

      <Typography sx={{ fontSize: 12, color: tokens.color.textMuted, mb: 2 }}>
        {business.name}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Trabajador */}
        <Box>
          <Typography sx={fieldLabelSx}>Trabajador</Typography>
          <Select
            fullWidth
            size="small"
            value={workerId}
            onChange={(event) => setWorkerId(event.target.value)}
            displayEmpty
          >
            {workers.length === 0 && (
              <MenuItem value="" disabled>
                Sin trabajadores disponibles
              </MenuItem>
            )}
            {workers.map((worker) => (
              <MenuItem key={worker.value} value={worker.value}>
                {worker.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Servicio */}
        <Box>
          <Typography sx={fieldLabelSx}>Servicio</Typography>
          <Select
            fullWidth
            size="small"
            value={service}
            onChange={(event) => setService(event.target.value)}
            displayEmpty
          >
            {services.length === 0 && (
              <MenuItem value="" disabled>
                Sin servicios disponibles
              </MenuItem>
            )}
            {services.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Fecha */}
        <Box>
          <Typography sx={fieldLabelSx}>Fecha</Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Box>

        {/* Hora */}
        <Box>
          <Typography sx={fieldLabelSx}>Hora</Typography>
          <TextField
            fullWidth
            size="small"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            error={timeError || pastDateTimeError}
            helperText={
              timeError
                ? "Ingresa la hora de la cita"
                : pastDateTimeError
                  ? "La fecha y hora ya pasaron. Elige un momento futuro."
                  : undefined
            }
          />
        </Box>

        {/* Nombre */}
        <Box>
          <Typography sx={fieldLabelSx}>Nombre del cliente</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Nombre y apellido"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            error={nameError}
            helperText={nameError ? "Ingresa el nombre del cliente" : undefined}
          />
        </Box>

        {/* Teléfono */}
        <Box>
          <Typography sx={fieldLabelSx}>Teléfono (WhatsApp)</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="+52 55 1234 5678"
            value={clientPhone}
            onChange={(event) => setClientPhone(event.target.value)}
            error={phoneError}
            helperText={phoneError ? "Ingresa un número de teléfono" : undefined}
          />
        </Box>

        {/* Origen */}
        <Box>
          <Typography sx={fieldLabelSx}>Origen</Typography>
          <Box sx={{ display: "flex", gap: 0.75 }}>
            <Button
              size="small"
              startIcon={<WhatsApp sx={{ fontSize: 14 }} />}
              onClick={() => setOrigin("bot")}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 30,
                fontSize: 12,
                textTransform: "none",
                color: origin === "bot" ? tokens.color.text : tokens.color.textSecondary,
                bgcolor: origin === "bot" ? tokens.color.fillSecondary : "transparent",
                boxShadow: "none",
                "&:hover": {
                  bgcolor:
                    origin === "bot"
                      ? tokens.color.fillSecondaryHover
                      : tokens.color.surface2,
                  boxShadow: "none",
                },
              }}
            >
              Bot
            </Button>
            <Button
              size="small"
              startIcon={<Person sx={{ fontSize: 14 }} />}
              onClick={() => setOrigin("manual")}
              sx={{
                boxSizing: "border-box",
                flex: 1,
                height: 30,
                fontSize: 12,
                textTransform: "none",
                color: origin === "manual" ? tokens.color.text : tokens.color.textSecondary,
                bgcolor: origin === "manual" ? tokens.color.fillSecondary : "transparent",
                boxShadow: "none",
                "&:hover": {
                  bgcolor:
                    origin === "manual"
                      ? tokens.color.fillSecondaryHover
                      : tokens.color.surface2,
                  boxShadow: "none",
                },
              }}
            >
              Manual
            </Button>
          </Box>
        </Box>

        {missingOptions && showErrors && (
          <Typography sx={{ fontSize: 12, color: tokens.color.dangerText }}>
            Selecciona un trabajador y un servicio para la cita.
          </Typography>
        )}
        {saveError && (
          <Typography sx={{ fontSize: 12, color: tokens.color.dangerText }}>
            {saveError}
          </Typography>
        )}
      </Box>

      {/* Acciones */}
      <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
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
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || missingOptions}
          startIcon={<Check sx={{ fontSize: 13 }} />}
          sx={{
            boxSizing: "border-box",
            flex: 1,
            height: 36,
            fontSize: 13,
            textTransform: "none",
            color: tokens.color.text,
            bgcolor: tokens.color.fillSecondary,
            boxShadow: "none",
            "&:hover": {
              bgcolor: tokens.color.fillSecondaryHover,
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              color: tokens.color.textMuted,
              bgcolor: tokens.color.surface3,
            },
          }}
        >
          {saving ? "Guardando..." : "Guardar cita"}
        </Button>
      </Box>
    </Dialog>
  );
}
