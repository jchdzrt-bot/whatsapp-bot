import mongoose, { type Model, Schema } from "mongoose";

enum APPOINTMENT_STATUS {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  NEEDS_RESCHEDULING = "needs_rescheduling",
  COMPLETED = "completed",
}

enum APPOINTMENT_SOURCE {
  BOT = "bot",
  MANUAL = "manual",
}

export type AppointmentMongoType = {
  id: string;
  businessId: string;
  locationId: string;
  workerId: string;
  clientPhoneNumber: string;
  clientName?: string;
  service: string;
  date: string;
  time: string;
  status: APPOINTMENT_STATUS;
  source: APPOINTMENT_SOURCE;
  updatedAt: Date;
  createdAt: Date;
};

const appointmentSchema = new Schema<AppointmentMongoType>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true },
    businessId: { type: String, required: true },
    locationId: { type: String, required: true },
    workerId: { type: String, required: true },
    clientPhoneNumber: { type: String, required: true },
    clientName: { type: String, required: false },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      required: true,
      default: APPOINTMENT_STATUS.CONFIRMED,
    },
    source: {
      type: String,
      enum: Object.values(APPOINTMENT_SOURCE),
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const Appointment: Model<AppointmentMongoType> =
  mongoose.models.Appointment ||
  mongoose.model<AppointmentMongoType>("Appointment", appointmentSchema);
