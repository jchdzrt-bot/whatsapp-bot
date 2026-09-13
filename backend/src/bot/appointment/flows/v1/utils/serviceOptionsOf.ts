import { type BusinessMongoType } from "../../../../../db/schemas/businessSchema";

export type ServiceOption = {
  name: string;
  duration: string;
};

export default function serviceOptionsOf(
  business: BusinessMongoType,
): ServiceOption[] {
  return Object.entries(business.service ?? {}).map(([name, duration]) => ({
    name,
    duration,
  }));
}