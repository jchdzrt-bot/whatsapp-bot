type AppointmentV1Args = {
  businessPhone: string;
  clientPhone: string;
  message: string;
  clientName?: string;
};

type AppointmentV1Result = {
  replyMessage: string;
  conversation?: ConversationMongoType;
  appointment?: AppointmentMongoType;
};

type FlowStep = "location" | "service" | "worker" | "date" | "time";

type FlowData = {
  flowStep?: FlowStep;
  locationId?: string;
  locationLabel?: string;
  workerId?: string;
  workerLabel?: string;
  date?: string;
  dateLabel?: string;
  time?: string;
  timeLabel?: string;
  timeEndLabel?: string;
  service?: string;
  durationMinutes?: number;
};
