import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getAllBusinesses(): Promise<BusinessMongoType[] | undefined> {
  try {
    const businesses = await Business.find().select("-_id -__v");

    return businesses;
  } catch (error) {
    console.error("Error on getting all the businesses");

    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    }

    console.error(error);
  }
}
