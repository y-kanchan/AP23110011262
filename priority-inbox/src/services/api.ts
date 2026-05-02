// src/services/api.ts

import { Notification } from "../types";

const API_BASE = "http://20.207.122.201/evaluation-service";

// In a real app, this token would come from an auth flow / env variable.
// The API is a protected route, so we pass a Bearer token.
const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN ?? "";

/**
 * Fetch all notifications from the campus notification API.
 * Throws on non-OK responses so callers can handle errors uniformly.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/notifications`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.notifications as Notification[];
}
