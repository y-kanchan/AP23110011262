// src/services/api.ts

import { Notification } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://20.207.122.201/evaluation-service";

/**
 * Fetch all notifications from the campus notification API.
 */
export async function fetchNotifications(accessToken: string): Promise<Notification[]> {
  const response = await fetch(`${API_BASE_URL}/notification`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  const resultData = await response.json();
  
  // Normalize response data to match the humanized Notification interface
  const rawNotifications = (resultData.notifications || resultData) as any[];
  
  return rawNotifications.map(n => ({
    id: n.ID || n.id,
    type: n.Type || n.type,
    content: n.Message || n.content,
    timestamp: n.Timestamp || n.timestamp,
    isRead: n.isRead
  })) as Notification[];
}
