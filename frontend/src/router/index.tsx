import { createHashRouter } from "react-router-dom";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Loading from "../components/pages/Loading";
import Appointments from "../components/pages/Appointments";
import Conversations from "../components/pages/Conversations";
import type { UserInformation } from "../api/session";
import { type AuthUser } from "../store/auth/authSlice";

import homeLoader from "./utils/homeLoader";
import { Routes } from "./routes";

export type HomeLoader = UserInformation & {
  user: AuthUser;
};

const router = createHashRouter([
  {
    path: `${Routes.HOME}`,
    loader: homeLoader,
    hydrateFallbackElement: <Loading />,
    element: <Home />,
    children: [
      {
        index: true,
        element: <Appointments />,
      },
      {
        path: `${Routes.CONVERSATIONS}`,
        element: <Conversations />,
      },
    ],
  },
  {
    path: `/${Routes.LOGIN}`,
    element: <Login />,
  },
  {
    path: `/${Routes.LOADING}`,
    element: <Loading />,
  },
]);

export default router;
