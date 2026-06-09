import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Home,
  History,
  HelpCircle,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }

    if (path !== "/dashboard" && location.pathname.includes(path)) {
      return true;
    }

    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="border-b sticky top-0 z-50 bg-white border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <span className="hidden sm:block text-xl font-bold text-slate-800">
                CipherVision
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${
                  isActive("/dashboard")
                    ? "text-blue-500 bg-blue-50"
                    : "text-slate-500"
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => handleNavigation("/history")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${
                  isActive("/history")
                    ? "text-blue-500 bg-blue-50"
                    : "text-slate-500"
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>

              <button
                onClick={() => handleNavigation("/help")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${
                  isActive("/help")
                    ? "text-blue-500 bg-blue-50"
                    : "text-slate-500"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-slate-800">
                    Demo User
                  </p>
                  <p className="text-xs text-slate-500">
                    demo@ciphervision.ai
                  </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-800" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-800" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm ${
                    isActive("/dashboard")
                      ? "text-blue-500 bg-blue-50"
                      : "text-slate-500"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>

                <button
                  onClick={() => handleNavigation("/history")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm ${
                    isActive("/history")
                      ? "text-blue-500 bg-blue-50"
                      : "text-slate-500"
                  }`}
                >
                  <History className="w-5 h-5" />
                  History
                </button>

                <button
                  onClick={() => handleNavigation("/help")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm ${
                    isActive("/help")
                      ? "text-blue-500 bg-blue-50"
                      : "text-slate-500"
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  Help
                </button>

                <div className="sm:hidden mt-4 pt-4 border-t px-4 border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500">
                      <User className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Demo User
                      </p>
                      <p className="text-xs text-slate-500">
                        demo@ciphervision.ai
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      <footer className="border-t mt-auto bg-white border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            © 2026 CipherVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}