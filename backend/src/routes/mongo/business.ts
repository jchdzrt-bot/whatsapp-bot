import { type NextFunction, Router, type Request, type Response } from "express";
import createBusiness, {
  type CreateBusinessArgs,
} from "../../db/methods/business/createBusiness";
import addLocationToBusiness from "../../db/methods/business/addLocationToBusiness";

const businessRouter = Router();

businessRouter.post(
  "",
  async (req: Request<{}, {}, CreateBusinessArgs>, res: Response, next: NextFunction) => {
    const { name, type, phoneNumberId } = req.body;

    if (!name || !type || !phoneNumberId) {
      return res.status(400).json({
        error: "name, type, and phoneNumberId are all required",
      });
    }

    try {
      const business = await createBusiness({ name, type, phoneNumberId });
      
      res.status(201).json(business);
    } catch (error) {
      next(error);
    }
  },
);

businessRouter.patch(
  "/:businessId/locations",
  async (
    req: Request<{ businessId: string }, {}, { locationId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.params;
    const { locationId } = req.body;

    if (!locationId) {
      return res.status(400).json({ error: "locationId is required" });
    }

    try {
      const business = await addLocationToBusiness({ businessId, locationId });

      if (!business) {
        return res
          .status(404)
          .json({ error: `No business found with id: ${businessId}` });
      }

      res.status(200).json(business);
    } catch (error) {
      next(error);
    }
  },
);
