import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export type CreateBusinessArgs = {
  name: string;
  type: string;
  phoneNumberId: string;
};

export default async function createBusiness({
  name,
  type,
  phoneNumberId,
}: CreateBusinessArgs): Promise<BusinessMongoType | undefined> {
  const newBusiness = new Business({
    name,
    type,
    phoneNumberId,
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
