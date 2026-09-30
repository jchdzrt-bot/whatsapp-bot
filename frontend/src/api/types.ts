/**
 * Frontend DTOs mirroring the backend Mongo documents
 * (backend/src/db/schemas/*). Dates arrive over the wire as ISO strings.
 */

export type AppointmentStatus =
  | "confirmed"
  | "cancelled"
  | "needs_rescheduling"
  | "completed";

export type AppointmentSource = "bot" | "manual";

export type Appointment = {
  id: string;
  businessId: string;
  locationId: string;
  workerId: string;
  clientPhoneNumber: string;
  clientName?: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes?: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  lastModifiedBy: AppointmentSource;
  updatedAt: string;
  createdAt: string;
};

export type CreateAppointmentPayload = {
  businessId: string;
  locationId: string;
  workerId: string;
  clientPhoneNumber: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  source: AppointmentSource;
};

export type ConversationStage =
  | "idle"
  | "awaiting_service"
  | "awaiting_worker"
  | "awaiting_date"
  | "awaiting_time"
  | "confirmed";

export type ConversationHandler = "bot" | "human";

export type Conversation = {
  id: string;
  businessId: string;
  clientPhone: string;
  stage: ConversationStage;
  handledBy: ConversationHandler;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type MessageDirection = "inbound" | "outbound";

export type MessageStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type Message = {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  body: string;
  type: string;
  whatsappMessageId: string;
  status: MessageStatus;
  createdAt: string;
};

/** A conversation plus its full message thread (list endpoint response). */
export type ConversationWithMessages = Conversation & {
  messages: Message[];
};

export type Business = {
  id: string;
  name: string;
  businessPhone: string;
  phoneNumberId: string;
  type: string;
  /** Maps a service name to its duration, e.g. { "Corte": "30 min" }. */
  service: Record<string, string>;
  locationIds: string[];
  flow: string;
  createdAt: string;
  updatedAt: string;
};

export type Location = {
  id: string;
  businessId: string;
  name: string;
  address: string;
  workerIds: string[];
  openHours: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type Worker = {
  id: string;
  locationId: string;
  firstName: string;
  lastName: string;
  services: string[];
  workingHours: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
