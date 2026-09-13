import getWorkersByLocationId from "../../../../../db/methods/worker/getWorkersByLocationId";
import { type ConversationMongoType } from "../../../../../db/schemas/conversationSchema";
import flowDataOf from "../utils/flowDataOf";
import buildWorkersPrompt from "./buildWorkersPrompt";

export default async function askWorker(
  conversation: ConversationMongoType,
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

  return { conversation, replyMessage: buildWorkersPrompt(workers) };
}
