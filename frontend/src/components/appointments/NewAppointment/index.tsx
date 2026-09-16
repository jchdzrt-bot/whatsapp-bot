import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import Person from "@mui/icons-material/Person";
import Whatsapp from "@mui/icons-material/Whatsapp";
import { Box, Button, Dialog, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { appointmentTimes, defaultAppointmentDate, services, shop, workers } from "../data";
import { tokens } from "../tokens";

type AppointmentOrigin = "bot" | "manual";

interface NewAppointmentProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Nueva cita" modal, ported from
 * notes/design/add_appointment_modal.html into MUI components.
 * Pure UI — form state is local; no redux/backend calls yet.
 */
export default function NewAppointment({ open, onClose }: NewAppointmentProps) {
  const [worker, setWorker] = useState<string>(workers[0]);
  const [service, setService] = useState<string>(services[0]);
  const [date, setDate] = useState<string>(defaultAppointmentDate);
  const [time, setTime] = useState<string>(appointmentTimes[2]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [origin, setOrigin] = useState<AppointmentOrigin>("bot");
  const [showErrors, setShowErrors] = useState(false);

  const nameError = showErrors && clientName.trim() === "";
  const phoneError = showErrors && clientPhone.trim() === "";

  const handleSave = () => {
    setShowErrors(true);
    if (clientName.trim() !== "" && clientPhone.trim() !== "") {
      // Design-only: a valid save currently just closes the modal.
      onClose();
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
        {shop.name} · {shop.branch}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Trabajador */}
        <Box>
          <Typography sx={fieldLabelSx}>Trabajador</Typography>
          <Select
            fullWidth
            size="small"
            value={worker}
            onChange={(event) => setWorker(event.target.value as string)}
          >
            {workers.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
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
            onChange={(event) => setService(event.target.value as string)}
          >
            {services.map((label) => (
              <MenuItem key={label} value={label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Fecha + Hora */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.5,
          }}
        >
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
          <Box>
            <Typography sx={fieldLabelSx}>Hora</Typography>
            <Select
              fullWidth
              size="small"
              value={time}
              onChange={(event) => setTime(event.target.value as string)}
            >
              {appointmentTimes.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Availability notice */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 1,
            bgcolor: tokens.color.successBg,
            borderRadius: `${tokens.radius.inner}px`,
          }}
        >
          <Check sx={{ fontSize: 14, color: tokens.color.successText }} />
          <Typography sx={{ fontSize: 12, color: tokens.color.successText }}>
            {worker} está disponible a esta hora
          </Typography>
        </Box>

        <Box sx={{ borderTop: `0.5px solid ${tokens.color.border}`, my: 0.5 }} />

        {/* Cliente */}
        <Box>
          <Typography sx={fieldLabelSx}>Nombre del cliente</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Juan Pérez"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            error={nameError}
            helperText={nameError ? "Ingresa el nombre del cliente" : undefined}
          />
        </Box>

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
              startIcon={<Whatsapp sx={{ fontSize: 14 }} />}
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
          }}
        >
          Guardar cita
        </Button>
      </Box>
    </Dialog>
  );
}