// src/types/index.ts

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ScoredNotification extends Notification {
  score: number;
  weightScore: number;
  recencyScore: number;
}

export interface NotificationState {
  allNotifications: Notification[];
  priorityNotifications: ScoredNotification[];
  priorityLimit: number;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  token: string | null;
  isConfigured: boolean;
}

export type NotificationAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Notification[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "MARK_READ"; payload: string }
  | { type: "SET_TOP_N"; payload: number }
  | { type: "ADD_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_AUTH"; payload: { token: string; isConfigured: boolean } }
  | { type: "LOGOUT" };
