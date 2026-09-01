import express from "express";
import http from "http";
import routeErrorHandler from "./middleware/routeErrorHandler";

export default function createServer() {
  const app = express();

  app.use(express.json());

  const server = http.createServer(app);

  // Routes Error handler middleware

  app.use(routeErrorHandler);

  return { server };
}