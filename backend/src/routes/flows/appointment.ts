import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import appointmentV1 from "../../bot/appointment/flows/v1";
import addMessage from "../../db/methods/message/addMessage";
import {
  MESSAGE_DIRECTION,
  MESSAGE_STATUS,
} from "../../db/schemas/messageSchema";

const appointmentRouter = Router();

// Test route to mock a client interacting with the appointmentV1 flow.
// Each request sends the client's message and the flow responds with the
// bot's reply plus the current conversation state. Keeping the same
// clientPhone across requests continues the same conversation.
appointmentRouter.post(
  "/v1",
  async (
    req: Request<{}, {}, AppointmentV1Args>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessPhone, clientPhone, message, clientName } = req.body;

    if (!businessPhone || !clientPhone || !message) {
      return res.status(400).json({
        error: "businessPhone, clientPhone and message are all required",
      });
    }

    try {
      // Persist the client's message on the conversation thread first, so the
      // Chat tab always shows what the client said even if the flow fails
      // afterwards. addMessage resolves the conversation by (clientPhone,
      // businessId), reusing the same one the flow is about to create/update.
      await addMessage({
        businessPhone,
        clientPhone,
        direction: MESSAGE_DIRECTION.INBOUND,
        body: message.trim(),
        whatsappMessageId: `inbound-${crypto.randomUUID()}`,
        status: MESSAGE_STATUS.DELIVERED,
      });

      const { replyMessage, conversation, appointment } = await appointmentV1({
        businessPhone,
        clientPhone,
        message,
        ...(clientName ? { clientName } : {}),
      });

      // Persist the bot's reply as the outbound message so the Chat tab shows
      // the back-and-forth instead of an empty thread.
      if (replyMessage) {
        await addMessage({
          businessPhone,
          clientPhone,
          direction: MESSAGE_DIRECTION.OUTBOUND,
          body: replyMessage,
          whatsappMessageId: `outbound-${crypto.randomUUID()}`,
          status: MESSAGE_STATUS.SENT,
        });
      }

      res.status(200).json({
        replyMessage,
        conversation,
        appointment,
        state: {
          stage: conversation?.stage,
          flowStep: conversation?.data?.flowStep,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default appointmentRouter;