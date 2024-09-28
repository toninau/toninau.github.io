import { formatIsoDate, formatClientDate } from "@/lib/dateUtils";

export default function DateText({ date }: { date: Date }) {
  return <time dateTime={formatIsoDate(date)}>{formatClientDate(date)}</time>;
}
