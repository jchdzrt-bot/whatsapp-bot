import mongoose, { type Model, Schema } from "mongoose";
import weeklyHoursSchema from "./generals/weeklyHoursSchema";

export type WorkerMongoType = {
  id: string,
  locationId: string,
  firstName: string,
  lastName: string,
  services: string[],
  workingHours: WeeklyHours,
}

const workerSchema = new Schema<WorkerMongoType>({
  id: { type: String, default: () => crypto.randomUUID(), unique: true },
  locationId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  services: { type: [String], default: [] },
  workingHours: { type: weeklyHoursSchema, default: () => ({}) },
});

export const Worker: Model<WorkerMongoType> =
  mongoose.models.Worker || mongoose.model<WorkerMongoType>("Worker", workerSchema);