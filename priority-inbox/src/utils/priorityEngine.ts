// src/utils/priorityEngine.ts

import { Notification, NotificationType, ScoredNotification } from "../types";

/**
 * Weight map: Placement > Result > Event
 * These weights reflect business importance of each notification type.
 */
const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Compute a normalized recency score [0, 1] for a given timestamp,
 * relative to the newest timestamp in the list.
 *
 * Older notifications decay exponentially using a half-life of 1 hour.
 * This keeps recent notifications competitive even if type weight is lower.
 */
function computeRecencyScore(timestamp: string, newestMs: number): number {
  const notifMs = new Date(timestamp).getTime();
  const ageMs = Math.max(newestMs - notifMs, 0);
  const HALF_LIFE_MS = 60 * 60 * 1000; // 1 hour
  return Math.exp((-Math.LN2 * ageMs) / HALF_LIFE_MS);
}

/**
 * Score a single notification.
 *
 * Final score = weightScore * 0.6 + recencyScore * 0.4
 * Weight contributes 60% so type priority dominates, but recency
 * (40%) ensures very old notifications don't crowd out fresh ones.
 */
function scoreNotification(
  notification: Notification,
  newestMs: number
): ScoredNotification {
  const weightRaw = TYPE_WEIGHTS[notification.Type] ?? 1;
  // Normalize weight to [0, 1]  (max weight is 3)
  const weightScore = weightRaw / 3;
  const recencyScore = computeRecencyScore(notification.Timestamp, newestMs);
  const score = weightScore * 0.6 + recencyScore * 0.4;

  return { ...notification, score, weightScore, recencyScore };
}

/**
 * Get the top-N priority notifications from a list.
 *
 * Approach:
 * - Score every notification O(n)
 * - Maintain a min-heap of size N to track top-N efficiently O(n log N)
 * - Final sort of the N winners O(N log N)
 *
 * Using a JS min-heap simulation via a sorted array for clarity at this scale.
 * For millions of notifications, a true binary heap (e.g. via a library) would
 * be recommended. The heap logic ensures we never sort the full list.
 */
export function getTopNNotifications(
  notifications: Notification[],
  n: number
): ScoredNotification[] {
  if (notifications.length === 0) return [];

  // Find the newest timestamp to anchor recency scoring
  const newestMs = Math.max(
    ...notifications.map((notif) => new Date(notif.Timestamp).getTime())
  );

  // Min-heap simulation: array kept sorted by score ascending
  // so heap[0] is always the smallest score in our top-N set.
  const heap: ScoredNotification[] = [];

  for (const notif of notifications) {
    const scored = scoreNotification(notif, newestMs);

    if (heap.length < n) {
      // Heap not full yet — push and re-sort ascending by score
      heap.push(scored);
      heap.sort((a, b) => a.score - b.score);
    } else if (scored.score > heap[0].score) {
      // Current notification beats the weakest in our top-N
      heap[0] = scored;
      heap.sort((a, b) => a.score - b.score);
    }
    // Otherwise, skip — it can't enter the top-N
  }

  // Return top-N sorted descending (highest priority first)
  return heap.sort((a, b) => b.score - a.score);
}

/**
 * Format a timestamp to a human-readable relative time string.
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Merge incoming notifications with existing ones, deduplicating by ID.
 * Returns the combined unique list.
 */
export function mergeNotifications(
  existing: Notification[],
  incoming: Notification[]
): Notification[] {
  const existingIds = new Set(existing.map((n) => n.ID));
  const newOnes = incoming.filter((n) => !existingIds.has(n.ID));
  return [...newOnes, ...existing]; // newest first for display purposes
}
