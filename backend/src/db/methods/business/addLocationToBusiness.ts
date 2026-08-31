import { Business, type BusinessMongoType } from "../../schemas/businessSchema"

type AddLocationToBusinessArgs = {
  businessId: string,
  locationId: string,
}

export default async function addLocationToBusiness({
  businessId,
  locationId,
}: AddLocationToBusinessArgs): Promise<BusinessMongoType | null> {
  try {
    const business = await Business.findOneAndUpdate(
      { id: businessId },
      { $addToSet: { locationIds: locationId } },
      { new: true, select: "-_id -__v" }
    );

    if (!business) {
      console.error(`No business found with id: ${businessId}`);
      return null;
    }

    return business.toObject();
  } catch (error) {
    console.error("Error adding location to business:");
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    }
    
    console.error(error);
    return null;
  }
}