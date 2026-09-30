import { apiCall } from "./apiCall";
import type { ConversationWithMessages, Message } from "./types";

/** All conversations (with their message threads) for a business. */
export async function getConversations(
  businessId: string,
): Promise<ConversationWithMessages[]> {
  const data = await apiCall<ConversationWithMessages[]>({
    method: "GET",
    url: "/conversation",
    params: { businessId },
  });
  // Same hardening as the other list endpoints: never trust the wire shape.
  return Array.isArray(data) ? data : [];
}

/** Persists a manual reply as an outbound message on the conversation. */
export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<Message> {
  return apiCall<Message>({
    method: "POST",
    url: `/conversation/${conversationId}/message`,
    data: { body },
  });
}
