import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const ta = new TimeAgo("en-US");

export default function timeAgo(dateStr: string): string {
  const date = Date.parse(dateStr);
  return date ? ta.format(date) : "";
}

export function getDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (!date) return "";

  // generate a string in the following format DD/MM/YYYY
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  return formattedDate;
}

export function getDateWithTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (!date) return "";

  // generate a string in the following format DD/MM/YYYY, HH:MM (AM/PM)
  const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedDate;
}

export function getDate_0_indexed(dateStr: string | Date): string {
  let date: string | Date = new Date(dateStr);
  date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  return date;
}

export function getTime(dateStr: string) {
  const date = new Date(dateStr);
  let formattedTime = date.toLocaleTimeString().replace(/:\d{2}\s/, " ");
  return formattedTime;
}

export function getDateAndTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (!date) return "";

  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const formattedTime = date.toLocaleTimeString().replace(/:\d{2}\s/, " ");

  return formattedDate + " " + formattedTime;
}

export function convertTimeZone(
  date: string | Date,
  timeZoneString: string = "Asia/Kolkata"
) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: timeZoneString,
    })
  );
}

export function isTodayEarlierThanDate(date: string | Date): boolean {
  date = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date > today;
}

export function getNextDay(date: Date | string) {
  // use a copy variable (tomorrow) so that the original variable doesn't get mutated
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

/**
 * gets the next hour but resets the minute, second and millisecond values
 * @param date
 * @returns
 */
export function getNextHour_noMin(date: Date | string): Date {
  // use a copy variable (nextHour) so that the original variable doesn't get mutated
  const nextHour = new Date(date);
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
  return nextHour;
}
