import express from "express";
import http from "http";
import routeErrorHandler from "./middleware/routeErrorHandler";
import authenticatedService from "./middleware/authenticatedService";
import businessRouter from "./routes/mongo/business";
import locationRouter from "./routes/mongo/location";
import workerRouter from "./routes/mongo/worker";
import appointmentRouter from "./routes/mongo/appointment";
import conversationRouter from "./routes/mongo/conversation";

export default function createServer() {
  const app = express();

  app.use(express.json());

  const server = http.createServer(app);

  app.use("/business", authenticatedService, businessRouter);
  app.use("/location", authenticatedService, locationRouter);
  app.use("/worker", authenticatedService, workerRouter);
  app.use("/appointment", authenticatedService, appointmentRouter);
  app.use("/conversation", authenticatedService, conversationRouter);

  // Routes Error handler middleware
  app.use(routeErrorHandler);

  return { server };
}