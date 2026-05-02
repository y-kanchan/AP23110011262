// src/types/index.ts

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface ScoredNotification extends Notification {
  score: number;
  weightScore: number;
  recencyScore: number;
}

export interface NotificationState {
  all: Notification[];
  topN: ScoredNotification[];
  topNCount: number;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export type NotificationAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Notification[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "MARK_READ"; payload: string }
  | { type: "SET_TOP_N"; payload: number }
  | { type: "ADD_NOTIFICATIONS"; payload: Notification[] };
