import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

import RootLayout from "@/pages/RootLayout";

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Área principal de CipherVision */}
      <Route element={<RootLayout />}>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/help"
          element={<Help />}
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}