import { apiCall } from "./apiCall";
import type { ConversationWithMessages, Message } from "./types";

/** All conversations (with their message threads) for a business. */
export async function getConversations(
  businessId: string,
): Promise<ConversationWithMessages[]> {
  console.log(`[conversations] GET /conversation?businessId=${businessId} — sending request`);

  try {
    const data = await apiCall<ConversationWithMessages[]>({
      method: "GET",
      url: "/conversation",
      params: { businessId },
    });

    console.log(
      `[conversations] GET /conversation?businessId=${businessId} — response OK, ${Array.isArray(data) ? data.length : "n/a"} conversation(s) in payload`,
    );

    // Same hardening as the other list endpoints: never trust the wire shape.
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      `[conversations] GET /conversation?businessId=${businessId} — request FAILED`,
      error,
    );
    throw error;
  }
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
