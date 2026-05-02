// src/hooks/useNotificationStats.ts

import { useMemo } from "react";
import { Notification, NotificationType } from "../types";

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  unreadByType: Record<NotificationType, number>;
}

/**
 * Derives summary stats from a notification list.
 * Memoized so it only recomputes when the list changes.
 */
export function useNotificationStats(notifications: Notification[]): NotificationStats {
  return useMemo(() => {
    const byType: Record<NotificationType, number> = {
      Placement: 0,
      Result: 0,
      Event: 0,
    };
    const unreadByType: Record<NotificationType, number> = {
      Placement: 0,
      Result: 0,
      Event: 0,
    };
    let unread = 0;

    for (const n of notifications) {
      byType[n.Type] = (byType[n.Type] ?? 0) + 1;
      if (!n.isRead) {
        unread++;
        unreadByType[n.Type] = (unreadByType[n.Type] ?? 0) + 1;
      }
    }

    return { total: notifications.length, unread, byType, unreadByType };
  }, [notifications]);
}
