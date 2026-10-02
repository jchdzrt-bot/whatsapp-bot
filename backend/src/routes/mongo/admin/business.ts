import {
  type NextFunction,
  Router,
  type Request,
  type Response,
} from "express";
import createBusiness, {
  type CreateBusinessArgs,
} from "../../../db/methods/business/createBusiness";
import addLocationToBusiness from "../../../db/methods/business/addLocationToBusiness";
import getAllBusinesses from "../../../db/methods/business/getAllBusinesses";
import migrateBusinessPhoneNumberId from "../../../db/methods/business/migrateBusinessPhoneNumberId";
import modifyBusinessServices from "../../../db/methods/business/modifyBusinessServices";

// The admin routes are used by the admin of the whole app to setup business with their locations and workers.

const admingBusinessRouter = Router();

admingBusinessRouter.get("/all", async (_, res, next) => {
  try {
    const businesses = await getAllBusinesses();

    res.status(200).json(businesses);
  } catch (error) {
    next(error);
  }
});

admingBusinessRouter.post(
  "",
  async (
    req: Request<{}, {}, CreateBusinessArgs>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, type, phoneNumberId, businessPhone, service } = req.body;

    if (!name || !type || !phoneNumberId || !businessPhone) {
      return res.status(400).json({
        error: "name, type, phoneNumberId, and businessPhone are all required",
      });
    }

    try {
      const business = await createBusiness({
        name,
        type,
        phoneNumberId,
        businessPhone,
        ...(service ? { service } : {}),
      });

      res.status(201).json(business);
    } catch (error) {
      next(error);
    }
  },
);

admingBusinessRouter.patch(
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

admingBusinessRouter.patch(
  "/:businessId/phoneNumberId",
  async (
    req: Request<
      { businessId: string },
      {},
      { phoneNumberId: string; businessPhone: string }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.params;
    const { phoneNumberId, businessPhone } = req.body;

    if (!phoneNumberId) {
      return res.status(400).json({ error: "phoneNumberId is required" });
    }

    try {
      const business = await migrateBusinessPhoneNumberId({
        businessId,
        phoneNumberId,
        businessPhone,
      });

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

admingBusinessRouter.patch(
  "/:businessId/service",
  async (
    req: Request<
      { businessId: string },
      {},
      { service: Record<string, string> }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { businessId } = req.params;
    const { service } = req.body;

    if (!service || typeof service !== "object" || Array.isArray(service)) {
      return res
        .status(400)
        .json({ error: "service must be an object of name → duration pairs" });
    }

    const hasInvalidEntry = Object.entries(service).some(
      ([name, duration]) =>
        name.trim() === "" ||
        typeof duration !== "string" ||
        duration.trim() === "",
    );

    if (hasInvalidEntry) {
      return res.status(400).json({
        error:
          'service entries must map a non-empty name to a non-empty duration, e.g. { "Corte de cabello": "30 min" }',
      });
    }

    try {
      const business = await modifyBusinessServices({ businessId, service });

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

export default admingBusinessRouter;
