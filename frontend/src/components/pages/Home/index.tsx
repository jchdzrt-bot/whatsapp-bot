import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getBusiness, getLocations } from "../../../api/business";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  workspaceLoadFailed,
  workspaceLoaded,
  workspaceLoading,
} from "../../../store/workspace/workspaceSlice";
import AppNav from "../../navigation/AppNav";
import HomeHeader from "../../navigation/HomeHeader";
import LocationNav from "../../navigation/LocationNav";

// Shell layout for the authenticated area, stacked top → bottom:
//   1. business header (avatar + name, top-left corner)
//   2. location switcher nav (active branch highlighted)
//   3. section nav (Calendario / Chat)
//   4. the active section (children routes) rendered below through the Outlet
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
      <HomeHeader />
      <LocationNav />
      <AppNav />
      <Outlet />
    </>
  );
}