# Priority Inbox — Campus Notifications

A **React + TypeScript** application that surfaces the most important campus notifications using a **Weight-Recency Hybrid** priority scoring algorithm.

![Orange & White Theme](https://img.shields.io/badge/theme-orange%20%26%20white-ff6b00)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-5-646cff)

---

## Features

- **Top-N Priority Inbox** — Displays the top 5 / 10 / 15 / 20 most important unread notifications, selectable by the user.
- **Weight-Recency Scoring** — Each notification is scored using:
  ```
  Score = Weight × 0.6 + Recency × 0.4
  ```
  | Type      | Weight |
  |-----------|--------|
  | Placement | 3      |
  | Result    | 2      |
  | Event     | 1      |

  Recency uses **exponential decay** with a 1-hour half-life so fresh notifications bubble up naturally.

- **Efficient Ranking** — Uses a min-heap (O(n log N)) to maintain the top-N set without sorting the entire list.
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile screens.
- **Auto-Polling** — Re-fetches notifications every 30 seconds and merges new ones into the ranked inbox.
- **Mark as Read** — Marking a notification as read removes it from the priority inbox and recalculates rankings in real time.

---

## Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Framework | React 18 + TypeScript |
| Build     | Vite 5               |
| Styling   | Vanilla CSS (Orange & White theme) |
| Icons     | Lucide React         |
| API       | REST (Bearer token auth) |

---

## Project Structure

```
priority-inbox/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env                          # API token (VITE_API_TOKEN)
└── src/
    ├── App.tsx                   # Root component
    ├── main.tsx                  # Entry point
    ├── index.css                 # Full design system (Orange & White)
    ├── components/
    │   ├── Navbar.tsx            # Top navigation bar
    │   ├── StatsBar.tsx          # Summary cards (Placement/Result/Event/Total)
    │   ├── TopNSelector.tsx      # Top-N toggle (5/10/15/20)
    │   ├── NotificationCard.tsx  # Individual notification with score bar
    │   ├── ScoreBar.tsx          # Visual score indicator
    │   ├── EmptyState.tsx        # Empty inbox placeholder
    │   └── LoadingSkeleton.tsx   # Skeleton loader animation
    ├── context/
    │   └── NotificationContext.tsx  # Global state & polling logic
    ├── hooks/
    │   └── useNotificationStats.ts # Derived stats (counts by type)
    ├── pages/
    │   └── Home.tsx              # Main inbox page
    ├── services/
    │   ├── api.ts                # API client (fetch notifications)
    │   └── mockData.ts           # Sample data for local development
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    └── utils/
        └── priorityEngine.ts     # Scoring algorithm & min-heap
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
cd priority-inbox
npm install
```

### Run (Development)

```bash
npm run dev
# → http://localhost:5173
```

The app launches with **mock data** by default so you can explore the UI immediately.

### Connect to Real API

1. Open `src/context/NotificationContext.tsx` and set:
   ```ts
   const USE_MOCK = false;
   ```
2. Add your Bearer token to the `.env` file:
   ```
   VITE_API_TOKEN=your_actual_token_here
   ```
3. Restart the dev server (`npm run dev`).

---

## Priority Algorithm

The scoring engine lives in `src/utils/priorityEngine.ts`:

1. **Weight Score** — Normalized type weight (Placement=3, Result=2, Event=1) mapped to 0–1.
2. **Recency Score** — Exponential decay: `e^(-λ × hours_old)` with a 1-hour half-life (`λ = ln2`).
3. **Combined Score** — `0.6 × weight + 0.4 × recency`.
4. **Top-N Selection** — A min-heap of size N ensures O(n log N) efficiency.

---

## Screenshots

The application uses a clean **Orange & White** theme with responsive layouts for both desktop and mobile devices.

---

## License

MIT
