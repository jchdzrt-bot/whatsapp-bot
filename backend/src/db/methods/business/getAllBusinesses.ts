import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getAllBusinesses(): Promise<
  BusinessMongoType[] | undefined
> {
  try {
    const businesses = await Business.find().select("-_id -__v");

    // Same `service` normalization as getBusinessById/getBusinessByPhoneNumber:
    // never expose a business without a service map, even when the stored
    // document predates the field.
    return businesses.map((business) => {
      const cleanBusiness = business.toObject();
      return { ...cleanBusiness, service: cleanBusiness.service ?? {} };
    });
  } catch (error) {
    simpleErrorHandling("Error on getting all the businesses", error);
  }
}
