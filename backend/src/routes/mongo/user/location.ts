import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import getLocationsByBusinessId from "../../../db/methods/location/getLocationsByBusinessId";

const locationRouter = Router();

// Locations of a business, so the frontend can pick which branch to display in
// the calendar and to know the locationId when creating appointments.
locationRouter.get(
  "/:businessId",
  async (
    req: Request<{ businessId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.params;

    try {
      const locations = await getLocationsByBusinessId(businessId);

      res.status(200).json(locations ?? []);
    } catch (error) {
      next(error);
    }
  },
);

export default locationRouter;
