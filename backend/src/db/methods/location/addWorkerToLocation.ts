import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Location, LocationMongoType } from "../../schemas/locationSchema";
import { Worker } from "../../schemas/workerSchema";

type AddWorkerToLocationArgs = {
  locationId: string;
  workerId: string;
};

export default async function addWorkerToLocation({
  locationId,
  workerId,
}: AddWorkerToLocationArgs): Promise<LocationMongoType | NullOrUndefined> {
  try {
    const location = await Location.findOneAndUpdate(
      { id: locationId },
      { $addToSet: { workerIds: workerId } },
      { new: true, select: "-_id -__v", timestamps: true },
    );

    if (!location) {
      console.error(`No location found with id: ${locationId}`);
      return null;
    }

    return location.toObject();
  } catch (error) {
    simpleErrorHandling("Error adding worker to location:", error);
  }
}
