import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import { type BusinessMongoType } from "../../../../../db/schemas/businessSchema";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import {
  DEFAULT_DURATION_MINUTES,
  DEFAULT_SERVICE,
  INVALID_OPTION_MESSAGE,
} from "../constants";
import flowDataOf from "../utils/flowDataOf";
import pickedOptionFromMessage from "../utils/pickedOptionFromMessage";
import askWorker from "../prompts/askWorker";
import buildServicesPrompt from "../prompts/buildServicesPrompt";
import serviceOptionsOf from "../utils/serviceOptionsOf";

export default async function handleServiceSelection(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const services = serviceOptionsOf(business);

  if (services.length === 0) {
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

  const selectedService = pickedOptionFromMessage(
    message,
    services,
    (service) => service.name,
  );

  if (!selectedService) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildServicesPrompt(services),
    };
  }

  const parsedDuration = Number.parseInt(selectedService.duration, 10);
  const durationMinutes = Number.isNaN(parsedDuration)
    ? DEFAULT_DURATION_MINUTES
    : parsedDuration;

  const updated = await updateConversation({
    conversationId: conversation.id,
    stage: CONVERSATION_STAGE.AWAITING_WORKER,
    data: {
      ...flowDataOf(conversation),
      service: selectedService.name,
      durationMinutes,
      flowStep: "worker",
    },
  });

  return askWorker(updated ?? conversation);
}