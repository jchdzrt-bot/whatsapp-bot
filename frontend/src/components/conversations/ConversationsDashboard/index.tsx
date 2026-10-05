import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { breakpoints, tokens } from "../../tokens";
import type {
  Conversation,
  ConversationTint,
  Message,
} from "../data";
import ConversationList from "../ConversationList";
import ConversationPane from "../ConversationPane";
import { getConversations, sendMessage } from "../../../api/conversations";
import type { ConversationWithMessages } from "../../../api/types";
import { useAppSelector } from "../../../store/hooks";
import { formatClockTime } from "../../appointments/dateUtils";

/** Visually hidden heading, mirrors the `sr-only` h2 in the design mockup. */
const srOnlySx = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

const TINTS: ConversationTint[] = ["violet", "aqua", "coral", "muted"];

/**
 * App shell chrome stacked above this page on phones: business header row +
 * section nav. Kept in sync with the Home shell so the chat fills the fold.
 */
const MOBILE_CHROME_PX = 108;

/** Initials for the avatar: first letters of the first two words. */
function initialsFrom(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
  }
  const word = words[0] ?? text;
  return word.slice(0, 2).toUpperCase();
}

/** Deterministic tint per client so a phone always keeps the same color. */
function tintForPhone(phone: string): ConversationTint {
  const digits = phone.replace(/\D/g, "");
  const last = digits.length > 0 ? Number(digits[digits.length - 1]) : 0;
  return TINTS[last % TINTS.length];
}

/** Maps a backend conversation (with thread) to the UI conversation shape. */
function toUiConversation(conversation: ConversationWithMessages): Conversation {
  const flowName = conversation.data?.name;
  const name =
    typeof flowName === "string" && flowName.trim() !== ""
      ? flowName
      : conversation.clientPhone;

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  const messages: Message[] = conversation.messages.map((message) => ({
    id: message.id,
    text: message.body,
    time: formatClockTime(message.createdAt),
    sender: message.direction === "inbound" ? "client" : "business",
  }));

  return {
    id: conversation.id,
    contact: {
      initials: initialsFrom(name),
      name,
      phone: conversation.clientPhone,
    },
    tint: tintForPhone(conversation.clientPhone),
    lastMessage: lastMessage ? lastMessage.body : "",
    lastTime: lastMessage ? formatClockTime(lastMessage.createdAt) : "",
    unread: false,
    botActive: conversation.handledBy === "bot",
    messages,
  };
}

/**
 * Conversations (Chat) page. The conversation list and message threads come
 * from the backend /conversation endpoint; sending a message persists an
 * outbound message on the conversation.
 */
export default function ConversationsDashboard() {
  const businessId = useAppSelector((state) => state.auth.user?.businessId);

  // Phones/compact viewports show only the list first and open a conversation
  // full-screen; wider screens show list + thread side by side (like WhatsApp).
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobileMax})`);
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  // On phones: true while a selected conversation's thread is shown full-screen.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      console.log("[conversations:ui] No businessId in the auth store — skipping fetch");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    console.log(`[conversations:ui] Fetching conversations for businessId=${businessId}`);
    getConversations(businessId)
      .then((data) => {
        if (cancelled) return;
        // Never assume the wire shape: guard before mapping to UI rows.
        const ui = (Array.isArray(data) ? data : []).map(toUiConversation);
        console.log(
          `[conversations:ui] businessId=${businessId} — received ${Array.isArray(data) ? data.length : "n/a"} raw conversation(s), mapped ${ui.length} UI row(s). First ids: ${ui.slice(0, 5).map((c) => c.id).join(", ") || "(none)"}`,
        );
        setConversations(ui);
        // On phones the first screen is the list, so do not auto-open a thread.
        setSelectedId((current) => current || (isMobileRef.current ? "" : ui[0]?.id || ""));
        if (ui.length > 0) {
          const first = ui[0];
          console.log(
            `[conversations:ui] Auto-selected "${first.contact.name}" (${first.id}) with ${first.messages.length} message(s)`,
          );
        } else {
          console.log("[conversations:ui] No conversations to select — list is empty");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(
            `[conversations:ui] businessId=${businessId} — fetch FAILED`,
            error,
          );
          setError("No se pudieron cargar las conversaciones.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const selected =
    conversations.find((conversation) => conversation.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setMobileOpen(true);
    // Opening a conversation does not clear unread state — the backend has no
    // read-tracking yet, so unread dots never appear.
  };

  // Widening a portrait view is handled like "back to list": the side-by-side
  // layout replaces the full-screen thread.
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  // Auto-select the first conversation when the layout widens and nothing is
  // open yet (mirrors the desktop behavior at load time).
  useEffect(() => {
    if (!isMobile && selectedId === "" && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [isMobile, selectedId, conversations]);

  const handleBack = () => setMobileOpen(false);

  const handleSendMessage = async (text: string) => {
    if (!selectedId) return;
    try {
      const message = await sendMessage(selectedId, text);
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== selectedId) return conversation;

          const uiMessage: Message = {
            id: message.id,
            text: message.body,
            time: formatClockTime(message.createdAt),
            sender: "business",
          };

          return {
            ...conversation,
            lastMessage: message.body,
            lastTime: uiMessage.time,
            messages: [...conversation.messages, uiMessage],
          };
        }),
      );
    } catch {
      setError("No se pudo enviar el mensaje.");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: tokens.color.surface1,
        overflow: "hidden",
        display: "grid",
        // Phones: full-bleed screen filling the viewport below the shell chrome;
        // wider screens keep the bordered card with list + thread side by side.
        height: isMobile ? `calc(100dvh - ${MOBILE_CHROME_PX}px)` : undefined,
        minHeight: isMobile ? 0 : 480,
        gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
        borderRadius: isMobile ? 0 : `${tokens.radius.card}px`,
        border: isMobile ? "none" : `0.5px solid ${tokens.color.border}`,
      }}
    >
      <Box component="h2" sx={srOnlySx}>
        Conversaciones: lista de chats de clientes y conversación abierta con mensajes
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gridColumn: "1 / -1", py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : error && conversations.length === 0 ? (
        <Typography
          sx={{
            gridColumn: "1 / -1",
            p: 3,
            fontSize: 13,
            color: tokens.color.dangerText,
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      ) : isMobile ? (
        mobileOpen && selected ? (
          <ConversationPane
            conversation={selected}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        ) : (
          <ConversationList
            mobile
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        )
      ) : (
        <>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
          <ConversationPane
            conversation={selected}
            onSendMessage={handleSendMessage}
          />
        </>
      )}
    </Paper>
  );
}
