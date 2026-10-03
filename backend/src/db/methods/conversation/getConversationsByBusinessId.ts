import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Conversation,
  type ConversationMongoType,
} from "../../schemas/conversationSchema";
import type { MessageMongoType } from "../../schemas/messageSchema";
import getMessagesByConversationId from "../message/getMessagesByConversationId";

export type ConversationWithMessages = ConversationMongoType & {
  messages: MessageMongoType[];
};

export default async function getConversationsByBusinessId(
  businessId: string,
): Promise<ConversationWithMessages[] | undefined> {
  try {
    const conversations = await Conversation.find({ businessId })
      .select("-_id -__v")
      .sort({ updatedAt: -1 });

    console.log(
      `[conversations] DB query for businessId=${businessId} found ${conversations.length} conversation(s)`,
    );

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const messages = (await getMessagesByConversationId(conversation.id)) ?? [];

        return {
          ...conversation.toObject(),
          // Each conversation ships with its full thread so the frontend can
          // render the list preview and the open chat in a single request.
          messages,
        };
      }),
    );

    return conversationsWithMessages;
  } catch (error) {
    simpleErrorHandling(
      `Error getting conversations for businessId: ${businessId}`,
      error,
    );
  }
}
