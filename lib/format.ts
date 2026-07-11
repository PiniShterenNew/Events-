import type { RSVPStatus } from "@/types";

export const statusLabels: Record<RSVPStatus, string> = {
  pending: "טרם ענה",
  going: "מגיע/ה",
  maybe: "אולי",
  declined: "לא מגיע/ה",
};

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
