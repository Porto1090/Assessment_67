import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Home,
  History,
  HelpCircle,
  User,
  Menu,
  X,
  Languages,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function RootLayout({ username, email }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.includes(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navButtonClass = (path) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
      isActive(path)
        ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 font-semibold"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
    }`;

  const mobileNavButtonClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-base transition-all ${
      isActive(path)
        ? "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 font-semibold"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 antialiased selection:bg-blue-500/10">
      <nav className="border-b sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800/80">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LADO IZQUIERDO: Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <span className="hidden sm:block text-xl font-bold text-slate-800 dark:text-white">
                CipherVision
              </span>
            </div>

            {/* CENTRO: Navegación Principal (Reducción de gaps para un aspecto compacto) */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => handleNavigation("/dashboard")} className={navButtonClass("/dashboard")}>
                <Home className="w-4 h-4" />
                {t.nav.home}
              </button>
              <button onClick={() => handleNavigation("/history")} className={navButtonClass("/history")}>
                <History className="w-4 h-4" />
                {t.nav.history}
              </button>
              <button onClick={() => handleNavigation("/help")} className={navButtonClass("/help")}>
                <HelpCircle className="w-4 h-4" />
                {t.nav.help}
              </button>
            </div>

            {/* LADO DERECHO: Acciones / Configuración */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition"
              >
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                {language === "en" ? "EN" : "ES"}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="min-w-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition"
              >
                {theme === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {theme === "light" ? t.nav.lightmode : t.nav.darkmode}
              </button>

              {/* Perfil del Usuario */}
              <div className="hidden sm:flex items-center gap-3 ml-4">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {email}
                  </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Gatillo Menú Móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-800 dark:text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-800 dark:text-white" />
                )}
              </button>
            </div>
          </div>

          {/* MENÚ MÓVIL (Estructura interna estilizada) */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={mobileNavButtonClass("/dashboard")}
                >
                  <Home className="w-5 h-5" />
                  {t.nav.home}
                </button>

                <button
                  onClick={() => handleNavigation("/history")}
                  className={mobileNavButtonClass("/history")}
                >
                  <History className="w-5 h-5" />
                  {t.nav.history}
                </button>

                <button
                  onClick={() => handleNavigation("/help")}
                  className={mobileNavButtonClass("/help")}
                >
                  <HelpCircle className="w-5 h-5" />
                  {t.nav.help}
                </button>

                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-slate-500 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
                >
                  <Languages className="w-5 h-5" />
                  {language === "en" ? "English" : "Español"}
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-slate-500 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600"
                >
                 {theme === "light" ? (
                 <Sun className="w-5 h-5" />
                 ) : (
                 <Moon className="w-5 h-5" />
                 )}
                 {theme === "light" ? t.nav.lightmode : t.nav.darkmode}
                </button>

                {/* Perfil en móvil unificado sin saltos extraños */}
                <div className="sm:hidden mt-4 ml-4 pt-4 border-t px-4 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500">
                      <User className="w-5 h-5 text-white" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {username}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 bg-slate-50 dark:bg-slate-900">
        <Outlet />
      </main>

      <footer className="border-t mt-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 CipherVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}