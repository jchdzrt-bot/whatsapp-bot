import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import { INVALID_NAME_MESSAGE } from "../constants";
import flowDataOf from "../utils/flowDataOf";
import buildConfirmNamePrompt from "../prompts/buildConfirmNamePrompt";
import buildNamePrompt from "../prompts/buildNamePrompt";

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ]+(?:[ -][a-zA-ZÀ-ÿ]+)+$/;

export default async function handleNameSelection(
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const data = flowDataOf(conversation);
  const name = message.trim().replace(/\s+/g, " ");

  if (!NAME_PATTERN.test(name)) {
    return {
      conversation,
      replyMessage: INVALID_NAME_MESSAGE + buildNamePrompt(),
    };
  }

  const updated = await updateConversation({
    conversationId: conversation.id,
    // The stage stays AWAITING_TIME; the user confirms the name before the
    // appointment is created and the stage becomes CONFIRMED.
    stage: CONVERSATION_STAGE.AWAITING_TIME,
    data: { ...data, name, flowStep: "confirm_name" },
  });

  return {
    conversation: updated ?? conversation,
    replyMessage: buildConfirmNamePrompt(name),
  };
}