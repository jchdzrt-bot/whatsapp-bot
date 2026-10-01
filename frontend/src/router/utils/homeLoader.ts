import axios from "axios";
import { redirect } from "react-router";
import { getUserInformation, getUserProfile } from "../../api/session";
import { authLoggedOut } from "../../store/auth/authSlice";
import { store } from "../../store";

export default async function homeLoader() {
  try {
    const user = await getUserProfile();
    const userInformation = await getUserInformation();

    return { ...userInformation, user };
  } catch (error) {
    // 401 = missing/expired/invalid session or user no longer exists. Anything
    // else (network failure, 5xx, …) is a real error and must keep propagating.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // The backend cookie session is gone, but the locally persisted Redux
      // session (authSlice) still thinks we're signed in. Clear it before
      // redirecting, otherwise the Login page would bounce straight back to
      // "/" and the two would redirect in an endless loop.
      store.dispatch(authLoggedOut());

      throw redirect("/login");
    }

    throw error;
  }
};