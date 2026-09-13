import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import {
  Appointment,
  APPOINTMENT_STATUS,
  type AppointmentMongoType,
} from "../../schemas/appointmentSchema";

export type MongoGenerated = "id" | "createdAt" | "updatedAt";

const DEFAULT_DURATION_MINUTES = 60;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":");
  return (
    Number.parseInt(hours ?? "0", 10) * 60 +
    Number.parseInt(minutes ?? "0", 10)
  );
}

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
  durationMinutes,
}: CreateAppointmentArgs): Promise<AppointmentMongoType | undefined> {
  const newStart = timeToMinutes(time);
  const newEnd = newStart + (durationMinutes ?? DEFAULT_DURATION_MINUTES);

  const candidateAppointments = await Appointment.find({
    workerId,
    date,
    status: { $ne: APPOINTMENT_STATUS.CANCELLED },
  });

  const conflict = candidateAppointments.find((appointment) => {
    const existingStart = timeToMinutes(appointment.time);
    const existingEnd =
      existingStart + (appointment.durationMinutes ?? DEFAULT_DURATION_MINUTES);
    return existingStart < newEnd && existingEnd > newStart;
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
    durationMinutes,
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
