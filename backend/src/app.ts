import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import routeErrorHandler from "./middleware/routeErrorHandler";
import authenticatedService from "./middleware/authenticatedService";
import authenticatedUser from "./middleware/authenticatedUser";
import cors from "./middleware/cors";
import admingBusinessRouter from "./routes/mongo/admin/business";
import adminLocationRouter from "./routes/mongo/admin/location";
import adminWorkerRouter from "./routes/mongo/admin/worker";
import appointmentRouter from "./routes/mongo/user/appointment";
import conversationRouter from "./routes/mongo/user/conversation";
import flowsAppointmentRouter from "./routes/flows/appointment";
import authLoginRouter from "./routes/auth";
import authSessionRouter from "./routes/auth/session";

export default function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors);

  const server = http.createServer(app);

  // Routes to be used by the Admin of the app
  app.use("/admin/business", authenticatedService, admingBusinessRouter);
  app.use("/admin/location", authenticatedService, adminLocationRouter);
  app.use("/admin/worker", authenticatedService, adminWorkerRouter);

  // Routes to be used by the frontend
  app.use("/appointment", authenticatedService, appointmentRouter);
  app.use("/conversation", authenticatedService, conversationRouter);

  app.use("/flows/appointment", authenticatedService, flowsAppointmentRouter);

  // Auth routes: /auth/login and /auth/signup are public (users authenticate
  // here with email + password, no x-api-key), while /auth/session/* validates
  // that the caller holds a valid accessToken cookie set by /auth/login. The
  // session router is mounted first so its middleware runs before the public
  // router's handlers.
  app.use("/auth/session", authenticatedUser, authSessionRouter);
  app.use("/auth", authLoginRouter);

  // Routes Error handler middleware
  app.use(routeErrorHandler);

  return { server };
}