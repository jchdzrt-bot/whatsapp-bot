import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import getLocationsByBusinessId from "../../../../../db/methods/location/getLocationsByBusinessId";
import { type BusinessMongoType } from "../../../../../db/schemas/businessSchema";
import { CONVERSATION_STAGE, type ConversationMongoType } from "../../../../../db/schemas/conversationSchema";
import flowDataOf from "../utils/flowDataOf";
import buildLocationsPrompt from "./buildLocationsPrompt";

export default async function askLocation(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
  clientName?: string,
): Promise<AppointmentV1Result> {
  const locations = await getLocationsByBusinessId(business.id);

  if (!locations || locations.length === 0) {
    return {
      conversation,
      replyMessage:
        "Lo sentimos, por ahora no tenemos sucursales disponibles. Intenta mas tarde.",
    };
  }

  const greeting = clientName
    ? `Hola ${clientName}! Bienvenido a ${business.name}.`
    : `Bienvenido a ${business.name}.`;

  const updated = await updateConversation({
    conversationId: conversation.id,
    // The enum has no location stage, so AWAITING_SERVICE is reused for the
    // first data-collection step. The exact step lives in data.flowStep.
    stage: CONVERSATION_STAGE.AWAITING_SERVICE,
    data: { ...flowDataOf(conversation), flowStep: "location" },
  });

  return {
    conversation: updated ?? conversation,
    replyMessage: [greeting, "", buildLocationsPrompt(locations)].join("\n"),
  };
}