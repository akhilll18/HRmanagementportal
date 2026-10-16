import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import PeopleHubApp from "../PeopleHubApp.jsx";

// Simple auth check — stored in localStorage by LoginPage
function isAuthenticated() {
  try {
    return localStorage.getItem("peoplehub-auth") === "true";
  } catch {
    return false;
  }
}

// Wraps protected routes — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/organization/login" element={<LoginPage />} />

      {/* Protected workspace — all internal pages handled by PeopleHubApp */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <PeopleHubApp />
          </ProtectedRoute>
        }
      />

      {/* Fallback — anything unknown → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}