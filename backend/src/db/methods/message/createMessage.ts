import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Message, MESSAGE_STATUS, MESSAGE_TYPE, MessageMongoType } from "../../schemas/messageSchema";

type MongoGenerated = "id" | "createdAt";

export type CreateMessageArgs = Omit<MessageMongoType, MongoGenerated | "status" | "type"> & {
  status?: MESSAGE_STATUS;
  type?: MESSAGE_TYPE;
};

export default async function createMessage({
  conversationId,
  direction,
  body,
  type = MESSAGE_TYPE.TEXT,
  whatsappMessageId,
  status = MESSAGE_STATUS.PENDING,
}: CreateMessageArgs): Promise<MessageMongoType | undefined> {
  const newMessage = new Message({
    conversationId,
    direction,
    body,
    type,
    whatsappMessageId,
    status,
  });

  try {
    await newMessage.save();
    console.log(`New ${direction} message logged for conversation ${conversationId}`);

    const { _id, __v, ...cleanMessage } = newMessage.toObject();

    return cleanMessage;
  } catch (error) {
    simpleErrorHandling(
      `Error creating message for conversation ${conversationId}`,
      error
    );
  }
}