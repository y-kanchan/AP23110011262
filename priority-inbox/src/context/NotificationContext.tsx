// src/context/NotificationContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Notification,
  NotificationState,
  NotificationAction,
  ScoredNotification,
} from "../types";
import { getTopNNotifications, mergeNotifications } from "../utils/priorityEngine";
import { fetchNotifications } from "../services/api";
import { MOCK_NOTIFICATIONS } from "../services/mockData";

// ─── Reducer ────────────────────────────────────────────────────────────────

function computeTopN(
  all: Notification[],
  n: number
): ScoredNotification[] {
  // Only score unread notifications for the priority inbox
  const unread = all.filter((n) => !n.isRead);
  return getTopNNotifications(unread, n);
}

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS": {
      const merged = mergeNotifications(state.all, action.payload);
      return {
        ...state,
        loading: false,
        all: merged,
        topN: computeTopN(merged, state.topNCount),
        lastFetched: new Date(),
      };
    }

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "MARK_READ": {
      const updated = state.all.map((n) =>
        n.ID === action.payload ? { ...n, isRead: true } : n
      );
      return {
        ...state,
        all: updated,
        topN: computeTopN(updated, state.topNCount),
      };
    }

    case "SET_TOP_N": {
      return {
        ...state,
        topNCount: action.payload,
        topN: computeTopN(state.all, action.payload),
      };
    }

    case "ADD_NOTIFICATIONS": {
      const merged = mergeNotifications(state.all, action.payload);
      return {
        ...state,
        all: merged,
        topN: computeTopN(merged, state.topNCount),
      };
    }

    default:
      return state;
  }
}

const initialState: NotificationState = {
  all: [],
  topN: [],
  topNCount: 10,
  loading: false,
  error: null,
  lastFetched: null,
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface NotificationContextValue {
  state: NotificationState;
  loadNotifications: () => Promise<void>;
  markRead: (id: string) => void;
  setTopN: (n: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000; // Poll for new notifications every 30 seconds
const USE_MOCK = true; // Set false when real API is reachable

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadNotifications = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      let notifications: Notification[];
      if (USE_MOCK) {
        // Simulate network latency
        await new Promise((r) => setTimeout(r, 600));
        notifications = MOCK_NOTIFICATIONS;
      } else {
        notifications = await fetchNotifications();
      }
      dispatch({ type: "FETCH_SUCCESS", payload: notifications });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []);

  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", payload: id });
  }, []);

  const setTopN = useCallback((n: number) => {
    dispatch({ type: "SET_TOP_N", payload: n });
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Polling: re-fetch and merge new notifications periodically
  useEffect(() => {
    pollRef.current = setInterval(loadNotifications, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadNotifications]);

  return (
    <NotificationContext.Provider value={{ state, loadNotifications, markRead, setTopN }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
