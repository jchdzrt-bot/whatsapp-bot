import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import { type BusinessMongoType } from "../../../../../db/schemas/businessSchema";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SERVICE,
} from "../constants";
import flowDataOf from "../utils/flowDataOf";
import serviceOptionsOf from "../utils/serviceOptionsOf";
import askWorker from "./askWorker";
import buildServicesPrompt from "./buildServicesPrompt";

export default async function askService(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
): Promise<AppointmentV1Result> {
  const services = serviceOptionsOf(business);

  if (services.length === 0) {
    // No service catalog configured yet: fall back to the default and continue.
    const updated = await updateConversation({
      conversationId: conversation.id,
      stage: CONVERSATION_STAGE.AWAITING_WORKER,
      data: {
        ...flowDataOf(conversation),
        service: DEFAULT_SERVICE,
        durationMinutes: DEFAULT_DURATION_MINUTES,
        flowStep: "worker",
      },
    });

    return askWorker(updated ?? conversation);
  }

  const updated = await updateConversation({
    conversationId: conversation.id,
    // The stage stays AWAITING_SERVICE; the exact step (location vs service)
    // is tracked in conversation.data.flowStep.
    stage: CONVERSATION_STAGE.AWAITING_SERVICE,
    data: { ...flowDataOf(conversation), flowStep: "service" },
  });

  return {
    conversation: updated ?? conversation,
    replyMessage: buildServicesPrompt(services),
  };
}