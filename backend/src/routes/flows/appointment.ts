import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import appointmentV1 from "../../bot/appointment/flows/v1";

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
      const { replyMessage, conversation, appointment } = await appointmentV1({
        businessPhone,
        clientPhone,
        message,
        ...(clientName ? { clientName } : {}),
      });

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