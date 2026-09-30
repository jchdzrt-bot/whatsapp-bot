import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import getWorkersByLocationId from "../../../db/methods/worker/getWorkersByLocationId";

const workerRouter = Router();

// Workers of a location, so the frontend can display worker names on the
// calendar chips and offer real worker options in the "Nueva cita" modal.
workerRouter.get(
  "/:locationId",
  async (
    req: Request<{ locationId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { locationId } = req.params;

    try {
      const workers = await getWorkersByLocationId(locationId);

      res.status(200).json(workers ?? []);
    } catch (error) {
      next(error);
    }
  },
);

export default workerRouter;
