import { Location } from "../../schemas/locationSchema"
import { Worker } from "../../schemas/workerSchema"

type AddWorkerToLocationArgs = {
  locationId: string,
  workerId: string,
}

export default async function addWorkerToLocation({ locationId, workerId }: AddWorkerToLocationArgs) {
  try {
    const location = await Location.findOneAndUpdate(
      { id: locationId },
      { $addToSet: { workerIds: workerId }},
      { new: true, select: "-_id -__v"}
    )

    if (!location) {
      console.error(`No location found with id: ${locationId}`);
      return null;
    }

    return location.toObject();

  } catch (error) {
    console.error("Error adding worker to location:");
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    }
    
    console.error(error);
    return null;
  }
}