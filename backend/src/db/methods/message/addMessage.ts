import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { MESSAGE_DIRECTION, MESSAGE_STATUS } from "../../schemas/messageSchema";
import getBusinessByPhoneNumber from "../business/getBusinessByPhoneNumber";
import createConversation from "../conversation/createConversation";
import getConvByClientPhoneAndBusinessId from "../conversation/getConvByClientPhoneAndBusinessId";
import createMessage from "./createMessage";

type AddMessageArgs = {
  businessPhone: string;
  clientPhone: string;
  direction: MESSAGE_DIRECTION;
  body: string;
  whatsappMessageId: string;
  status: MESSAGE_STATUS;
};

export default async function addMessage({
  businessPhone,
  clientPhone,
  direction,
  body,
  whatsappMessageId,
  status,
}: AddMessageArgs) {
  try {
    const business = await getBusinessByPhoneNumber(businessPhone);

    if (!business) {
      console.log(`No business found for businessPhone: ${businessPhone}`);
      return null;
    }

    let conversation = await getConvByClientPhoneAndBusinessId(
      clientPhone,
      business.id,
    );

    if (!conversation) {
      conversation = await createConversation({
        businessId: business.id,
        clientPhone,
      });
    }

    if (!conversation) {
      console.log(`Could not find or create conversation for ${clientPhone}`);
      return null;
    }

    return await createMessage({
      conversationId: conversation.id,
      direction,
      body,
      whatsappMessageId,
      status,
    });
  } catch (error) {
    simpleErrorHandling(`Error in addMessage: `, error);
  }
}
