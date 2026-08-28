import express from "express";
import http from "http";

export default function createServer() {
  const app = express()

  app.use(express.json());

  const server = http.createServer(app);

  return { server };
}