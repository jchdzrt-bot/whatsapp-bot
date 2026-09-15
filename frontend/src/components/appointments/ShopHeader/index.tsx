import Add from "@mui/icons-material/Add";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { shop, workerFilterLabel } from "../data";
import { tokens } from "../tokens";

/** Barbershop identity + worker filter + "Nueva cita" action. */
export default function ShopHeader() {
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
          {shop.initials}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: 15, lineHeight: 1.3 }}>
            {shop.name}
          </Typography>
          <Typography sx={{ fontSize: 12, lineHeight: 1.3, color: tokens.color.textMuted }}>
            {shop.branch}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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