/**
 * Central route constants, shared by src/router/index.tsx and any component
 * that needs to link/navigate between sections (e.g. the AppNav bar).
 */
export const Routes = {
  HOME: "/",
  CONVERSATIONS: "conversations",
  LOGIN: "login",
  LOADING: "loading",
} as const;