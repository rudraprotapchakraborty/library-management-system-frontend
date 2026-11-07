/** "Today, 6:30 PM", "Yesterday" or a short date. */
export function formatDate(iso) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === new Date().toDateString()) return `Today, ${time}`;
  if (d.toDateString() === new Date(Date.now() - 86_400_000).toDateString()) return `Yesterday, ${time}`;
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

export const shortDate = (iso) => new Date(iso).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

export const GENRES = ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"];
export const GENRE_LABELS = { FICTION: "Fiction", NON_FICTION: "Non-fiction", SCIENCE: "Science", HISTORY: "History", BIOGRAPHY: "Biography", FANTASY: "Fantasy" };

/** Whole days from now until the date (negative when it has passed). */
export const daysUntil = (iso) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
