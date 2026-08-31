type TimeRange = {
  start: string; // "09:00" — 24h format
  end: string;   // "18:00"
};

type WeeklyHours = {
  monday?: TimeRange[];
  tuesday?: TimeRange[];
  wednesday?: TimeRange[];
  thursday?: TimeRange[];
  friday?: TimeRange[];
  saturday?: TimeRange[];
  sunday?: TimeRange[];
};