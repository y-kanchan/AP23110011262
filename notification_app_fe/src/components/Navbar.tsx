// src/components/Navbar.tsx

import React from "react";
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { useNotifications } from "../context/NotificationContext";

export function Navbar() {
  const { state } = useNotifications();
  const unreadCount = state.allNotifications.filter((notification) => !notification.isRead).length;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <div className="brand-icon">
          <MailOutlinedIcon sx={{ fontSize: 32, color: 'inherit' }} />
        </div>
        <h1 className="brand-title">Priority Inbox</h1>
      </div>

      <div className="navbar-actions">
        {unreadCount > 0 && (
          <div className="unread-badge">
            {unreadCount} Unread
          </div>
        )}
      </div>
    </nav>
  );
}
