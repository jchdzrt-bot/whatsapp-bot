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
import addMinutesToTime from "../utils/addMinutesToTime";
import buildTimeSlots from "../utils/buildTimeSlots";
import flowDataOf from "../utils/flowDataOf";
import formatSpanishTime from "../utils/formSpanishTime";
import buildConfirmationMessage from "../prompts/buildConfirmationMessage";
import buildTimesPrompt from "../prompts/buildTimesPrompt";
import strictNumberSelection from "../utils/strictNumberSelection";

export default async function handleTimeSelection(
  business: BusinessMongoType,
  conversation: ConversationMongoType,
  message: string,
  clientName?: string,
): Promise<AppointmentV1Result> {
  const data = flowDataOf(conversation);
  const durationMinutes =
    data.durationMinutes ?? DEFAULT_DURATION_MINUTES;
  const timeSlots = buildTimeSlots(durationMinutes);

  const selectedIndex = strictNumberSelection(message, timeSlots.length);

  if (selectedIndex === undefined) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildTimesPrompt(timeSlots),
    };
  }

  const selectedTime = timeSlots[selectedIndex];

  if (!selectedTime || !data.locationId || !data.workerId || !data.date) {
    return {
      conversation,
      replyMessage:
        "Lo sentimos, tu conversacion se perdio. Responde 'cancelar' para empezar de nuevo.",
    };
  }

  try {
    const appointment = await createAppointment({
      businessId: business.id,
      locationId: data.locationId,
      workerId: data.workerId,
      clientPhoneNumber: conversation.clientPhone,
      ...(clientName ? { clientName } : {}),
      service: data.service ?? DEFAULT_SERVICE,
      durationMinutes,
      date: data.date,
      time: selectedTime,
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
      replyMessage: buildConfirmationMessage({
        ...data,
        time: selectedTime,
        timeLabel: formatSpanishTime(selectedTime),
        timeEndLabel: formatSpanishTime(
          addMinutesToTime(selectedTime, durationMinutes),
        ),
      }),
    };
  } catch (error) {
    const isConflict =
      error instanceof Error &&
      error.message.includes("already has an appointment");
    const prompt = isConflict
      ? "Esa hora ya esta reservada. Elige otra:\n\n" +
        buildTimesPrompt(timeSlots)
      : "Lo sentimos, hubo un error al agendar tu cita. Intenta otra vez:\n\n" +
        buildTimesPrompt(timeSlots);

    return { conversation, replyMessage: prompt };
  }
}
