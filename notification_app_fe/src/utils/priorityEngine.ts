// src/utils/priorityEngine.ts

import { Notification, NotificationType, ScoredNotification } from "../types";

/**
 * Weight map: Placement > Result > Event
 * These weights reflect business importance of each notification type.
 */
const NOTIFICATION_TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Compute a normalized recency score [0, 1] for a given timestamp,
 * relative to the newest timestamp in the list.
 */
function calculateRecencyScore(timestamp: string, anchorTimestampMs: number): number {
  const notificationTimeMs = new Date(timestamp).getTime();
  const ageMs = Math.max(anchorTimestampMs - notificationTimeMs, 0);
  const HALF_LIFE_MS = 60 * 60 * 1000; // 1 hour decay
  return Math.exp((-Math.LN2 * ageMs) / HALF_LIFE_MS);
}

/**
 * Score a single notification based on weight and recency.
 */
function calculateNotificationPriority(
  notification: Notification,
  anchorTimestampMs: number
): ScoredNotification {
  const rawWeight = NOTIFICATION_TYPE_WEIGHTS[notification.type] ?? 1;
  const normalizedWeightScore = rawWeight / 3;
  const recencyScore = calculateRecencyScore(notification.timestamp, anchorTimestampMs);
  
  // 60% weight, 40% recency
  const finalScore = normalizedWeightScore * 0.6 + recencyScore * 0.4;

  return { 
    ...notification, 
    score: finalScore, 
    weightScore: normalizedWeightScore, 
    recencyScore 
  };
}

/**
 * Ranks notifications and returns the top priority ones.
 */
export function rankPriorityNotifications(
  notifications: Notification[],
  requestedCount: number
): ScoredNotification[] {
  if (notifications.length === 0) return [];

  const anchorTimestampMs = Math.max(
    ...notifications.map((n) => new Date(n.timestamp).getTime())
  );

  const priorityHeap: ScoredNotification[] = [];

  for (const notification of notifications) {
    const scoredNotification = calculateNotificationPriority(notification, anchorTimestampMs);

    if (priorityHeap.length < requestedCount) {
      priorityHeap.push(scoredNotification);
      priorityHeap.sort((a, b) => a.score - b.score);
    } else if (scoredNotification.score > priorityHeap[0].score) {
      priorityHeap[0] = scoredNotification;
      priorityHeap.sort((a, b) => a.score - b.score);
    }
  }

  return priorityHeap.sort((a, b) => b.score - a.score);
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
 * Merge and deduplicate incoming notifications.
 */
export function mergeNotifications(
  currentNotifications: Notification[],
  newNotifications: Notification[]
): Notification[] {
  const existingIds = new Set(currentNotifications.map((n) => n.id));
  const uniqueNewNotifications = newNotifications.filter((n) => !existingIds.has(n.id));
  return [...uniqueNewNotifications, ...currentNotifications];
}
