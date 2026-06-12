import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import Dashboard from "@dashboard/index";
import History from "@/pages/History";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";
import RootLayout from "@/layouts/RootLayout";
import LoginLayout from "@/layouts/LoginLayout";
import ProtectedRoute from "@/routers/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";

export default function AppRouter() {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />

      <Route element={<LoginLayout/>}>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Route>


      {/* Privadas */}
      <Route
        element={
          <ProtectedRoute>
            <RootLayout username={user?.username} email={user?.email} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/help" element={<Help />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}