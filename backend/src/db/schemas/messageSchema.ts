import mongoose, { type Model, Schema } from "mongoose";

enum MESSAGE_DIRECTION {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

enum MESSAGE_TYPE {
  TEXT = "text",
}

enum MESSAGE_STATUS {
  PENDING = "pending", // outbound: sent to Meta, no status webhook yet
  SENT = "sent", // Meta accepted it
  DELIVERED = "delivered", // reached the client's device
  READ = "read", // client opened it (if read receipts are on)
  FAILED = "failed",
}

export type MessageMongoType = {
  id: string;
  conversationId: string;
  direction: MESSAGE_DIRECTION;
  body: string;
  messageType: MESSAGE_TYPE;
  whatsappMessageId: string; // Meta's own message ID
  status: MESSAGE_STATUS;
  createdAt: Date;
};

const messageSchema = new Schema<MessageMongoType>({
  id: { type: String, default: () => crypto.randomUUID(), unique: true },
  conversationId: { type: String, required: true },
  direction: {
    type: String,
    enum: Object.values(MESSAGE_DIRECTION),
    required: true,
    default: MESSAGE_DIRECTION.INBOUND,
  },
  body: { type: String, required: true },
  messageType: {
    type: String,
    enum: Object.values(MESSAGE_TYPE),
    required: true,
    default: MESSAGE_TYPE.TEXT,
  },
  whatsappMessageId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(MESSAGE_STATUS),
    required: true,
    default: MESSAGE_STATUS.PENDING,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Message: Model<MessageMongoType> =
  mongoose.models.Message ||
  mongoose.model<MessageMongoType>("Message", messageSchema);
