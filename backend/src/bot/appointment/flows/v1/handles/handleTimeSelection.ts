import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import {
  DEFAULT_DURATION_MINUTES,
  INVALID_OPTION_MESSAGE,
} from "../constants";
import addMinutesToTime from "../utils/addMinutesToTime";
import buildTimeSlots from "../utils/buildTimeSlots";
import flowDataOf from "../utils/flowDataOf";
import formatSpanishTime from "../utils/formSpanishTime";
import buildNamePrompt from "../prompts/buildNamePrompt";
import buildTimesPrompt from "../prompts/buildTimesPrompt";
import strictNumberSelection from "../utils/strictNumberSelection";

export default async function handleTimeSelection(
  conversation: ConversationMongoType,
  message: string,
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

  const updated = await updateConversation({
    conversationId: conversation.id,
    // The stage stays AWAITING_TIME; the name is the last detail before the
    // appointment is created and the stage becomes CONFIRMED.
    stage: CONVERSATION_STAGE.AWAITING_TIME,
    data: {
      ...data,
      time: selectedTime,
      timeLabel: formatSpanishTime(selectedTime),
      timeEndLabel: formatSpanishTime(
        addMinutesToTime(selectedTime, durationMinutes),
      ),
      flowStep: "name",
    },
  });

  return {
    conversation: updated ?? conversation,
    replyMessage: buildNamePrompt(),
  };
}
