import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { FLOWS } from "../../../bot/constants";
import {
  Business,
  type BusinessMongoType,
} from "../../schemas/businessSchema";

export type CreateBusinessArgs = {
  name: string;
  type: string;
  businessPhone: string;
  phoneNumberId: string;
  service?: Record<string, string>;
  flow?: FLOWS;
};

export default async function createBusiness({
  name,
  type,
  businessPhone,
  phoneNumberId,
  service,
  flow = FLOWS.APPOINTMENT_V1,
}: CreateBusinessArgs): Promise<BusinessMongoType | undefined> {
  const newBusiness = new Business({
    name,
    type,
    businessPhone,
    phoneNumberId,
    service,
    flow,
  });

  try {
    await newBusiness.save();
    console.log(`New business created with name: ${name}`);

    const { _id, __v, ...cleanBusiness } = newBusiness.toObject();

    return cleanBusiness;
  } catch (error) {
    simpleErrorHandling("Error on adding a Business:", error);
  }
}
