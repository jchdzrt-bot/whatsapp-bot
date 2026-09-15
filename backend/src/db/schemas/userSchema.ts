import mongoose, { type Model, Schema } from "mongoose";

// First iteration: every user of a business is an admin of it.
// A business can have several user accounts so multiple people can log in
// to the same business from the frontend. More roles can be added later.
export enum USER_ROLE {
  ADMIN = "admin",
}

export type UserMongoType = {
  id: string;
  businessId: string;
  email: string;
  passwordHash: string; // Only ever a hash, never a plaintext password
  firstName: string;
  lastName: string;
  role: USER_ROLE;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserMongoType>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true },
    businessId: { type: String, required: true, index: true },
    // Login handle for the frontend, normalized so "User@A.com " == "user@a.com".
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Hidden by default in queries; fetch it explicitly with
    // .select("+passwordHash") only when verifying a login.
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
      default: USER_ROLE.ADMIN,
    },
    // Lets an admin disable an account without deleting it.
    isActive: { type: Boolean, required: true, default: true },
    // Set on each successful login.
    lastLoginAt: { type: Date, required: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const User: Model<UserMongoType> =
  mongoose.models.User || mongoose.model<UserMongoType>("User", userSchema);
