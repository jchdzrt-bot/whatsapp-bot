import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import getLocationsByBusinessId from "../../../../../db/methods/location/getLocationsByBusinessId";
import { type BusinessMongoType } from "../../../../../db/schemas/businessSchema";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import { INVALID_OPTION_MESSAGE } from "../constants";
import flowDataOf from "../utils/flowDataOf";
import pickedOptionFromMessage from "../utils/pickedOptionFromMessage";
import askService from "../prompts/askService";
import buildLocationsPrompt from "../prompts/buildLocationsPrompt";

export default async function handleLocationSelection(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const locations = await getLocationsByBusinessId(business.id);

  if (!locations || locations.length === 0) {
    return {
      conversation,
      replyMessage:
        "Lo sentimos, por ahora no tenemos sucursales disponibles. Intenta mas tarde.",
    };
  }

  const selectedLocation = pickedOptionFromMessage(
    message,
    locations,
    (location) => location.name,
  );

  if (!selectedLocation) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildLocationsPrompt(locations),
    };
  }

  const updated = await updateConversation({
    conversationId: conversation.id,
    stage: CONVERSATION_STAGE.AWAITING_SERVICE,
    data: {
      ...flowDataOf(conversation),
      locationId: selectedLocation.id,
      locationLabel: selectedLocation.name,
      flowStep: "service",
    },
  });

  return askService(business, updated ?? conversation);
}
