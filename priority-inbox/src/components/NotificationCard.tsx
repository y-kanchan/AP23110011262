// src/components/NotificationCard.tsx

import React from "react";
import { Briefcase, BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import { ScoredNotification } from "../types";
import { formatRelativeTime } from "../utils/priorityEngine";
import { ScoreBar } from "./ScoreBar";
import { useNotifications } from "../context/NotificationContext";

interface NotificationCardProps {
  notification: ScoredNotification;
  rank: number;
}

const TYPE_CONFIG = {
  Placement: {
    icon: <Briefcase size={16} />,
    cls: "type-placement",
    label: "Placement",
  },
  Result: {
    icon: <BookOpen size={16} />,
    cls: "type-result",
    label: "Result",
  },
  Event: {
    icon: <Calendar size={16} />,
    cls: "type-event",
    label: "Event",
  },
};

export function NotificationCard({ notification, rank }: NotificationCardProps) {
  const { markRead } = useNotifications();
  const config = TYPE_CONFIG[notification.Type];

  return (
    <article
      className={`notif-card ${notification.isRead ? "is-read" : "is-unread"} ${config.cls}`}
      aria-label={`${rank}. ${notification.Type}: ${notification.Message}`}
    >
      {/* Rank badge */}
      <div className="rank-badge" aria-hidden="true">
        #{rank}
      </div>

      {/* Type icon */}
      <div className={`type-icon ${config.cls}`}>{config.icon}</div>

      {/* Content */}
      <div className="notif-content">
        <div className="notif-header">
          <span className={`type-tag ${config.cls}`}>{config.label}</span>
          <time className="notif-time" dateTime={notification.Timestamp}>
            {formatRelativeTime(notification.Timestamp)}
          </time>
        </div>
        <p className="notif-message">{notification.Message}</p>
        <ScoreBar
          score={notification.score}
          weightScore={notification.weightScore}
          recencyScore={notification.recencyScore}
        />
      </div>

      {/* Mark read button */}
      {!notification.isRead && (
        <button
          className="mark-read-btn"
          onClick={() => markRead(notification.ID)}
          aria-label="Mark as read"
          title="Mark as read"
        >
          <CheckCircle2 size={18} />
        </button>
      )}
    </article>
  );
}
