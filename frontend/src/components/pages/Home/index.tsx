import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { getBusiness, getLocations } from "../../../api/business";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  workspaceLoadFailed,
  workspaceLoaded,
  workspaceLoading,
} from "../../../store/workspace/workspaceSlice";
import { tokens } from "../../tokens";
import AppNav from "../../navigation/AppNav";
import HomeHeader from "../../navigation/HomeHeader";
import LocationNav from "../../navigation/LocationNav";

// Shell layout for the authenticated area, stacked top → bottom:
//   1. header row with the business identity (avatar + name) on the left and
//      the location switcher nav on the right
//   2. section nav (Calendario / Chat)
//   3. the active section (children routes) rendered below through the Outlet
export default function Home() {
  const dispatch = useAppDispatch();
  const businessId = useAppSelector((state) => state.auth.user?.businessId);

  // Load the signed-in user's business and locations once for the whole shell;
  // both sections read the result from the workspace store.
  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;

    dispatch(workspaceLoading());
    Promise.all([getBusiness(businessId), getLocations(businessId)])
      .then(([business, locations]) => {
        if (cancelled) return;
        dispatch(
          workspaceLoaded({
            business,
            locations: Array.isArray(locations) ? locations : [],
          }),
        );
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(
            workspaceLoadFailed("No se pudieron cargar los datos del negocio."),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, dispatch]);

  return (
    <>
      <Box
        component="header"
        aria-label="Negocio"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          px: 2,
          py: 1,
          bgcolor: tokens.color.surface1,
          borderBottom: `0.5px solid ${tokens.color.borderSoft}`,
        }}
      >
        <HomeHeader />
        <LocationNav />
      </Box>
      <AppNav />
      <Outlet />
    </>
  );
}