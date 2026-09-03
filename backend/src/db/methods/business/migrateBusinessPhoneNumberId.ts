import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

type MigrateBusinessPhoneNumberIdArgs = {
  businessId: string;
  phoneNumberId: string;
};

export default async function migrateBusinessPhoneNumberId({
  businessId,
  phoneNumberId,
}: MigrateBusinessPhoneNumberIdArgs): Promise<
  BusinessMongoType | NullOrUndefined
> {
  try {
    const business = await Business.findOneAndUpdate(
      { id: businessId },
      { $set: { phoneNumberId } },
      { new: true },
    );

    if (!business) {
      console.error(`No business found with id: ${businessId}`);
      return null;
    }

    return business.toObject();
  } catch (error) {
    simpleErrorHandling(
      `Error on migrating the phoneNumberId for business id: ${businessId}`,
      error,
    );
  }
}
