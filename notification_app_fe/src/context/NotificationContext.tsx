// src/context/NotificationContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Notification,
  NotificationState,
  NotificationAction,
  ScoredNotification,
} from "../types";
import { rankPriorityNotifications, mergeNotifications } from "../utils/priorityEngine";
import { fetchNotifications } from "../services/api";
import { authenticate, registerUser, RegisterData } from "../services/auth";

// ─── Internal Helpers ────────────────────────────────────────────────────────

function computePriorityInbox(
  allNotifications: Notification[],
  limit: number
): ScoredNotification[] {
  const unreadNotifications = allNotifications.filter((n) => !n.isRead);
  return rankPriorityNotifications(unreadNotifications, limit);
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_AUTH":
      return { 
        ...state, 
        token: action.payload.token, 
        isConfigured: action.payload.isConfigured,
        error: null 
      };
    case "LOGOUT":
      return { 
        ...initialState,
        token: null, 
        isConfigured: false,
        allNotifications: [],
        priorityNotifications: []
      };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS": {
      const mergedNotifications = mergeNotifications(state.allNotifications, action.payload);
      return {
        ...state,
        loading: false,
        allNotifications: mergedNotifications,
        priorityNotifications: computePriorityInbox(mergedNotifications, state.priorityLimit),
        lastFetched: new Date(),
      };
    }
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "MARK_READ": {
      const updatedNotifications = state.allNotifications.map((n) =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      return {
        ...state,
        allNotifications: updatedNotifications,
        priorityNotifications: computePriorityInbox(updatedNotifications, state.priorityLimit),
      };
    }
    case "SET_TOP_N": {
      return {
        ...state,
        priorityLimit: action.payload,
        priorityNotifications: computePriorityInbox(state.allNotifications, action.payload),
      };
    }
    default:
      return state;
  }
}

const initialState: NotificationState = {
  allNotifications: [],
  priorityNotifications: [],
  priorityLimit: 10,
  loading: false,
  error: null,
  lastFetched: null,
  token: localStorage.getItem("priority_token"),
  isConfigured: 
    !!localStorage.getItem("priority_client_id") || 
    !!import.meta.env.VITE_CLIENT_ID ||
    localStorage.getItem("priority_mock") === "true",
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface NotificationContextValue {
  state: NotificationState;
  syncNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  setPriorityLimit: (limit: number) => void;
  register: (data: RegisterData) => Promise<void>;
  enterMockMode: () => void;
  logout: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

const SYNC_INTERVAL_MS = 30_000;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [isMockMode, setIsMockMode] = useState(localStorage.getItem("priority_mock") === "true");
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncNotifications = useCallback(async () => {
    if (!state.token && !isMockMode) {
      // Auto-auth using environment variables if configured
      const environmentClientId = import.meta.env.VITE_CLIENT_ID;
      const environmentClientSecret = import.meta.env.VITE_CLIENT_SECRET;
      const environmentEmail = import.meta.env.VITE_EMAIL;
      const environmentName = import.meta.env.VITE_NAME;
      const environmentRoll = import.meta.env.VITE_ROLL;

      if (environmentClientId && environmentClientSecret && environmentEmail && environmentName && environmentRoll) {
        try {
          const token = await authenticate(environmentClientId, environmentClientSecret, environmentEmail, environmentName, environmentRoll);
          localStorage.setItem("priority_token", token);
          dispatch({ type: "SET_AUTH", payload: { token, isConfigured: true } });
          return;
        } catch (authError) {
          console.error("Environment authentication failed", authError);
        }
      }
      return;
    }
    
    dispatch({ type: "FETCH_START" });
    try {
      let notifications: Notification[];
      if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const { MOCK_NOTIFICATIONS } = await import("../services/mockData");
        
        // Humanize mock data on the fly if needed, or assume it matches type
        notifications = MOCK_NOTIFICATIONS.map(n => ({
          id: n.ID || n.id,
          type: n.Type || n.type,
          content: n.Message || n.content,
          timestamp: n.Timestamp || n.timestamp,
          isRead: n.isRead
        }));
      } else {
        notifications = await fetchNotifications(state.token!);
      }
      dispatch({ type: "FETCH_SUCCESS", payload: notifications });
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        const storedClientId = localStorage.getItem("priority_client_id");
        const storedClientSecret = localStorage.getItem("priority_client_secret");
        const storedEmail = localStorage.getItem("priority_email");
        const storedName = localStorage.getItem("priority_name");
        const storedRollNo = localStorage.getItem("priority_roll");

        if (storedClientId && storedClientSecret && storedEmail && storedName && storedRollNo) {
          try {
            const refreshedToken = await authenticate(storedClientId, storedClientSecret, storedEmail, storedName, storedRollNo);
            localStorage.setItem("priority_token", refreshedToken);
            dispatch({ type: "SET_AUTH", payload: { token: refreshedToken, isConfigured: true } });
            return;
          } catch (refreshError) {
            dispatch({ type: "FETCH_ERROR", payload: "Session expired. Please log in again." });
          }
        }
      }
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
    }
  }, [state.token, isMockMode]);

  const register = async (registrationData: RegisterData) => {
    try {
      const { clientID, clientSecret } = await registerUser(registrationData);
      
      localStorage.setItem("priority_client_id", clientID);
      localStorage.setItem("priority_client_secret", clientSecret);
      localStorage.setItem("priority_email", registrationData.email);
      localStorage.setItem("priority_name", registrationData.name);
      localStorage.setItem("priority_roll", registrationData.rollNo);
      localStorage.removeItem("priority_mock");
      setIsMockMode(false);
      
      const token = await authenticate(clientID, clientSecret, registrationData.email, registrationData.name, registrationData.rollNo);
      localStorage.setItem("priority_token", token);
      
      dispatch({ type: "SET_AUTH", payload: { token, isConfigured: true } });
    } catch (registrationError: any) {
      throw registrationError;
    }
  };

  const enterMockMode = () => {
    localStorage.setItem("priority_mock", "true");
    setIsMockMode(true);
    dispatch({ type: "SET_AUTH", payload: { token: "mock_token", isConfigured: true } });
  };

  const logout = () => {
    localStorage.clear();
    setIsMockMode(false);
    dispatch({ type: "LOGOUT" });
  };

  const markAsRead = useCallback((notificationId: string) => {
    dispatch({ type: "MARK_READ", payload: notificationId });
  }, []);

  const setPriorityLimit = useCallback((limit: number) => {
    dispatch({ type: "SET_TOP_N", payload: limit });
  }, []);

  useEffect(() => {
    if (state.token || isMockMode) {
      syncNotifications();
    }
  }, [state.token, isMockMode, syncNotifications]);

  useEffect(() => {
    if (state.token || isMockMode) {
      syncIntervalRef.current = setInterval(syncNotifications, SYNC_INTERVAL_MS);
      return () => {
        if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
      };
    }
  }, [state.token, isMockMode, syncNotifications]);

  return (
    <NotificationContext.Provider value={{ state, syncNotifications, markAsRead, setPriorityLimit, register, enterMockMode, logout }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const notificationContext = useContext(NotificationContext);
  if (!notificationContext) throw new Error("useNotifications must be used within NotificationProvider");
  return notificationContext;
}
