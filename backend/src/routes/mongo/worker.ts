import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import addWorker from "../../db/methods/worker/addWorker";
import { type CreateWorkerArgs } from "../../db/methods/worker/createWorker";

const workerRouter = Router();

workerRouter.post(
  "",
  async (
    req: Request<{}, {}, CreateWorkerArgs>,
    res: Response,
    next: NextFunction,
  ) => {
    const { locationId, firstName, lastName, services, workingHours } =
      req.body;

    if (!locationId || !firstName || !lastName || !workingHours) {
      return res.status(400).json({
        error:
          "locationId, firstname, lastName and workingHours are all required",
      });
    }

    try {
      const worker = addWorker({
        locationId,
        firstName,
        lastName,
        services: services ?? [],
        workingHours,
      });

      res.status(201).json(worker);
    } catch (error) {
      next(error);
    }
  },
);

export default workerRouter;
