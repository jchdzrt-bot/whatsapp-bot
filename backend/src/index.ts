import mongoose from "mongoose";
import createServer from "./app";
import confirmEnvs from "./utils/server/confirmEnvs";

export const { server } = createServer();

export const envs = confirmEnvs();
export const MONGODB_CONNECTION_STRING =
  envs.ENVIRONMENT === "local"
    ? `mongodb://127.0.0.1:27017/${envs.MONGO_DB}`
    : `mongodb://${envs.MONGO_USER}:${envs.MONGO_PASSWORD}@${envs.MONGO_HOST}:${envs.MONGO_PORT}/${envs.MONGO_DB}?authSource=admin`;

server.listen(envs.PORT, async () => {
  console.log(`Server listening on port ${envs.PORT}`);

  try {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Connected to MongoDB`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
    } else {
      console.error("MongoDB connection error:", error);
    }

    // There is no point serving HTTP without a database; exit and let the
    // process manager (nodemon / systemd / docker) restart with a clean slate.
    process.exit(1);
  }
});