import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import CreateAccount from "@/pages/CreateAccount";
import Dashboard from "@dashboard/index";
import History from "@/pages/History";
import Help from "@/pages/Help";
import NotFound from "@/pages/NotFound";

import RootLayout from "@/layouts/RootLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/create-account"
        element={<CreateAccount />}
      />

      <Route element={<RootLayout username="John Doe" email="demo@ciphervision.ai" />}>
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

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}