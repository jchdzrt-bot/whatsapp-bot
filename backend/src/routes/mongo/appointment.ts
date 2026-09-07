import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import createAppointment, {
  type CreateAppointmentArgs,
} from "../../db/methods/appointment/createAppointment";
import updateAppointment, {
  type UpdateAppointmentArgs,
} from "../../db/methods/appointment/updateAppointment";
import filterOutUndefinedProperties from "../../utils/object/filterOutUndefinedProperties";

const appointmentRouter = Router();

appointmentRouter.post(
  "",
  async (
    req: Request<{}, {}, CreateAppointmentArgs>,
    res: Response,
    next: NextFunction,
  ) => {
    const {
      businessId,
      locationId,
      workerId,
      clientPhoneNumber,
      clientName,
      service,
      date,
      time,
      status,
      source,
    } = req.body;

    if (
      !businessId ||
      !locationId ||
      !workerId ||
      !clientPhoneNumber ||
      !clientName ||
      !service ||
      !date ||
      !time ||
      !status ||
      !source
    ) {
      return res.status(400).json({
        error:
          "businessId, locationId, workerId, clientPhoneNumber, clientName, service, date, time, status, and source are all required",
      });
    }

    try {
      const conversation = await createAppointment({
        businessId,
        locationId,
        workerId,
        clientPhoneNumber,
        clientName,
        service,
        date,
        time,
        status,
        source,
      });

      res.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  },
);

appointmentRouter.patch(
  "/:appointmentId",
  async (
    req: Request<
      { appointmentId: string },
      {},
      Omit<UpdateAppointmentArgs, "appointmentId">
    >,
    res: Response,
    next: NextFunction,
  ) => {
    const { appointmentId } = req.params;

    try {
      const appointment = await updateAppointment({
        appointmentId,
        ...filterOutUndefinedProperties(req.body),
      });

      res.status(200).json({ appointment });
    } catch (error) {
      next(error);
    }
  },
);

export default appointmentRouter;
