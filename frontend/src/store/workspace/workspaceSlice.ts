import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Business, Location } from "../../api/types";

/**
 * Shared workspace state for the authenticated shell: the signed-in user's
 * business, its locations and the currently selected location.
 *
 * The Home shell loads this data once (avatar header + location switcher nav),
 * and both sections (Calendario / Chat) read from it, so the selected branch
 * stays visible and consistent across every page.
 */
export type WorkspaceState = {
  business: Business | null;
  locations: Location[];
  selectedLocationId: string;
  /** True while the shell fetches business + locations. */
  loading: boolean;
  error: string | null;
};

const initialState: WorkspaceState = {
  business: null,
  locations: [],
  selectedLocationId: "",
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    workspaceLoading(state) {
      state.loading = true;
      state.error = null;
    },
    workspaceLoaded(
      state,
      action: PayloadAction<{ business: Business; locations: Location[] }>,
    ) {
      state.loading = false;
      state.business = action.payload.business;
      state.locations = action.payload.locations;

      // Keep the previous selection when it still exists, otherwise fall back
      // to the first location so the calendar always has a valid branch.
      const stillSelected =
        state.selectedLocationId !== "" &&
        action.payload.locations.some(
          (location) => location.id === state.selectedLocationId,
        );
      state.selectedLocationId = stillSelected
        ? state.selectedLocationId
        : (action.payload.locations[0]?.id ?? "");
    },
    workspaceLoadFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    workspaceLocationSelected(state, action: PayloadAction<string>) {
      state.selectedLocationId = action.payload;
    },
    workspaceReset(state) {
      state.business = null;
      state.locations = [];
      state.selectedLocationId = "";
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  workspaceLoading,
  workspaceLoaded,
  workspaceLoadFailed,
  workspaceLocationSelected,
  workspaceReset,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;