export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function presetRanges() {
  const now = new Date();
  const today = toDateInputValue(now);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    today,
    sevenDaysAgo: toDateInputValue(sevenDaysAgo),
    firstOfMonth: toDateInputValue(firstOfMonth),
  };
}

export type DateRange = { from?: string; to?: string };

// Convierte "desde"/"hasta" (yyyy-mm-dd de un <input type="date">) a límites ISO
// listos para comparar contra `created_at` (timestamptz) en Supabase.
export function toQueryRange({ from, to }: DateRange) {
  return {
    from: from ? `${from}T00:00:00.000Z` : undefined,
    to: to ? `${to}T23:59:59.999Z` : undefined,
  };
}
