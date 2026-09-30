// Types shared by the admin setup script. They mirror the response/input
// shapes used by the backend /admin routes and the Mongo schemas:
//   backend/src/db/schemas/businessSchema.ts
//   backend/src/db/schemas/locationSchema.ts
//   backend/src/db/schemas/workerSchema.ts

export type TimeRange = {
  start: string; // "09:00" — 24h format
  end: string;   // "18:00"
};

export type WeeklyHours = {
  monday?: TimeRange[];
  tuesday?: TimeRange[];
  wednesday?: TimeRange[];
  thursday?: TimeRange[];
  friday?: TimeRange[];
  saturday?: TimeRange[];
  sunday?: TimeRange[];
};

// Minimal response shape returned by POST /admin/business.
export type Business = {
  id: string;
  name: string;
  type: string;
  businessPhone: string;
  phoneNumberId: string;
  locationIds: string[];
  flow: string;
};

// Minimal response shape returned by POST /admin/location.
export type Location = {
  id: string;
  businessId: string;
  name: string;
  address: string;
  workerIds: string[];
  openHours: WeeklyHours;
};

// Minimal response shape returned by POST /admin/worker.
export type Worker = {
  id: string;
  locationId: string;
  firstName: string;
  lastName: string;
  services: string[];
  workingHours: WeeklyHours;
};

// Minimal response shape returned by POST /auth/signup (and POST /auth/login's
// `user` field). Mirrors backend/src/db/schemas/userSchema.ts minus passwordHash.
export type User = {
  id: string;
  businessId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};