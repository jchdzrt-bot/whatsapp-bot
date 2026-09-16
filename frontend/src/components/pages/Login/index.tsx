import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { tokens } from "../../appointments/tokens";

/**
 * Simple login page.
 *
 * Design-only for now: fields are uncontrolled (no useState) and the submit
 * button does nothing yet. Auth will be wired to the redux store/backend later.
 */
export default function Login() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        component="form"
        onSubmit={(event) => event.preventDefault()}
        sx={{
          width: "100%",
          maxWidth: 380,
          p: 3,
          bgcolor: tokens.color.surface1,
          borderRadius: `${tokens.radius.card}px`,
          border: `0.5px solid ${tokens.color.border}`,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 0.5 }}>
          Iniciar sesión
        </Typography>
        <Typography sx={{ fontSize: 13, color: tokens.color.textMuted, mb: 2.5 }}>
          Accede con el correo y la contraseña de tu cuenta
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
          />
          <TextField
            fullWidth
            size="small"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Box>

        <Button
          type="button"
          variant="contained"
          fullWidth
          sx={{
            boxSizing: "border-box",
            mt: 2.5,
            height: 38,
            fontSize: 14,
            textTransform: "none",
            color: "#ffffff",
            bgcolor: tokens.color.accent,
            boxShadow: "none",
            "&:hover": {
              bgcolor: tokens.color.accentText,
              boxShadow: "none",
            },
          }}
        >
          Iniciar sesión
        </Button>
      </Paper>
    </Box>
  );
}