// src/pages/Home.tsx

import React from "react";
import { AlertTriangle, Info, RefreshCw } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { NotificationCard } from "../components/NotificationCard";
import { StatsBar } from "../components/StatsBar";
import { TopNSelector } from "../components/TopNSelector";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export function Home() {
  const { state, syncNotifications } = useNotifications();

  return (
    <main className="home-page">
      <StatsBar />

      <section className="inbox-container">
        <div className="inbox-toolbar">
          <div className="inbox-title-area">
            <h2 className="inbox-title">Priority Inbox</h2>
            {state.loading && (
              <RefreshCw size={14} className="spin" style={{ color: 'var(--accent)' }} />
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TopNSelector />
            <button 
              className="refresh-btn" 
              onClick={syncNotifications}
              disabled={state.loading}
              title="Sync Notifications"
            >
              <RefreshCw size={18} className={state.loading ? "spin" : ""} />
            </button>
          </div>
        </div>

        {/* Error state */}
        {state.error && (
          <div className="error-banner" role="alert" style={{ margin: '20px', padding: '16px', background: '#fff1f1', border: '1px solid #ffcfcf', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="#d93025" />
            <span style={{ color: '#d93025', fontWeight: 500 }}>{state.error}</span>
            <button onClick={syncNotifications} style={{ marginLeft: 'auto', background: '#d93025', color: 'white', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>Retry</button>
          </div>
        )}

        {/* Loading state */}
        {state.loading && state.allNotifications.length === 0 && (
          <div style={{ padding: '24px' }}>
            <LoadingSkeleton count={state.priorityLimit} />
          </div>
        )}

        {/* Empty state */}
        {!state.loading && state.priorityNotifications.length === 0 && !state.error && (
          <EmptyState />
        )}

        {/* Notification list */}
        <div className="notif-list" aria-label="Priority notifications">
          {state.priorityNotifications.map((notification, index) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
              rank={index + 1} 
            />
          ))}
        </div>
      </section>

      {/* Legend */}
      <aside className="legend">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--accent)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Info size={16} />
          </div>
          <h3 style={{ margin: 0 }}>Intelligent Priority System</h3>
        </div>
        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Notifications are automatically prioritized using a <strong>Weighted-Recency</strong> algorithm. 
          Career opportunities rank highest, followed by Academic results and Campus events. 
          The score decays over time to keep your inbox fresh.
        </p>
      </aside>
    </main>
  );
}
