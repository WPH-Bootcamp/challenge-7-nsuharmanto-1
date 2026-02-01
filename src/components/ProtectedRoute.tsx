import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../features/store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}