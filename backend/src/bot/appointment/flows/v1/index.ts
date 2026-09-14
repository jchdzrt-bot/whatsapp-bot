import getBusinessByPhoneNumber from "../../../../db/methods/business/getBusinessByPhoneNumber";
import createConversation from "../../../../db/methods/conversation/createConversation";
import getConvByClientPhoneAndBusinessId from "../../../../db/methods/conversation/getConvByClientPhoneAndBusinessId";
import updateConversation from "../../../../db/methods/conversation/updateConversation";
import { CONVERSATION_STAGE } from "../../../../db/schemas/conversationSchema";
import flowDataOf from "./utils/flowDataOf";
import handleConfirmName from "./handles/handleConfirmName";
import handleDateSelection from "./handles/handleDateSelection";
import handleLocationSelection from "./handles/handleLocationSelection";
import handleNameSelection from "./handles/handleNameSelection";
import handleServiceSelection from "./handles/handleServiceSelection";
import handleTimeSelection from "./handles/handleTimeSelection";
import handleWorkerSelection from "./handles/handleWorkerSelection";
import isCancelCommand from "./utils/isCancelCommand";
import isStartCommand from "./utils/isStartCommand";
import askLocation from "./prompts/askLocation";

export default async function appointmentV1({
  businessPhone,
  clientPhone,
  message,
  clientName,
}: AppointmentV1Args): Promise<AppointmentV1Result> {
  const business = await getBusinessByPhoneNumber(businessPhone);

  if (!business) {
    return {
      replyMessage:
        "Lo sentimos, no pudimos identificar el negocio. Intenta mas tarde.",
    };
  }

  let conversation = await getConvByClientPhoneAndBusinessId(
    clientPhone,
    business.id,
  );

  if (!conversation) {
    conversation = await createConversation({
      businessId: business.id,
      clientPhone,
    });
  }

  if (!conversation) {
    return {
      replyMessage:
        "Lo sentimos, tuvimos un problema al iniciar tu conversacion. Intenta de nuevo.",
    };
  }

  const normalizedMessage = message.trim();

  if (isCancelCommand(normalizedMessage)) {
    const updated = await updateConversation({
      conversationId: conversation.id,
      stage: CONVERSATION_STAGE.IDLE,
      data: {},
    });

    return {
      conversation: updated ?? conversation,
      replyMessage:
        "Has cancelado el proceso. Si quieres agendar una cita, responde 'agendar'.",
    };
  }

  const flowStep = flowDataOf(conversation).flowStep;

  switch (flowStep) {
    case "location":
      return handleLocationSelection(business, conversation, normalizedMessage);
    case "service":
      return handleServiceSelection(business, conversation, normalizedMessage);
    case "worker":
      return handleWorkerSelection(conversation, normalizedMessage);
    case "date":
      return handleDateSelection(conversation, normalizedMessage);
    case "time":
      return handleTimeSelection(conversation, normalizedMessage);
    case "name":
      return handleNameSelection(conversation, normalizedMessage);
    case "confirm_name":
      return handleConfirmName(business, conversation, normalizedMessage);
    default:
      if (conversation.stage === CONVERSATION_STAGE.CONFIRMED) {
        if (!isStartCommand(normalizedMessage)) {
          return {
            conversation,
            replyMessage:
              "Ya tienes una cita agendada. Si quieres agendar otra, responde 'agendar'.",
          };
        }

        const updated = await updateConversation({
          conversationId: conversation.id,
          stage: CONVERSATION_STAGE.IDLE,
          data: {},
        });

        return askLocation(business, updated ?? conversation, clientName);
      }

      return askLocation(business, conversation, clientName);
  }
}
