import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import getWorkersByLocationId from "../../../../../db/methods/worker/getWorkersByLocationId";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import { DATE_OPTION_COUNT, INVALID_OPTION_MESSAGE } from "../constants";
import buildDateOptions from "../utils/buildDateOptions";
import flowDataOf from "../utils/flowDataOf";
import pickedOptionFromMessage from "../utils/pickedOptionFromMessage";
import buildDatesPrompt from "../prompts/buildDatesPrompt";
import buildWorkersPrompt from "../prompts/buildWorkersPrompt";

export default async function handleWorkerSelection(
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const data = flowDataOf(conversation);
  const workers = data.locationId
    ? await getWorkersByLocationId(data.locationId)
    : [];

  if (!workers || workers.length === 0) {
    return {
      conversation,
      replyMessage:
        "Lo sentimos, no encontramos barberos disponibles en esta sucursal.",
    };
  }

  const selectedWorker = pickedOptionFromMessage(
    message,
    workers,
    (worker) => `${worker.firstName} ${worker.lastName}`,
  );

  if (!selectedWorker) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildWorkersPrompt(workers),
    };
  }

  const updated = await updateConversation({
    conversationId: conversation.id,
    stage: CONVERSATION_STAGE.AWAITING_DATE,
    data: {
      ...data,
      workerId: selectedWorker.id,
      workerLabel: `${selectedWorker.firstName} ${selectedWorker.lastName}`,
      flowStep: "date",
    },
  });

  const dateOptions = buildDateOptions(DATE_OPTION_COUNT);

  return {
    conversation: updated ?? conversation,
    replyMessage: buildDatesPrompt(dateOptions),
  };
}
