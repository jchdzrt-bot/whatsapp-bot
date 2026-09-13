import { type ConversationMongoType } from "../../../../../db/schemas/conversationSchema";

export default function flowDataOf(conversation: ConversationMongoType): FlowData {
  return (conversation.data ?? {}) as FlowData;
}