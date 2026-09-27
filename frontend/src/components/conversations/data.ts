/**
 * Mock data for the conversations page.
 *
 * Ported from notes/design/conversations_page.html. Intentionally static — no
 * redux and no backend calls yet. It will be replaced with real API/selector
 * data once the store wiring exists.
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

export const initialConversations: Conversation[] = [
  {
    id: "juan-perez",
    contact: { initials: "JP", name: "Juan Pérez", phone: "+52 55 1234 5678" },
    tint: "violet",
    lastMessage: "Perfecto, ahí estaré",
    lastTime: "10:42",
    unread: false,
    botActive: true,
    messages: [
      { id: "j1", text: "Hola! Quiero agendar una cita", time: "10:38", sender: "client" },
      { id: "j2", text: "¡Claro! ¿Qué servicio necesitas?", time: "10:38", sender: "business", isBot: true },
      { id: "j3", text: "Corte de cabello", time: "10:39", sender: "client" },
      { id: "j4", text: "Perfecto, ¿qué día te gustaría venir?", time: "10:39", sender: "business", isBot: true },
      { id: "j5", text: "Perfecto, ahí estaré", time: "10:42", sender: "client" },
    ],
  },
  {
    id: "maria-lopez",
    contact: { initials: "ML", name: "María López", phone: "+52 55 8765 4321" },
    tint: "aqua",
    lastMessage: "¿Tienen espacio mañana?",
    lastTime: "9:15",
    unread: true,
    botActive: true,
    messages: [
      { id: "m1", text: "¿Tienen espacio mañana?", time: "9:15", sender: "client" },
    ],
  },
  {
    id: "roberto-sanchez",
    contact: { initials: "RS", name: "Roberto Sánchez", phone: "+52 55 2345 6789" },
    tint: "muted",
    lastMessage: "Gracias, nos vemos el jueves",
    lastTime: "Ayer",
    unread: false,
    botActive: true,
    messages: [
      { id: "r1", text: "Gracias, nos vemos el jueves", time: "Ayer", sender: "client" },
    ],
  },
  {
    id: "carla-vega",
    contact: { initials: "CV", name: "Carla Vega", phone: "+52 55 9876 5432" },
    tint: "coral",
    lastMessage: "Hola, quiero agendar una cita",
    lastTime: "Lun",
    unread: false,
    botActive: true,
    messages: [
      { id: "c1", text: "Hola, quiero agendar una cita", time: "Lun", sender: "client" },
    ],
  },
];

/** Fresh copy of the mock data so the dashboard can hold mutable local state. */
export function cloneConversations(): Conversation[] {
  return initialConversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message })),
  }));
}