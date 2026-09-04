import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

type AddLocationToBusinessArgs = {
  businessId: string;
  locationId: string;
};

export default async function addLocationToBusiness({
  businessId,
  locationId,
}: AddLocationToBusinessArgs): Promise<BusinessMongoType | NullOrUndefined> {
  try {
    const business = await Business.findOneAndUpdate(
      { id: businessId },
      { $addToSet: { locationIds: locationId } },
      { new: true, select: "-_id -__v", timestamps: true },
    );

    if (!business) {
      console.error(`No business found with id: ${businessId}`);
      return null;
    }

    return business.toObject();
  } catch (error) {
    simpleErrorHandling("Error adding location to business:", error);
  }
}
