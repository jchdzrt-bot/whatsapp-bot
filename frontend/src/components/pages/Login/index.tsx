import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { tokens } from "../../appointments/tokens";
import { getLoginErrorMessage, login } from "../../../api/auth";
import {
  authLoggedIn,
  isAuthenticated,
} from "../../../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

/**
 * Login page.
 *
 * Controlled form that posts email + password to the backend /auth/login
 * route (via src/api/auth.ts). The backend plants the access/refresh token
 * pair in httpOnly cookies, so the redux store only keeps the returned user
 * profile (persisted to localStorage so a reload restores the session). On
 * success the user is taken back home.
 */
export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const alreadyAuthenticated = useAppSelector(isAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // A session was already restored from localStorage — skip the form.
  useEffect(() => {
    if (alreadyAuthenticated) navigate("/");
  }, [alreadyAuthenticated, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setErrorMessage("Introduce el correo y la contraseña");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const session = await login({ email: email.trim(), password });
      dispatch(authLoggedIn(session));
      navigate("/");
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

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
        onSubmit={handleSubmit}
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={submitting}
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
            "&:disabled": {
              bgcolor: tokens.color.accentMutedBg,
              color: "#ffffff",
              boxShadow: "none",
            },
          }}
        >
          {submitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Iniciar sesión"
          )}
        </Button>

        {errorMessage && (
          <Typography
            sx={{
              fontSize: 13,
              color: tokens.color.dangerText,
              mt: 1.5,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}