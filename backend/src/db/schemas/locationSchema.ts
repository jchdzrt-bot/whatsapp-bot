import mongoose, { type Model, Schema } from "mongoose";
import weeklyHoursSchema from "./generals/weeklyHoursSchema";

export type LocationMongoType = {
  id: string,
  businessId: string,
  name: string,
  address: string,
  workerIds: string[],
  openHours: WeeklyHours,
}

const locationSchema = new Schema<LocationMongoType>({
  id: { type: String, default: () => crypto.randomUUID(), unique: true },
  businessId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  workerIds: { type: [String], default: [] },
  openHours: { type: weeklyHoursSchema, default: () => ({}) },
});

export const Location: Model<LocationMongoType> =
  mongoose.models.Location || mongoose.model<LocationMongoType>("Location", locationSchema);