import mongoose, { type Model, Schema } from "mongoose";
import { FLOWS } from "../../bot/constants";

export type BusinessMongoType = {
  id: string;
  name: string;
  businessPhone: string;
  phoneNumberId: string;
  type: string;
  locationIds: string[];
  createdAt: Date;
  updatedAt: Date;
  flow: FLOWS;
};

const businessSchema = new Schema<BusinessMongoType>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true },
    name: { type: String, required: true },
    businessPhone: { type: String, required: true },
    phoneNumberId: { type: String, required: true },
    type: { type: String, required: true },
    locationIds: { type: [String], default: [] },
    flow: {
      type: String,
      enum: Object.values(FLOWS),
      required: true,
      default: FLOWS.APPOINTMENT_V1,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const Business: Model<BusinessMongoType> =
  mongoose.models.Business || mongoose.model<BusinessMongoType>("Business", businessSchema);
