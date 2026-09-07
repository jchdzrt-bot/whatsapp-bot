import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Appointment,
  APPOINTMENT_STATUS,
  type AppointmentMongoType,
} from "../../schemas/appointmentSchema";

export type MongoGenerated = "id" | "createdAt" | "updatedAt";

export type CreateAppointmentArgs = Omit<
  AppointmentMongoType,
  MongoGenerated | "status" | "lastModifiedBy"
> & {
  status?: APPOINTMENT_STATUS;
};

export default async function createAppointment({
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
}: CreateAppointmentArgs): Promise<AppointmentMongoType | undefined> {
  const conflict = await Appointment.findOne({
    workerId,
    date,
    time,
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  });

  if (conflict) {
    throw new Error(
      `Worker ${workerId} already has an appointment at ${date} ${time}`,
    );
  }

  const newAppointment = new Appointment({
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
    lastModifiedBy: source,
  });

  try {
    await newAppointment.save();
    console.log(
      `New appointment created for worker ${workerId} on ${date} ${time}`,
    );

    const { _id, __v, ...cleanAppointment } = newAppointment.toObject();
    
    return cleanAppointment
  } catch (error) {
    simpleErrorHandling(
      `Error creating appointment for worker ${workerId}`,
      error,
    );
  }
}
