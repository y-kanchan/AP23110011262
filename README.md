# Frontend Track Submission - Priority Inbox

This repository contains the **Frontend Track** submission for the Campus Platform. The core of this project is the **Priority Inbox**, an intelligent notification dashboard designed to help students manage campus alerts efficiently.

## Project Overview

The submission focuses on a premium user interface and a sophisticated **Priority Engine** that ensures critical notifications (like career placements and results) are always at the top.

```
.
├── .gitignore
├── .env.example                        ← Copy to .env and fill credentials
├── Notification_System_Design.md       ← Stages 1–6 design document
│
├── logging_middleware/
│   ├── index.js                        ← Reusable Log() utility
│   └── package.json
│
├── vehicle_maintence_scheduler/
│   ├── index.js                        ← Entry point (run with node index.js)
│   ├── scheduler.js                    ← 0/1 Knapsack DP algorithm
│   └── package.json
│
├── notification_app_be/                ← Backend REST API (Stages 1-6)
│   ├── package.json
│   └── src/
│       ├── app.js                      ← Express entry point
│       └── ...
│
└── notification_app_fe/                ← Frontend Priority Inbox (React)
    ├── package.json
    └── src/                            ← UI Components and Priority Engine
```

## Features

### 1. Priority Inbox (Frontend)
An intelligent notification system that ranks campus alerts based on a **Weighted-Recency Algorithm**:
- **Categorized Weights**: Career/Placement (Highest) > Academic/Results > Campus Events.
- **Time Decay**: Recent notifications score higher, while older ones naturally move down.
- **Humanized Codebase**: Variable and function names refactored for maximum readability and maintainability.

### 2. Vehicle Maintenance Scheduler
A specialized microservice implementing the **0/1 Knapsack Dynamic Programming algorithm** to optimize daily maintenance tasks within fixed hour constraints.

### 3. Reusable Logging Middleware
A standardized logging package supporting various stack levels and modules with clean formatting and timestamping.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Frontend Setup (Priority Inbox)
1. Navigate to `notification_app_fe/`
2. Create a `.env` file based on `.env.example` with your `VITE_API_URL`.
3. Run `npm install`
4. Run `npm run dev` to launch the premium dashboard.

### Maintenance Scheduler Setup
1. Navigate to `vehicle_maintence_scheduler/`
2. Run `node index.js` to see the DP algorithm in action.

### Backend Setup
1. Navigate to `notification_app_be/`
2. Run `npm install`
3. Run `npm start`

## Design & Implementation
For detailed information on the Scoring Formula, Priority Engine, and API Architecture, please refer to [Notification_System_Design.md](./Notification_System_Design.md).
