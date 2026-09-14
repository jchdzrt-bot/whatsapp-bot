import createAppointment from "../../../../../db/methods/appointment/createAppointment";
import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import { APPOINTMENT_SOURCE } from "../../../../../db/schemas/appointmentSchema";
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
import buildTimeSlots from "../utils/buildTimeSlots";
import flowDataOf from "../utils/flowDataOf";
import buildConfirmationMessage from "../prompts/buildConfirmationMessage";
import buildConfirmNamePrompt from "../prompts/buildConfirmNamePrompt";
import buildNamePrompt from "../prompts/buildNamePrompt";
import buildTimesPrompt from "../prompts/buildTimesPrompt";

function isAffirmativeAnswer(answer: string): boolean {
  return ["1", "si", "sí", "correcto", "confirmar", "yes"].includes(answer);
}

function isNegativeAnswer(answer: string): boolean {
  return ["2", "no", "incorrecto", "corregir", "mal", "nop"].includes(answer);
}

export default async function handleConfirmName(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const data = flowDataOf(conversation);

  if (
    !data.name ||
    !data.locationId ||
    !data.workerId ||
    !data.date ||
    !data.time
  ) {
    return {
      conversation,
      replyMessage:
        "Lo sentimos, tu conversacion se perdio. Responde 'cancelar' para empezar de nuevo.",
    };
  }

  const answer = message.trim().toLowerCase();

  if (isAffirmativeAnswer(answer)) {
    const durationMinutes =
      data.durationMinutes ?? DEFAULT_DURATION_MINUTES;

    try {
      const appointment = await createAppointment({
        businessId: business.id,
        locationId: data.locationId,
        workerId: data.workerId,
        clientPhoneNumber: conversation.clientPhone,
        clientName: data.name,
        service: data.service ?? DEFAULT_SERVICE,
        durationMinutes,
        date: data.date,
        time: data.time,
        source: APPOINTMENT_SOURCE.BOT,
      });

      if (!appointment) {
        return {
          conversation,
          replyMessage:
            "Lo sentimos, no pudimos agendar tu cita. Intenta de nuevo.",
        };
      }

      const updated = await updateConversation({
        conversationId: conversation.id,
        stage: CONVERSATION_STAGE.CONFIRMED,
        data: {},
      });

      return {
        conversation: updated ?? conversation,
        appointment,
        replyMessage: buildConfirmationMessage(data),
      };
    } catch (error) {
      const isConflict =
        error instanceof Error &&
        error.message.includes("already has an appointment");

      if (isConflict) {
        const updated = await updateConversation({
          conversationId: conversation.id,
          stage: CONVERSATION_STAGE.AWAITING_TIME,
          data: { ...data, flowStep: "time" },
        });

        return {
          conversation: updated ?? conversation,
          replyMessage:
            "Esa hora ya esta reservada. Elige otra:\n\n" +
            buildTimesPrompt(buildTimeSlots(durationMinutes)),
        };
      }

      return {
        conversation,
        replyMessage:
          "Lo sentimos, hubo un error al agendar tu cita. Intenta de nuevo.",
      };
    }
  }

  if (isNegativeAnswer(answer)) {
    const dataWithoutName: FlowData = { ...data };
    delete dataWithoutName.name;

    const updated = await updateConversation({
      conversationId: conversation.id,
      stage: CONVERSATION_STAGE.AWAITING_TIME,
      data: { ...dataWithoutName, flowStep: "name" },
    });

    return {
      conversation: updated ?? conversation,
      replyMessage:
        "Entendido, escribe tu nombre de nuevo.\n\n" + buildNamePrompt(),
    };
  }

  return {
    conversation,
    replyMessage:
      INVALID_OPTION_MESSAGE + buildConfirmNamePrompt(data.name),
  };
}