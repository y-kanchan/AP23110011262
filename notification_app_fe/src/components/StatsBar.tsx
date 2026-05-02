// src/components/StatsBar.tsx

import React from "react";
import { Briefcase, BookOpen, Calendar } from "lucide-react";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { useNotifications } from "../context/NotificationContext";

export function StatsBar() {
  const { state } = useNotifications();
  
  const stats = [
    { label: "Unread", count: state.allNotifications.filter(n => !n.isRead).length, icon: <MailOutlinedIcon sx={{ fontSize: 24 }} /> },
    { label: "Career", count: state.allNotifications.filter(n => n.type === "Placement").length, icon: <Briefcase size={22} /> },
    { label: "Academic", count: state.allNotifications.filter(n => n.type === "Result").length, icon: <BookOpen size={22} /> },
    { label: "Events", count: state.allNotifications.filter(n => n.type === "Event").length, icon: <Calendar size={22} /> },
  ];

  return (
    <section className="stats-bar" aria-label="Notification statistics">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-count">{stat.count}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}
