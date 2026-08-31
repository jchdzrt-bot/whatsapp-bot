import addLocationToBusiness from "../business/addLocationToBusiness";
import createLocation, { type CreateLocationArgs } from "./createLocation";

type AddLocationArgs = CreateLocationArgs;

export default async function addLocation({
  businessId,
  name,
  address,
  workerIds = [],
  openHours,
}: AddLocationArgs) {
  const location = await createLocation({
    businessId,
    name,
    address,
    workerIds,
    openHours,
  });

  let business = null;

  if (location) {
    business = await addLocationToBusiness({ businessId, locationId: location.id });
  }

  return {
    location,
    business,
  }
}
