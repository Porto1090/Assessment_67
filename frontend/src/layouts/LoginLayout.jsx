import { Outlet } from "react-router-dom";
import {
  Shield,
  Languages,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function LoginLayout({username, email}) {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 antialiased">
      <nav className="border-b sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800/80">
        <div className="mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo izquierda */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <span className="hidden md:block text-xl font-bold text-slate-800 dark:text-white">
                CipherVision
              </span>
            </div>

            {/* Acciones derecha */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition"
              >
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                {language === "en" ? "EN" : "ES"}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="min-w-16 justify-center hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition"
              >
                {theme === "light" ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}

                {theme === "light"
                  ? t.nav.lightmode
                  : t.nav.darkmode}
              </button>
            </div>

          </div>
        </div>
      </nav>

      <main className="flex-1 bg-slate-50 dark:bg-slate-900 pt-8">
        <Outlet />
      </main>
    </div>
  );
}