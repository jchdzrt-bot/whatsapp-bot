import LocationOn from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { workspaceLocationSelected } from "../../../store/workspace/workspaceSlice";
import { tokens } from "../../tokens";

/**
 * Location switcher: one segmented pill per branch of the business. It renders
 * on the right side of the app shell header, at the same height as the
 * business avatar, so the active branch is always visible and switchable.
 */
export default function LocationNav() {
  const dispatch = useAppDispatch();
  const locations = useAppSelector((state) => state.workspace.locations);
  const selectedLocationId = useAppSelector(
    (state) => state.workspace.selectedLocationId,
  );

  if (locations.length === 0) return null;

  return (
    <Box
      component="nav"
      aria-label="Cambiar de sucursal"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {locations.map((location) => {
        const active = location.id === selectedLocationId;
        return (
          <Button
            key={location.id}
            size="small"
            startIcon={<LocationOn sx={{ fontSize: 15 }} />}
            onClick={() => dispatch(workspaceLocationSelected(location.id))}
            sx={{
              boxSizing: "border-box",
              height: 32,
              fontSize: 13,
              px: 1.75,
              borderRadius: "8px",
              textTransform: "none",
              color: active ? tokens.color.accentText : tokens.color.textSecondary,
              bgcolor: active ? tokens.color.accentMutedBg : "transparent",
              "&:hover": {
                color: active ? tokens.color.accentText : tokens.color.text,
                bgcolor: active ? tokens.color.accentMutedBg : tokens.color.surface2,
              },
            }}
          >
            {location.name}
          </Button>
        );
      })}
    </Box>
  );
}