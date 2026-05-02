// src/App.tsx

import React from "react";
import { NotificationProvider } from "./context/NotificationContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <NotificationProvider>
      <div className="app-shell">
        <Navbar />
        <Home />
      </div>
    </NotificationProvider>
  );
}
