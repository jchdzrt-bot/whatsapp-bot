import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getBusinessById(
  businessId: string,
): Promise<BusinessMongoType | NullOrUndefined> {
  try {
    const business = await Business.findOne(
      { id: businessId },
      "-_id -__v",
    );

    if (!business) {
      console.error(`No business found with id: ${businessId}`);
      return null;
    }

    return business.toObject();
  } catch (error) {
    simpleErrorHandling(
      `Error fetching business by id: ${businessId}`,
      error,
    );
  }
}