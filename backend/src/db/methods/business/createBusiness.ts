import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Business,
  FLOWS,
  type BusinessMongoType,
} from "../../schemas/businessSchema";

export type CreateBusinessArgs = {
  name: string;
  type: string;
  businessPhone: string;
  phoneNumberId: string;
  flow?: FLOWS;
};

export default async function createBusiness({
  name,
  type,
  businessPhone,
  phoneNumberId,
  flow = FLOWS.APPOINTMENT_V1,
}: CreateBusinessArgs): Promise<BusinessMongoType | undefined> {
  const newBusiness = new Business({
    name,
    type,
    businessPhone,
    phoneNumberId,
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
