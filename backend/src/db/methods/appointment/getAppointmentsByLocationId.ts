import simpleErrorHandling from "../../../utils/error/simpleErrorHandling";
import filterOutUndefinedProperties from "../../../utils/object/filterOutUndefinedProperties";
import {
  Appointment,
  type APPOINTMENT_STATUS,
  type AppointmentMongoType,
} from "../../schemas/appointmentSchema";

export type GetAppointmentsByLocationIdArgs = {
  locationId: string;
  date?: string;
  status?: APPOINTMENT_STATUS;
};

export default async function getAppointmentsByLocationId({
  locationId,
  date,
  status,
}: GetAppointmentsByLocationIdArgs): Promise<
  AppointmentMongoType[] | undefined
> {
  try {
    const appointments = await Appointment.find(
      filterOutUndefinedProperties({ locationId, date, status }),
      "-_id -__v",
    ).sort({ date: 1, time: 1 });

    return appointments;
  } catch (error) {
    simpleErrorHandling(
      `Error getting appointments for locationId: ${locationId}`,
      error,
    );
  }
}