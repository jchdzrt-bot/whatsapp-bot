import { Schema } from "mongoose";
import timeRangeSchema from "./timeRangeSchema";

const weeklyHoursSchema = new Schema<WeeklyHours>(
  {
    monday: { type: [timeRangeSchema], default: [] },
    tuesday: { type: [timeRangeSchema], default: [] },
    wednesday: { type: [timeRangeSchema], default: [] },
    thursday: { type: [timeRangeSchema], default: [] },
    friday: { type: [timeRangeSchema], default: [] },
    saturday: { type: [timeRangeSchema], default: [] },
    sunday: { type: [timeRangeSchema], default: [] },
  },
  { _id: false }
);

export default weeklyHoursSchema;