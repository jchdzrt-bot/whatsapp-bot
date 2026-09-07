import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Conversation,
  ConversationMongoType,
} from "../../schemas/conversationSchema";

export default async function getConvByClientPhoneAndBusinessId(
  clientPhone: string,
  businessId: string,
): Promise<ConversationMongoType | NullOrUndefined> {
  try {
    const conversation = await Conversation.findOne(
      { clientPhone, businessId },
      "-_id -__v",
    );

    if (!conversation) {
      console.log(`No conversation found for businessId: ${businessId}`);
      return null;
    }

    return conversation.toObject();
  } catch (error) {
    simpleErrorHandling(
      `Error in getConversationByBussinessId with businessId: ${businessId}`,
      error,
    );
  }
}
