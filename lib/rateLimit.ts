import "server-only";

interface Bucket {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_TRACKED_KEYS = 5_000;

const buckets = new Map<string, Bucket>();

function evictIfOversized(): void {
  if (buckets.size <= MAX_TRACKED_KEYS) return;
  const oldestKey = buckets.keys().next().value;
  if (oldestKey !== undefined) buckets.delete(oldestKey);
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    evictIfOversized();
    return false;
  }

  existing.count += 1;
  return existing.count > MAX_REQUESTS_PER_WINDOW;
}
