"use client";

import { ProtectedRoute } from "@/core/components/auth/RouteGuard";
import BoardDashboard from "@/core/components/dashboard/board-dashboard";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <BoardDashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage;