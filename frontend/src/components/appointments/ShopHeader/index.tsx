import Add from "@mui/icons-material/Add";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Box, Button, MenuItem, Select, Typography } from "@mui/material";
import type { Business, Location } from "../../../api/types";
import { workerFilterLabel } from "../data";
import { tokens } from "../../tokens";

interface ShopHeaderProps {
  business: Business | null;
  locations: Location[];
  selectedLocationId: string;
  /** Displayed as the "branch" subtitle under the business name. */
  locationLabel: string | null;
  onLocationChange: (locationId: string) => void;
  /** Opens the "Nueva cita" modal. */
  onNewAppointment?: () => void;
}

/** Initials for the shop avatar, e.g. "Barbería Ana" → "BA". */
function initialsOf(name: string): string {
  if (typeof name !== "string") return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
  }
  return name.trim().slice(0, 2);
}

/** Barbershop identity + location switch + worker filter + "Nueva cita". */
export default function ShopHeader({
  business,
  locations = [],
  selectedLocationId,
  locationLabel,
  onLocationChange,
  onNewAppointment,
}: ShopHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        {business && (
          <>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: 13,
                fontWeight: 500,
                bgcolor: tokens.color.accent,
                color: "#ffffff",
              }}
            >
              {initialsOf(business.name)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}>
                {business.name}
              </Typography>
              {locationLabel && (
                <Typography sx={{ fontSize: 12, lineHeight: 1.3, color: tokens.color.textMuted }}>
                  {locationLabel}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {locations.length > 1 && (
          <Select
            size="small"
            value={selectedLocationId}
            onChange={(event) => onLocationChange(event.target.value)}
            sx={{
              boxSizing: "border-box",
              height: 32,
              fontSize: 13,
              minWidth: 180,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: tokens.color.borderStrong,
                borderRadius: "8px",
              },
            }}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        )}
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
    </Box>
  );
}
