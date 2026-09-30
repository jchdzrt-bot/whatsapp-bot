import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import getBusinessById from "../../../db/methods/business/getBusinessById";

const businessRouter = Router();

// Business data for the frontend dashboard (shop header + service list for new
// appointments). The caller is expected to be the business' own authenticated
// user; the backend trusts the accessToken cookie claims.
businessRouter.get(
  "/:businessId",
  async (
    req: Request<{ businessId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.params;

    try {
      const business = await getBusinessById(businessId);

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

export default businessRouter;
