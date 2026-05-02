// src/components/StatsBar.tsx

import React from "react";
import { Briefcase, BookOpen, Calendar, Inbox } from "lucide-react";
import { useNotificationStats } from "../hooks/useNotificationStats";
import { useNotifications } from "../context/NotificationContext";

export function StatsBar() {
  const { state } = useNotifications();
  const stats = useNotificationStats(state.all);

  const cards = [
    {
      label: "Placement",
      count: stats.unreadByType.Placement,
      total: stats.byType.Placement,
      icon: <Briefcase size={16} />,
      cls: "stat-placement",
    },
    {
      label: "Result",
      count: stats.unreadByType.Result,
      total: stats.byType.Result,
      icon: <BookOpen size={16} />,
      cls: "stat-result",
    },
    {
      label: "Event",
      count: stats.unreadByType.Event,
      total: stats.byType.Event,
      icon: <Calendar size={16} />,
      cls: "stat-event",
    },
    {
      label: "Total Unread",
      count: stats.unread,
      total: stats.total,
      icon: <Inbox size={16} />,
      cls: "stat-total",
    },
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.cls}`}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-info">
            <span className="stat-count">{card.count}</span>
            <span className="stat-label">
              {card.label}
              <em> / {card.total}</em>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
