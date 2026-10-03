import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Message, type MessageMongoType } from "../../schemas/messageSchema";

export default async function getMessagesByConversationId(
  conversationId: string,
): Promise<MessageMongoType[] | undefined> {
  try {
    const messages = await Message.find({ conversationId })
      .select("-_id -__v")
      .sort({ createdAt: 1 });

    console.log(
      `[conversations] DB query for conversationId=${conversationId} found ${messages.length} message(s)`,
    );

    return messages.map((message) => message.toObject());
  } catch (error) {
    simpleErrorHandling(
      `Error getting messages for conversationId: ${conversationId}`,
      error,
    );
  }
}
