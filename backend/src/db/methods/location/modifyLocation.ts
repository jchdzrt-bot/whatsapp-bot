import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";
import { Location, type LocationMongoType } from "../../schemas/locationSchema";

export type ModifyLocationArgs = Loosen<{
  name?: string;
  address?: string;
  workerIds?: string[];
  openHours?: WeeklyHours;
}> & { locationId: string };

export default async function modifyLocation({
  locationId,
  name,
  address,
  workerIds,
  openHours,
}: ModifyLocationArgs): Promise<LocationMongoType | NullOrUndefined> {
  const updateFields = filterOutUndefinedProperties({
    name,
    address,
    workerIds,
    openHours,
  });

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields provided to update");
  }

  try {
    const location = await Location.findOneAndUpdate(
      { id: locationId },
      { $set: updateFields },
      { new: true },
    );

    if (!location) {
      console.error(`No location found with id: ${locationId}`);
      return null;
    }

    return location.toObject();
  } catch (error) {
    simpleErrorHandling("Error modifying location:", error);
  }
}
