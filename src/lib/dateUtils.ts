const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function parseIsoDateString(dateString: unknown): Date {
  if (typeof dateString !== 'string') {
    return new Date('invalid date');
  }
  if (!isoDateRegex.test(dateString)) {
    return new Date('invalid date');
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date;
}

export function formatIsoDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function formatClientDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
