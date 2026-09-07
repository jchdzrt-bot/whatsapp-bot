import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createConversation, {
  type CreateConversationArgs,
} from "../../db/methods/conversation/createConversation";
import updateConversation, {
  UpdateConversationArgs,
} from "../../db/methods/conversation/updateConversation";
import filterOutUndefinedProperties from "../../utils/object/filterOutUndefinedProperties";

const conversationRouter = Router();

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

      res.status(200).json({ conversation });
    } catch (error) {
      next(error);
    }
  },
);

export default conversationRouter;
