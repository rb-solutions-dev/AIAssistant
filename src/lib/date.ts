import { format, isToday, isYesterday } from "date-fns";

export const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, "HH:mm a");
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MM/dd/yyyy");
};
