# Notification_System_Design.md

## Stage 1 — Priority Inbox for Campus Notifications

---

## Problem Statement

Users lose track of important notifications due to high volume. We need a **Priority Inbox** that always surfaces the top `N` most important *unread* notifications, where importance is determined by **type weight** and **recency**.

---

## Approach

### 1. Scoring Formula

Each notification receives a **composite priority score** combining two signals:

```
Score = weightScore × 0.6 + recencyScore × 0.4
```

| Component      | Weight | Rationale                                      |
|----------------|--------|------------------------------------------------|
| `weightScore`  | 60%    | Type importance dominates — business priority  |
| `recencyScore` | 40%    | Freshness matters — stale alerts lose value    |

#### Type Weights

| Type       | Raw Weight | Normalized |
|------------|------------|------------|
| Placement  | 3          | 1.0        |
| Result     | 2          | 0.67       |
| Event      | 1          | 0.33       |

Placement beats Result beats Event. This reflects the real-world importance:
a job-recruitment drive is more time-critical than a grade announcement, which is more critical than a social event.

#### Recency Score — Exponential Decay

```
recencyScore = e^( -ln(2) × ageMs / HALF_LIFE_MS )
```

- `HALF_LIFE_MS = 3,600,000` (1 hour)
- A notification that is 0 hours old scores 1.0
- One that is 1 hour old scores 0.5
- Two hours old: 0.25, and so on

Exponential decay is preferred over linear decay because it:
- Keeps very fresh notifications highly competitive
- Naturally de-prioritises old notifications without a hard cutoff
- Still allows a high-weight old notification (Placement) to outrank a low-weight brand-new one (Event)

---

### 2. Maintaining Top-N Efficiently — Min-Heap

Naively sorting all `n` notifications every time is `O(n log n)`. With continuously arriving notifications we can do better.

**Algorithm:**

1. Compute the newest timestamp across all notifications (`O(n)`) — used to anchor recency.
2. Iterate all notifications once (`O(n)`).
3. Maintain a **min-heap of size N** (min by score, so `heap[0]` is the weakest current top-N candidate).
   - If the heap has fewer than N entries: push and re-heapify.
   - If the current notification's score > `heap[0].score`: replace `heap[0]` and re-heapify.
   - Otherwise: skip.
4. After the full pass, sort the N-element heap descending. (`O(N log N)`)

**Total complexity: `O(n log N)`**, much better than `O(n log n)` when `N << n`.

> The current implementation simulates the heap with a small sorted array for readability at typical campus-notification volumes (hundreds). For millions of notifications, a true binary heap implementation (e.g. via a library) would be substituted without changing the API.

---

### 3. Handling Continuous Incoming Notifications

New notifications arrive every `POLL_INTERVAL_MS` (currently 30 seconds).

**Strategy:**

1. **Merge by ID** — deduplicate using a `Set` of existing IDs. Only truly new notifications are appended.
2. **Re-score from scratch** — after merging, re-run the top-N heap algorithm on the full unread list.

Because the heap pass is `O(n log N)` and `n` grows slowly (campus notification volumes are small), this is efficient in practice.

For large-scale systems, an **event-driven approach** (Kafka / WebSocket push) would replace polling, and the heap could be maintained incrementally:
- On new notification: if `score > heap.min`, replace and re-heapify in `O(log N)`.
- On mark-read: remove from heap and promote the next candidate.

---

### 4. State Management

The app uses React `useReducer` (no external library needed) with these key actions:

| Action            | Effect                                    |
|-------------------|-------------------------------------------|
| `FETCH_SUCCESS`   | Merge & recompute top-N                   |
| `MARK_READ`       | Remove from pool, recompute top-N         |
| `SET_TOP_N`       | Change N, recompute immediately           |
| `ADD_NOTIFICATIONS` | Merge incremental batch, recompute      |

---

### 5. UI/UX Decisions

- **Top-N selector** — user picks 5 / 10 / 15 / 20 from a toggle bar.
- **Score bar** — each card shows a visual progress bar + weight/recency chips so the ranking feels transparent.
- **Rank badge** — explicit `#1`, `#2`… so priority is immediately obvious.
- **Type accent stripes** — orange for Placement, indigo for Result, emerald for Event.
- **Mark as read** — removes the notification from the priority pool and recomputes.

---

### 6. Folder Structure

```
src/
├── types/          # Shared TypeScript interfaces
├── utils/
│   └── priorityEngine.ts   # Scoring & heap logic (pure functions, unit-testable)
├── services/
│   ├── api.ts              # Real API fetch
│   └── mockData.ts         # Local mock for dev
├── context/
│   └── NotificationContext.tsx  # Reducer + Provider + polling
├── hooks/
│   └── useNotificationStats.ts  # Derived stats (memoised)
├── components/     # Pure presentational components
└── pages/          # Page-level layout components
```

---

### 7. Trade-offs & Future Improvements

| Decision | Reasoning | Future improvement |
|----------|-----------|--------------------|
| Poll every 30s | Simple, no infra needed | WebSocket / SSE for true real-time |
| Exponential decay | Smooth, no hard cutoffs | Tune half-life per notification type |
| Min-heap sim (sorted array) | Readable for team review | True binary heap for 10k+ notifications |
| No DB | Not required per spec | Persist read-state in localStorage / IndexedDB |
| Mock data toggle | Develop without real API | Remove `USE_MOCK` flag before deploy |




