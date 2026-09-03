import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import { Business, type BusinessMongoType } from "../../schemas/businessSchema";

export default async function getAllBusinesses(): Promise<
  BusinessMongoType[] | undefined
> {
  try {
    const businesses = await Business.find().select("-_id -__v");

    return businesses;
  } catch (error) {
    simpleErrorHandling("Error on getting all the businesses", error);
  }
}
