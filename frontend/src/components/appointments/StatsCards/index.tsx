import { Box, Paper, Typography } from "@mui/material";
import { stats } from "../data";
import { tokens } from "../tokens";

/** Row of quick-stat cards: hoy / semana / por confirmar. */
export default function StatsCards() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        mb: 2.5,
      }}
    >
      {stats.map((stat) => (
        <Paper
          key={stat.label}
          elevation={0}
          sx={{
            flex: "1 1 170px",
            minWidth: 170,
            bgcolor: tokens.color.surface2,
            borderRadius: `${tokens.radius.inner}px`,
            px: 2,
            py: 1.25,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              lineHeight: 1.3,
              color: tokens.color.textSecondary,
              mb: 0.5,
            }}
          >
            {stat.label}
          </Typography>
          <Typography sx={{ fontSize: 22, lineHeight: 1.2, fontWeight: 500 }}>
            {stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}