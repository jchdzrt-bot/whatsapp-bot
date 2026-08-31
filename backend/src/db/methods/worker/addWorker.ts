import addWorkerToLocation from "../location/addWorkerToLocation";
import createWorker, { type CreateWorkerArgs } from "./createWorker";

type AddWorkerArgs = CreateWorkerArgs;

export default async function addWorker({
  locationId,
  firstName,
  lastName,
  services = [],
  workingHours,
}: AddWorkerArgs) {
  const worker = await createWorker({
    locationId,
    firstName,
    lastName,
    services,
    workingHours
  });

  let location = null;

  if (worker) {
    location = await addWorkerToLocation({ locationId, workerId: worker.id });
  }

  return {
    worker,
    location
  }
}
