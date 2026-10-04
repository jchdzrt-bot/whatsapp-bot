import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, IconButton, Typography } from "@mui/material";
import { tokens } from "../../tokens";

interface WeekNavigatorProps {
  rangeLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  /**
   * Day-granularity mode (phone layout): "Día anterior/…siguiente" labels,
   * larger touch targets and a slightly larger label.
   */
  isDay?: boolean;
}

/** Prev/next arrow navigation with the displayed range label (week or day). */
export default function WeekNavigator({
  rangeLabel,
  onPrevious,
  onNext,
  isDay = false,
}: WeekNavigatorProps) {
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
          aria-label={isDay ? "Día anterior" : "Semana anterior"}
          size="small"
          onClick={onPrevious}
          sx={{
            boxSizing: "border-box",
            width: isDay ? 36 : 28,
            height: isDay ? 36 : 28,
            color: tokens.color.textSecondary,
          }}
        >
          <ChevronLeft sx={{ fontSize: isDay ? 18 : 14 }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: isDay ? 15 : 14,
            fontWeight: 500,
            lineHeight: 1.3,
            minWidth: 0,
            textAlign: "center",
          }}
        >
          {rangeLabel}
        </Typography>
        <IconButton
          aria-label={isDay ? "Día siguiente" : "Semana siguiente"}
          size="small"
          onClick={onNext}
          sx={{
            boxSizing: "border-box",
            width: isDay ? 36 : 28,
            height: isDay ? 36 : 28,
            color: tokens.color.textSecondary,
          }}
        >
          <ChevronRight sx={{ fontSize: isDay ? 18 : 14 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
