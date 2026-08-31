import { Schema } from "mongoose";

const timeRangeSchema = new Schema<TimeRange>(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false } // no need for an ObjectId on each individual time range
);

export default timeRangeSchema;