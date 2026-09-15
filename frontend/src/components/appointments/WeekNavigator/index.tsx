import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { weekRangeLabel } from "../data";
import { tokens } from "../tokens";

const VIEWS = ["Semana", "Día"] as const;

/** Week prev/next navigation, displayed range and Semana/Día view toggle. */
export default function WeekNavigator() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1,
        mb: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          aria-label="Semana anterior"
          size="small"
          sx={{
            boxSizing: "border-box",
            width: 28,
            height: 28,
            color: tokens.color.textSecondary,
          }}
        >
          <ChevronLeft sx={{ fontSize: 14 }} />
        </IconButton>
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{weekRangeLabel}</Typography>
        <IconButton
          aria-label="Semana siguiente"
          size="small"
          sx={{
            boxSizing: "border-box",
            width: 28,
            height: 28,
            color: tokens.color.textSecondary,
          }}
        >
          <ChevronRight sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", gap: 0.75 }}>
        {VIEWS.map((view, index) => {
          const isActive = index === 0;
          return (
            <Button
              key={view}
              size="small"
              sx={{
                boxSizing: "border-box",
                height: 28,
                minWidth: 0,
                px: 1.5,
                fontSize: 12,
                borderRadius: "8px",
                textTransform: "none",
                color: isActive ? tokens.color.text : tokens.color.textSecondary,
                bgcolor: isActive ? tokens.color.fillSecondary : "transparent",
                "&:hover": {
                  bgcolor: isActive ? tokens.color.fillSecondaryHover : tokens.color.surface2,
                },
              }}
            >
              {view}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}