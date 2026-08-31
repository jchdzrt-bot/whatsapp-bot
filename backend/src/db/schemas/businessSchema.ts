import mongoose, { type Model, Schema } from "mongoose";

export type BusinessMongoType = {
  id: string,
  name: string,
  phoneNumberId: string,
  type: string,
  creationTime: Date,
  locationIds: string[],
}

const businessSchema = new Schema<BusinessMongoType>({
  id: { type: String, default: () => crypto.randomUUID(), unique: true },
  name: { type: String, required: true },
  phoneNumberId: { type: String, required: true },
  type: { type: String, required: true },
  creationTime: { type: Date, default: Date.now },
  locationIds: { type: [String], default: [] },
});

export const Business: Model<BusinessMongoType> =
  mongoose.models.Business || mongoose.model<BusinessMongoType>("Business", businessSchema);
