// src/components/LoadingSkeleton.tsx

import React from "react";

export function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-rank" />
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  );
}
