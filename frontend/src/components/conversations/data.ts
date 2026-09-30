/**
 * UI types for the conversations (Chat) page.
 *
 * All mock/sample conversations were removed — the page is fed by the backend
 * /conversation list endpoint.
 */

export type ConversationTint = "violet" | "aqua" | "coral" | "muted";

export interface Contact {
  initials: string;
  name: string;
  phone: string;
}

export type MessageSender = "client" | "business";

export interface Message {
  id: string;
  text: string;
  time: string;
  sender: MessageSender;
  /** True when the message was produced by the bot (shows the robot glyph). */
  isBot?: boolean;
}

export interface Conversation {
  id: string;
  contact: Contact;
  tint: ConversationTint;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  botActive: boolean;
  messages: Message[];
}
