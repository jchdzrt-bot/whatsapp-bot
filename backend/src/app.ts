import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import routeErrorHandler from "./middleware/routeErrorHandler";
import authenticatedService from "./middleware/authenticatedService";
import cors from "./middleware/cors";
import businessRouter from "./routes/mongo/admin/business";
import locationRouter from "./routes/mongo/admin/location";
import workerRouter from "./routes/mongo/admin/worker";
import appointmentRouter from "./routes/mongo/user/appointment";
import conversationRouter from "./routes/mongo/user/conversation";
import flowsAppointmentRouter from "./routes/flows/appointment";
import authLoginRouter from "./routes/auth";

export default function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors);

  const server = http.createServer(app);

  // Routes to be used by the Admin of the app
  app.use("/business", authenticatedService, businessRouter);
  app.use("/location", authenticatedService, locationRouter);
  app.use("/worker", authenticatedService, workerRouter);

  // Routes to be used by the frontend
  app.use("/appointment", authenticatedService, appointmentRouter);
  app.use("/conversation", authenticatedService, conversationRouter);

  app.use("/flows/appointment", authenticatedService, flowsAppointmentRouter);

  // Auth routes are public: users authenticate here with email + password
  // (no x-api-key service header), and only receive tokens afterwards.
  app.use("/auth", authLoginRouter);

  // Routes Error handler middleware
  app.use(routeErrorHandler);

  return { server };
}