import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Shield,
  Languages,
  Sun,
  Moon,
} from "lucide-react";

import Button from "@/components/Button";
import { useLanguage } from "@/translations/LanguageContext";
import { useTheme } from "@/theme/ThemeContext";

export default function Login() {
  const navigate = useNavigate();

  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const t = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to continue using CipherVision.",
      username: "Username",
      usernamePlaceholder: "Enter your username",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      signIn: "Sign In",
      createAccount: "Create Account",
      usernameRequired: "Username is required",
      passwordRequired: "Password is required",
    },

    es: {
      title: "Bienvenido",
      subtitle: "Inicia sesión para continuar usando CipherVision.",
      username: "Usuario",
      usernamePlaceholder: "Ingresa tu usuario",
      password: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      signIn: "Iniciar Sesión",
      createAccount: "Crear Cuenta",
      usernameRequired: "El usuario es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
    },
  }[language];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = t.usernameRequired;
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      navigate("/dashboard");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 relative ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Top Right Controls */}
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleLanguage}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
            isDark
              ? "border-slate-700 text-slate-300"
              : "border-slate-200 text-slate-600"
          }`}
        >
          <Languages className="w-4 h-4" />
          {language === "en" ? "EN" : "ES"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
            isDark
              ? "border-slate-700 text-slate-300"
              : "border-slate-200 text-slate-600"
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}

          {isDark ? "Dark" : "Light"}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl shadow-lg p-8 ${
            isDark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1
            className={`text-center mb-2 text-3xl font-bold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            {t.title}
          </h1>

          <p
            className={`text-center mb-8 text-sm ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {t.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="userName"
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                {t.username}
              </label>

              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  handleChange("userName", e.target.value)
                }
                placeholder={t.usernamePlaceholder}
                className={`w-full px-4 py-3 rounded-lg border outline-none ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white"
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              />

              {errors.userName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.userName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                {t.password}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  placeholder={t.passwordPlaceholder}
                  className={`w-full px-4 py-3 rounded-lg border outline-none pr-12 ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth>
              {t.signIn}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate("/create-account")}
            >
              {t.createAccount}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}