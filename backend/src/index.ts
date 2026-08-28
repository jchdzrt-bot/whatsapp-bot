import mongoose from "mongoose";
import createServer from "./app";
import confirmEnvs from "./utils/server/confirmEnvs";

export const { server } = createServer();

export const envs = confirmEnvs();
export const MONGODB_CONNECTION_STRING = envs.ENVIROMENT === 'local'
  ? `mongodb://127.0.0.1:27017`
  : `mongodb://${envs.MONGO_USER}:${envs.MONGO_PASSWORD}@${envs.MONGO_HOST}:${envs.MONGO_PORT}`;

server.listen(envs.PORT, async () => {
  console.log(`Server listening on port ${envs.PORT}`)

  try {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Connected to MongoDB`);
  }
  catch(error) {
    if (error instanceof Error)
    console.log(`MongoDB connection error: ${error.message}`)
  }
})