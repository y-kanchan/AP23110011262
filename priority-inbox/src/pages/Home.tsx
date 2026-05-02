// src/pages/Home.tsx

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../components/NotificationCard";
import { StatsBar } from "../components/StatsBar";
import { TopNSelector } from "../components/TopNSelector";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export function Home() {
  const { state, loadNotifications } = useNotifications();

  return (
    <main className="home-page">
      <StatsBar />

      <section className="inbox-section">
        <div className="inbox-header">
          <div>
            <h2 className="inbox-title">Priority Inbox</h2>
            <p className="inbox-sub">
              Showing top {state.topNCount} notifications ranked by type weight &amp; recency
            </p>
          </div>
          <TopNSelector />
        </div>

        {/* Error state */}
        {state.error && (
          <div className="error-banner" role="alert">
            <AlertTriangle size={16} />
            <span>{state.error}</span>
            <button onClick={loadNotifications}>Retry</button>
          </div>
        )}

        {/* Loading state */}
        {state.loading && state.all.length === 0 && (
          <LoadingSkeleton count={state.topNCount} />
        )}

        {/* Empty state */}
        {!state.loading && state.topN.length === 0 && !state.error && (
          <EmptyState />
        )}

        {/* Notification list */}
        {state.topN.length > 0 && (
          <ol className="notif-list" aria-label="Priority notifications">
            {state.topN.map((notif, index) => (
              <li key={notif.ID}>
                <NotificationCard notification={notif} rank={index + 1} />
              </li>
            ))}
          </ol>
        )}

        {/* Loading indicator when refreshing */}
        {state.loading && state.all.length > 0 && (
          <p className="refresh-indicator" role="status">
            Checking for new notifications…
          </p>
        )}
      </section>

      {/* Legend */}
      <aside className="legend">
        <h3>Priority Formula</h3>
        <p>
          <strong>Score = Weight × 0.6 + Recency × 0.4</strong>
        </p>
        <div className="legend-types">
          <span className="type-tag type-placement">Placement — weight 3</span>
          <span className="type-tag type-result">Result — weight 2</span>
          <span className="type-tag type-event">Event — weight 1</span>
        </div>
        <p className="legend-note">
          Recency uses exponential decay with a 1-hour half-life. Top N is
          maintained via a min-heap (O(n log N)).
        </p>
      </aside>
    </main>
  );
}
