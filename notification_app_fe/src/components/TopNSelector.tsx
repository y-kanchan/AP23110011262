// src/components/TopNSelector.tsx

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const OPTIONS = [5, 10, 15, 20];

export function TopNSelector() {
  const { state, setPriorityLimit } = useNotifications();

  return (
    <div className="topn-selector">
      <div className="topn-label">
        <SlidersHorizontal size={14} />
        <span>Show top</span>
      </div>
      <div className="topn-buttons">
        {OPTIONS.map((optionValue) => (
          <button
            key={optionValue}
            className={`topn-btn ${state.priorityLimit === optionValue ? "active" : ""}`}
            onClick={() => setPriorityLimit(optionValue)}
            aria-pressed={state.priorityLimit === optionValue}
          >
            {optionValue}
          </button>
        ))}
      </div>
    </div>
  );
}
