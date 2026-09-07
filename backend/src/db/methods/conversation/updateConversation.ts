import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";
import {
  Conversation,
  CONVERSATION_HANDLER,
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../schemas/conversationSchema";

export type UpdateConversationArgs = {
  conversationId: string;
  stage?: CONVERSATION_STAGE;
  handledBy?: CONVERSATION_HANDLER;
  data?: Record<string, unknown>;
};

export default async function updateConversation({
  conversationId,
  stage,
  handledBy,
  data,
}: UpdateConversationArgs): Promise<ConversationMongoType | NullOrUndefined> {
  const updateFields = filterOutUndefinedProperties({ stage, handledBy, data });

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields provided to update");
  }

  try {
    const conversation = await Conversation.findOneAndUpdate(
      { id: conversationId },
      { $set: updateFields },
      { new: true, select: "-_id -__v", timestamps: true },
    );

    if (!conversation) {
      console.error(`No conversation found with id: ${conversationId}`);
      return null;
    }

    return conversation.toObject();
  } catch (error) {
    simpleErrorHandling(`Error updating conversation ${conversationId}`, error);
  }
}
