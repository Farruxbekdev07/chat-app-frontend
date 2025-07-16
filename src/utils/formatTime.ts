import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export const formatTime = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  return `${day} ${month}, ${hours}:${minutes}`;
};

export const formatLastSeen = (timestamp: number | null): string => {
  if (!timestamp || isNaN(timestamp)) return "last seen recently";

  const date = dayjs(timestamp);
  const now = dayjs();

  const isToday = now.isSame(date, "day");

  if (isToday) {
    return `last seen today at ${date.format("h:mm A")}`;
  } else if (now.subtract(1, "day").isSame(date, "day")) {
    return `last seen yesterday at ${date.format("h:mm A")}`;
  } else {
    return `last seen on ${date.format("MMM D, YYYY h:mm A")}`;
  }
};
