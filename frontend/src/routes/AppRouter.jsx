import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/features/auth/pages/LoginPage";
import CreateAccount from "@/features/auth/pages/CreateAccount";
import NotFound from "@/pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/create-account"
        element={<CreateAccount />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}