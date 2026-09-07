import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getBusinessByPhoneNumber(
  phoneNumber: string,
): Promise<BusinessMongoType | NullOrUndefined> {
  try {
    const business = await Business.findOne(
      { phoneNumber },
      "-_id -__v",
    );

    if (!business) {
      console.error(`No business found with phoneNumber: ${phoneNumber}`);
      return null;
    }

    return business.toObject();
  } catch (error) {
    simpleErrorHandling(
      `Error fetching business by phoneNumber: ${phoneNumber}`,
      error,
    );
  }
}
