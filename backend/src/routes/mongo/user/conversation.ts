import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createConversation, {
  type CreateConversationArgs,
} from "../../../db/methods/conversation/createConversation";
import getConversationsByBusinessId from "../../../db/methods/conversation/getConversationsByBusinessId";
import updateConversation, {
  UpdateConversationArgs,
} from "../../../db/methods/conversation/updateConversation";
import createMessage from "../../../db/methods/message/createMessage";
import {
  Conversation,
  CONVERSATION_HANDLER,
} from "../../../db/schemas/conversationSchema";
import {
  MESSAGE_DIRECTION,
  MESSAGE_STATUS,
} from "../../../db/schemas/messageSchema";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";

const conversationRouter = Router();

conversationRouter.get(
  "",
  async (
    req: Request<{}, {}, {}, { businessId?: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.query;

    if (!businessId) {
      console.log("[conversations] GET /conversation rejected — businessId is required");
      return res.status(400).json({ error: "businessId is required" });
    }

    console.log(`[conversations] GET /conversation?businessId=${businessId} — handler started`);

    try {
      const conversations = await getConversationsByBusinessId(businessId);

      const conversationCount = Array.isArray(conversations)
        ? conversations.length
        : 0;
      const messageCount = Array.isArray(conversations)
        ? conversations.reduce(
            (total, conversation) => total + (conversation.messages?.length ?? 0),
            0,
          )
        : 0;

      console.log(
        `[conversations] GET /conversation?businessId=${businessId} — returning ${conversationCount} conversation(s) with ${messageCount} total message(s)`,
      );

      res.status(200).json(conversations ?? []);
    } catch (error) {
      console.error(
        `[conversations] GET /conversation?businessId=${businessId} — FAILED`,
        error,
      );
      next(error);
    }
  },
);

conversationRouter.post(
  "",
  async (
    req: Request<{}, {}, CreateConversationArgs>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId, clientPhone } = req.body;

    if (!businessId || !clientPhone) {
      return res.status(400).json({
        error: "businesId and clientPhone are all required",
      });
    }

    try {
      const conversation = await createConversation({
        businessId,
        clientPhone,
      });

      res.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  },
);

// Manually replies to a client from the Chat tab. The message is persisted as
// an outbound message on the conversation's thread. (Actually delivering it to
// WhatsApp is a separate bot/outbound concern; this endpoint records the
// manual reply the same way the webhook records bot messages.)
conversationRouter.post(
  "/:conversationId/message",
  async (
    req: Request<{ conversationId: string }, {}, { body?: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { conversationId } = req.params;
    const { body: messageBody } = req.body;

    if (!messageBody || messageBody.trim() === "") {
      return res.status(400).json({ error: "body is required" });
    }

    try {
      const message = await createMessage({
        conversationId,
        direction: MESSAGE_DIRECTION.OUTBOUND,
        body: messageBody,
        // Manual replies have no Meta message id yet (outbound delivery is not
        // wired), so a stable synthetic id keeps the schema's unique field.
        whatsappMessageId: `manual-${crypto.randomUUID()}`,
        status: MESSAGE_STATUS.SENT,
      });

      if (!message) {
        return res.status(500).json({ error: "Failed to create the message" });
      }

      // A human reply takes over the conversation (mirrors the composer hint)
      // and bumps the conversation so it reorders the chat list.
      await Conversation.updateOne(
        { id: conversationId },
        {
          $set: {
            updatedAt: new Date(),
            handledBy: CONVERSATION_HANDLER.HUMAN,
          },
        },
      );

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  },
);

conversationRouter.patch(
  "/:conversationId",
  async (
    req: Request<
      { conversationId: string },
      {},
      Omit<UpdateConversationArgs, "conversationId">
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { conversationId } = req.params;
    const { stage, handledBy, data } = req.body;

    try {
      const conversation = await updateConversation({
        conversationId,
        ...filterOutUndefinedProperties({ stage, handledBy, data }),
      });

      if (!conversation) {
        return res
          .status(404)
          .json({ error: `No conversation found with id: ${conversationId}` });
      }

      res.status(200).json({ conversation });
    } catch (error) {
      next(error);
    }
  },
);

export default conversationRouter;
