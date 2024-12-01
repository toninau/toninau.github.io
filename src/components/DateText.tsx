import { formatIsoDate, formatClientDate } from '@/lib/date';

export default function DateText({ date }: { date: Date }) {
  return <time dateTime={formatIsoDate(date)}>{formatClientDate(date)}</time>;
}
