import mongoose, { type Model, Schema } from "mongoose";

export type BusinessMongoType = {
  id: string;
  name: string;
  phoneNumberId: string;
  type: string;
  locationIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

const businessSchema = new Schema<BusinessMongoType>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true },
    name: { type: String, required: true },
    phoneNumberId: { type: String, required: true },
    type: { type: String, required: true },
    locationIds: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const Business: Model<BusinessMongoType> =
  mongoose.models.Business || mongoose.model<BusinessMongoType>("Business", businessSchema);
