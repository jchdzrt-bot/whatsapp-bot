import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Location, type LocationMongoType } from "../../schemas/locationSchema";

export default async function getLocationsByBusinessId(
  businessId: string,
): Promise<LocationMongoType[] | undefined> {
  try {
    const locations = await Location.find({ businessId }).select("-_id -__v");
    return locations;
  } catch (error) {
    simpleErrorHandling(
      `Error getting locations for businessId: ${businessId}`,
      error,
    );
  }
}