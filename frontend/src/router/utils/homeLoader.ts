import axios from "axios";
import { redirect } from "react-router";
import { getUserInformation, getUserProfile } from "../../api/session";

export default async function homeLoader() {
  try {
    const user = await getUserProfile();
    const userInformation = await getUserInformation();

    return { ...userInformation, user };
  } catch (error) {
    // 401 = missing/expired/invalid session or user no longer exists. Anything
    // else (network failure, 5xx, …) is a real error and must keep propagating.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw redirect("/login");
    }

    throw error;
  }
};