import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";
import {
  Appointment,
  APPOINTMENT_SOURCE,
  APPOINTMENT_STATUS,
  type AppointmentMongoType,
} from "../../schemas/appointmentSchema";

export type UpdateAppointmentArgs = {
  appointmentId: string;
  workerId?: string;
  service?: string;
  date?: string;
  time?: string;
  status?: APPOINTMENT_STATUS;
  lastModifiedBy?: APPOINTMENT_SOURCE;
};

export default async function updateAppointment({
  appointmentId,
  workerId,
  service,
  date,
  time,
  status,
  lastModifiedBy,
}: UpdateAppointmentArgs): Promise<AppointmentMongoType | NullOrUndefined> {
  const updateFields = filterOutUndefinedProperties({
    workerId,
    service,
    date,
    time,
    status,
    lastModifiedBy,
  });

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields provided to update");
  }

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { id: appointmentId },
      { $set: updateFields },
      { new: true, timestamps: true, select: "-_id -__v" },
    );

    if (!appointment) {
      console.error(`No appointment found with id: ${appointmentId}`);
      return null;
    }

    return appointment.toObject();
  } catch (error) {
    simpleErrorHandling(`Error updating appointment ${appointmentId}`, error);
  }
}
