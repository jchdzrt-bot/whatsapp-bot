import { Box, CircularProgress } from "@mui/material";

// Full-page centered spinner. Used both as the /loading route and as the
// home route's hydrateFallbackElement while the loader validates the session.
export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
}