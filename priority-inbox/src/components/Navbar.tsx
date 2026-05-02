// src/components/Navbar.tsx

import React from "react";
import { Bell, RefreshCw, Wifi } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export function Navbar() {
  const { state, loadNotifications } = useNotifications();
  const unreadCount = state.all.filter((n) => !n.isRead).length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <Bell size={18} />
        </div>
        <div>
          <h1 className="brand-title">Priority Inbox</h1>
          <p className="brand-sub">Campus Notifications</p>
        </div>
      </div>

      <div className="navbar-actions">
        {state.lastFetched && (
          <span className="last-fetched">
            <Wifi size={12} />
            {state.lastFetched.toLocaleTimeString()}
          </span>
        )}
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount} unread</span>
        )}
        <button
          className="refresh-btn"
          onClick={loadNotifications}
          disabled={state.loading}
          aria-label="Refresh notifications"
        >
          <RefreshCw size={15} className={state.loading ? "spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>
    </nav>
  );
}
