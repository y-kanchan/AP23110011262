// src/components/NotificationCard.tsx

import React from "react";
import { CheckCircle2, GripVertical, Star } from "lucide-react";
import { ScoredNotification } from "../types";
import { formatRelativeTime } from "../utils/priorityEngine";
import { useNotifications } from "../context/NotificationContext";

interface NotificationCardProps {
  notification: ScoredNotification;
  rank: number;
}

export function NotificationCard({ notification, rank }: NotificationCardProps) {
  const { markAsRead } = useNotifications();

  return (
    <article
      className={`notif-card ${notification.isRead ? "is-read" : "is-unread"}`}
      aria-label={`${rank}. ${notification.type}: ${notification.content}`}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      <div className="notif-drag" aria-hidden="true">
        <GripVertical size={16} strokeWidth={2.5} color="#ccc" />
      </div>

      <div className="notif-star" aria-hidden="true">
        <Star size={18} strokeWidth={1.5} color="#ccc" />
      </div>

      <div className="type-tag">{notification.type}</div>

      <div className="notif-message">
        <span className="rank-text">#{rank}</span> {notification.content}
      </div>

      <time className="notif-time" dateTime={notification.timestamp}>
        {formatRelativeTime(notification.timestamp)}
      </time>

      <div className="notif-actions">
        {!notification.isRead && (
          <button
            className="action-icon"
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            title="Mark as read"
          >
            <CheckCircle2 size={18} />
          </button>
        )}
      </div>
    </article>
  );
}

