import Add from "@mui/icons-material/Add";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button } from "@mui/material";
import { workerFilterLabel } from "../data";
import { tokens } from "../../tokens";

interface AppointmentsToolbarProps {
  /** Opens the "Nueva cita" modal. */
  onNewAppointment?: () => void;
}

/**
 * Calendar actions row: the worker filter placeholder and the "Nueva cita"
 * button. The business identity (avatar) and the location switcher live in the
 * app shell (Home header + LocationNav), so they are not rendered here anymore.
 */
export default function AppointmentsToolbar({
  onNewAppointment,
}: AppointmentsToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      <Button
        size="small"
        variant="outlined"
        endIcon={<KeyboardArrowDown sx={{ fontSize: 13 }} />}
        sx={{
          boxSizing: "border-box",
          height: 32,
          fontSize: 13,
          px: 1.5,
          borderRadius: "8px",
          textTransform: "none",
          color: tokens.color.textSecondary,
          borderColor: tokens.color.borderStrong,
          "&:hover": {
            borderColor: tokens.color.borderStrong,
            bgcolor: tokens.color.surface2,
          },
        }}
      >
        {workerFilterLabel}
      </Button>
      <Button
        size="small"
        variant="contained"
        startIcon={<Add sx={{ fontSize: 13 }} />}
        onClick={onNewAppointment}
        sx={{
          boxSizing: "border-box",
          height: 32,
          fontSize: 13,
          px: 1.5,
          borderRadius: "8px",
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
        Nueva cita
      </Button>
    </Box>
  );
}