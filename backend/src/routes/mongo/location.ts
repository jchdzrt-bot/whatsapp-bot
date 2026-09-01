import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import addLocation from "../../db/methods/location/addLocation";
import { type CreateLocationArgs } from "../../db/methods/location/createLocation";
import addWorkerToLocation from "../../db/methods/location/addWorkerToLocation";

const locationRouter = Router();

locationRouter.post(
  "",
  async (
    req: Request<{}, {}, CreateLocationArgs>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId, name, address, workerIds, openHours } = req.body;

     if (!businessId || !name || !address || !openHours) {
      return res.status(400).json({
        error: "businessId, name, address, and openHours are all required",
      });
    }

    try {
      const { location, business } = await addLocation({
        businessId,
        name,
        address,
        workerIds: workerIds ?? [],
        openHours,
      });

      res.status(201).json({ location, business });
    } catch (error) {
      next(error);
    }
  },
);

locationRouter.patch(
  "/:locationId/workers",
  async (
    req: Request<{ locationId: string }, {}, { workerId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { locationId } = req.params;
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ error: "workerId is required" });
    }

    try {
      const location = await addWorkerToLocation({ locationId, workerId });

      if (!location) {
        return res
          .status(404)
          .json({ error: `No location found with id: ${locationId}` });
      }

      res.status(200).json(location);
    } catch (error) {
      next(error);
    }
  }
)