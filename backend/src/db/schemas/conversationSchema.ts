import mongoose, { type Model, Schema } from "mongoose";

export enum CONVERSATION_STAGE {
  IDLE = "idle",
  AWAITING_SERVICE = "awaiting_service",
  AWAITING_WORKER = "awaiting_worker",
  AWAITING_DATE = "awaiting_date",
  AWAITING_TIME = "awaiting_time",
  CONFIRMED = "confirmed",
}

export enum CONVERSATION_HANDLER {
  BOT = "bot",
  HUMAN = "human",
}

export type ConversationMongoType = {
  id: string;
  businessId: string;
  clientPhone: string;
  stage: CONVERSATION_STAGE;
  handledBy: CONVERSATION_HANDLER;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const conversationSchema = new Schema<ConversationMongoType>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true },
    businessId: { type: String, required: true, index: true },
    clientPhone: { type: String, required: true, index: true },
    stage: {
      type: String,
      enum: Object.values(CONVERSATION_STAGE),
      required: true,
      default: CONVERSATION_STAGE.IDLE,
    },
    handledBy: {
      type: String,
      enum: Object.values(CONVERSATION_HANDLER),
      required: true,
      default: CONVERSATION_HANDLER.BOT,
    },
    data: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

export const Conversation: Model<ConversationMongoType> =
  mongoose.models.Conversation ||
  mongoose.model<ConversationMongoType>("Conversation", conversationSchema);
