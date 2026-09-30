import axios from "axios";
import { BACKEND_URL, X_API_KEY } from "./setupBusiness/constants.js";

// Shared client: every request carries the x-api-key expected by
// authenticatedService (backend/src/middleware/authenticatedService.ts).
export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "x-api-key": X_API_KEY, "Content-Type": "application/json" },
});