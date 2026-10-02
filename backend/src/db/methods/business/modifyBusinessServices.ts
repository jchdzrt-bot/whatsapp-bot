import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

type ModifyBusinessServicesArgs = {
  businessId: string;
  service: Record<string, string>;
};

export default async function modifyBusinessServices({
  businessId,
  service,
}: ModifyBusinessServicesArgs): Promise<BusinessMongoType | NullOrUndefined> {
  try {
    const business = await Business.findOneAndUpdate(
      { id: businessId },
      { $set: { service } },
      { new: true, select: "-_id -__v", timestamps: true },
    );

    if (!business) {
      console.error(`No business found with id: ${businessId}`);
      return null;
    }

    const cleanBusiness = business.toObject();

    // Same normalization as the getters: `service` is always exposed as a map,
    // even when the stored document predates the field.
    return { ...cleanBusiness, service: cleanBusiness.service ?? {} };
  } catch (error) {
    simpleErrorHandling(
      `Error updating services for business id: ${businessId}`,
      error,
    );
  }
}