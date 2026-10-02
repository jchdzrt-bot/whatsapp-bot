import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getBusinessByPhoneNumber(
  phoneNumber: string,
): Promise<BusinessMongoType | NullOrUndefined> {
  try {
    const business = await Business.findOne(
      { businessPhone: phoneNumber },
      "-_id -__v",
    );

    if (!business) {
      console.error(`No business found with phoneNumber: ${phoneNumber}`);
      return null;
    }

    const cleanBusiness = business.toObject();

    // Legacy documents created before the `service` map existed (or stored with
    // it as null) don't get the schema default back on hydration. Keep the API
    // contract stable: `service` is always an object.
    return { ...cleanBusiness, service: cleanBusiness.service ?? {} };
  } catch (error) {
    simpleErrorHandling(
      `Error fetching business by phoneNumber: ${phoneNumber}`,
      error,
    );
  }
}
