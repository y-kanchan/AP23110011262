// src/components/EmptyState.tsx

import React from "react";
import { CheckCheck } from "lucide-react";

export function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-icon">
        <CheckCheck size={32} />
      </div>
      <h3>All caught up!</h3>
      <p>No unread notifications in your priority inbox.</p>
    </div>
  );
}
