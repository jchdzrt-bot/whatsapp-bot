import updateConversation from "../../../../../db/methods/conversation/updateConversation";
import {
  CONVERSATION_STAGE,
  type ConversationMongoType,
} from "../../../../../db/schemas/conversationSchema";
import { DATE_OPTION_COUNT, DEFAULT_DURATION_MINUTES, INVALID_OPTION_MESSAGE } from "../constants";
import buildDateOptions from "../utils/buildDateOptions";
import buildTimeSlots from "../utils/buildTimeSlots";
import flowDataOf from "../utils/flowDataOf";
import buildDatesPrompt from "../prompts/buildDatesPrompt";
import buildTimesPrompt from "../prompts/buildTimesPrompt";
import strictNumberSelection from "../utils/strictNumberSelection";

export default async function handleDateSelection(
  conversation: ConversationMongoType,
  message: string,
): Promise<AppointmentV1Result> {
  const data = flowDataOf(conversation);
  const dateOptions = buildDateOptions(DATE_OPTION_COUNT);

  const selectedIndex = strictNumberSelection(message, dateOptions.length);

  if (selectedIndex === undefined) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildDatesPrompt(dateOptions),
    };
  }

  const selectedDate = dateOptions[selectedIndex];

  if (!selectedDate) {
    return {
      conversation,
      replyMessage: INVALID_OPTION_MESSAGE + buildDatesPrompt(dateOptions),
    };
  }

  const updated = await updateConversation({
    conversationId: conversation.id,
    stage: CONVERSATION_STAGE.AWAITING_TIME,
    data: {
      ...data,
      date: selectedDate.date,
      dateLabel: selectedDate.label,
      flowStep: "time",
    },
  });

  const timeSlots = buildTimeSlots(
    data.durationMinutes ?? DEFAULT_DURATION_MINUTES,
  );

  return {
    conversation: updated ?? conversation,
    replyMessage: buildTimesPrompt(timeSlots),
  };
}
