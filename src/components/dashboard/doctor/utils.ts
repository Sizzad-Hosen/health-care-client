import { Schedule } from "@/types/appointment";

export function getScheduleStart(schedule?: Schedule) {
  return schedule?.startDate ?? (schedule as { startDateTime?: string } | undefined)?.startDateTime;
}

export function getScheduleEnd(schedule?: Schedule) {
  return schedule?.endDate ?? (schedule as { endDateTime?: string } | undefined)?.endDateTime;
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatSchedule(schedule?: Schedule) {
  const start = getScheduleStart(schedule);
  const end = getScheduleEnd(schedule);

  if (!start || !end) {
    return "Schedule time unavailable";
  }

  return `${formatDateTime(start)} - ${new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(end))}`;
}

export function statusClass(status?: string) {
  switch (status) {
    case "COMPLETED":
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "SCHEDULED":
      return "bg-sky-100 text-sky-800";
    case "INPROGRESS":
      return "bg-amber-100 text-amber-800";
    case "UNPAID":
      return "bg-orange-100 text-orange-800";
    case "CANCELED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function totalPages(total?: number, limit?: number) {
  return Math.max(1, Math.ceil((total ?? 0) / (limit || 10)));
}
