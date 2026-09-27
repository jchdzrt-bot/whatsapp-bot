import { Outlet } from "react-router-dom";
import AppNav from "../../navigation/AppNav";

// Shell layout for the authenticated area: shared navigation bar on top and
// the active section (Calendario / Chat) declared as children routes in
// src/router/index.tsx rendered below through the Outlet.
export default function Home() {
  return (
    <>
      <AppNav />
      <Outlet />
    </>
  );
}