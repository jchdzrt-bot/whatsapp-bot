import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Conversation,
  CONVERSATION_HANDLER,
  CONVERSATION_STAGE,
  ConversationMongoType,
} from "../../schemas/conversationSchema";

type MongoGenerated = "id" | "createdAt" | "updatedAt";

export type CreateConversationArgs = Omit<
  ConversationMongoType,
  MongoGenerated | "stage" | "handledBy" | "data"
> & {
  stage?: CONVERSATION_STAGE;
  handledBy?: CONVERSATION_HANDLER;
  data?: Record<string, unknown>;
};

export default async function createConversation({
  businessId,
  clientPhone,
  stage =  CONVERSATION_STAGE.IDLE,
  handledBy = CONVERSATION_HANDLER.BOT,
  data,
}: CreateConversationArgs): Promise<ConversationMongoType | undefined> {
  const existing = await Conversation.findOne({ businessId, clientPhone });

  if (existing) {
    throw new Error(
      `A conversation already exists for phoneNumber ${clientPhone} on business ${businessId}`,
    );
  }

  const newConversation = new Conversation({
    businessId,
    clientPhone,
    stage,
    handledBy,
    data,
  });

  try {
    await newConversation.save();
    console.log(
      `New conversation created for ${clientPhone} on business ${businessId}`,
    );

    const { _id, __v, ...cleanConversation } = newConversation.toObject();

    return cleanConversation;
  } catch (error) {
    simpleErrorHandling(
      `Error creating conversation for ${clientPhone} on business ${businessId}`,
      error,
    );
  }
}
