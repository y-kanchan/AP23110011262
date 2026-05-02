import React from "react";  
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { SetupForm } from "./components/SetupForm";

function AppContent() {
  const { state } = useNotifications();

  return (
    <div className="app-shell">
      <Navbar />
      {state.token ? <Home /> : <SetupForm />}
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}



