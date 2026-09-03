import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Location, type LocationMongoType } from "../../schemas/locationSchema";

export type CreateLocationArgs = Omit<LocationMongoType, "id" | "workerIds"> & {
  workerIds?: string[];
};

export default async function createLocation({
  businessId,
  name,
  address,
  workerIds = [],
  openHours,
}: CreateLocationArgs): Promise<LocationMongoType | undefined> {
  const newLocation = new Location({
    businessId,
    name,
    address,
    workerIds,
    openHours,
  });

  try {
    await newLocation.save();
    console.log(`New location created with name: ${name}`);

    const { _id, __v, ...cleanLocation } = newLocation.toObject();

    return cleanLocation;
  } catch (error) {
    simpleErrorHandling("Error on adding a Location:", error);
  }
}
