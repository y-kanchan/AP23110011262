// src/services/mockData.ts
// Used when the real API is unreachable or for local development.

import { Notification } from "../types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    ID: "d146095a-0d86-4a34-9e69-3900a14576bc",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:51:30",
    isRead: false,
  },
  {
    ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
    Type: "Placement",
    Message: "CSX Corporation hiring",
    Timestamp: "2026-04-22 17:51:18",
    isRead: false,
  },
  {
    ID: "81589ada-0ad3-4f77-9554-f52fb558e09d",
    Type: "Event",
    Message: "farewell",
    Timestamp: "2026-04-22 17:51:06",
    isRead: false,
  },
  {
    ID: "0005513a-142b-4bbc-8678-eefec65e1ede",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:50:54",
    isRead: true,
  },
  {
    ID: "ea836726-c25e-4f21-a72f-544a6af8a37f",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:50:42",
    isRead: false,
  },
  {
    ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c",
    Type: "Result",
    Message: "external",
    Timestamp: "2026-04-22 17:50:30",
    isRead: false,
  },
  {
    ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:50:18",
    isRead: true,
  },
  {
    ID: "1cfce5ee-ad37-4894-8946-d707627176a5",
    Type: "Event",
    Message: "tech-fest",
    Timestamp: "2026-04-22 17:50:06",
    isRead: false,
  },
  {
    ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8",
    Type: "Result",
    Message: "project-review",
    Timestamp: "2026-04-22 17:49:54",
    isRead: false,
  },
  {
    ID: "8a7412bd-6065-4d09-8501-a37f11cc848b",
    Type: "Placement",
    Message: "Advanced Micro Devices Inc. hiring",
    Timestamp: "2026-04-22 17:49:42",
    isRead: false,
  },
  {
    ID: "f3c21a90-1bc2-4f88-9c0a-ab123de45678",
    Type: "Placement",
    Message: "Google SWE intern drive",
    Timestamp: "2026-04-22 17:48:30",
    isRead: false,
  },
  {
    ID: "a9b34c12-5e78-4123-b456-cdef01234567",
    Type: "Event",
    Message: "annual sports day",
    Timestamp: "2026-04-22 17:47:00",
    isRead: false,
  },
  {
    ID: "bb001122-3344-5566-7788-99aabbccddee",
    Type: "Result",
    Message: "end-sem grade release",
    Timestamp: "2026-04-22 17:46:10",
    isRead: true,
  },
  {
    ID: "cc112233-4455-6677-8899-aabbccddeeff",
    Type: "Placement",
    Message: "Microsoft MSFTO drive",
    Timestamp: "2026-04-22 17:45:00",
    isRead: false,
  },
  {
    ID: "dd223344-5566-7788-99aa-bbccddeeff00",
    Type: "Event",
    Message: "hackathon registration open",
    Timestamp: "2026-04-22 17:43:00",
    isRead: false,
  },
];
