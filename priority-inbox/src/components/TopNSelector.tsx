// src/components/TopNSelector.tsx

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const OPTIONS = [5, 10, 15, 20];

export function TopNSelector() {
  const { state, setTopN } = useNotifications();

  return (
    <div className="topn-selector">
      <div className="topn-label">
        <SlidersHorizontal size={14} />
        <span>Show top</span>
      </div>
      <div className="topn-buttons">
        {OPTIONS.map((n) => (
          <button
            key={n}
            className={`topn-btn ${state.topNCount === n ? "active" : ""}`}
            onClick={() => setTopN(n)}
            aria-pressed={state.topNCount === n}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
