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

export default function CreateAccount() {
  const navigate = useNavigate();

  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const t = {
    en: {
      title: "Create your account",
      subtitle: "Create an account to start analyzing hidden encrypted messages.",
      username: "Username",
      usernamePlaceholder: "Enter your username",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      createAccount: "Create Account",
      backToSignIn: "Back to Sign In",
      usernameRequired: "Username is required",
      emailRequired: "Email is required",
      invalidEmail: "Please enter a valid email",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 6 characters",
    },

    es: {
      title: "Crea tu cuenta",
      subtitle: "Crea una cuenta para comenzar a analizar mensajes cifrados ocultos.",
      username: "Usuario",
      usernamePlaceholder: "Ingresa tu usuario",
      email: "Correo electrónico",
      emailPlaceholder: "Ingresa tu correo",
      password: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      createAccount: "Crear Cuenta",
      backToSignIn: "Volver a Iniciar Sesión",
      usernameRequired: "El usuario es obligatorio",
      emailRequired: "El correo es obligatorio",
      invalidEmail: "Ingresa un correo válido",
      passwordRequired: "La contraseña es obligatoria",
      passwordLength: "La contraseña debe tener al menos 6 caracteres",
    },
  }[language];

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = t.usernameRequired;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.password) {
      newErrors.password = t.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordLength;
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

  const pageBg = isDark ? "bg-slate-900" : "bg-slate-50";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const titleText = isDark ? "text-white" : "text-slate-800";
  const bodyText = isDark ? "text-slate-300" : "text-slate-500";
  const labelText = isDark ? "text-slate-200" : "text-slate-800";

  const controlButtonClass = `flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
    isDark
      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
      : "border-slate-200 text-slate-600 hover:bg-blue-50"
  }`;

  const inputClass = `w-full px-4 py-3 rounded-lg border transition-colors outline-none ${
    isDark
      ? "bg-slate-900 text-white placeholder:text-slate-500 border-slate-700"
      : "bg-white text-slate-800 placeholder:text-slate-400 border-slate-200"
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${pageBg}`}>
      <div className="absolute top-5 right-5 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleLanguage}
          className={controlButtonClass}
        >
          <Languages className="w-4 h-4" />
          {language === "en" ? "EN" : "ES"}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className={controlButtonClass}
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
        <div className={`${cardBg} rounded-2xl shadow-lg p-8`}>
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className={`text-center mb-2 text-3xl font-bold ${titleText}`}>
            {t.title}
          </h1>

          <p className={`text-center mb-8 text-sm ${bodyText}`}>
            {t.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="userName"
                className={`block mb-2 text-sm font-medium ${labelText}`}
              >
                {t.username}
              </label>

              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                className={inputClass}
                style={{
                  borderColor: errors.userName ? "#EF4444" : undefined,
                }}
                placeholder={t.usernamePlaceholder}
              />

              {errors.userName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.userName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block mb-2 text-sm font-medium ${labelText}`}
              >
                {t.email}
              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
                style={{
                  borderColor: errors.email ? "#EF4444" : undefined,
                }}
                placeholder={t.emailPlaceholder}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block mb-2 text-sm font-medium ${labelText}`}
              >
                {t.password}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`${inputClass} pr-12`}
                  style={{
                    borderColor: errors.password ? "#EF4444" : undefined,
                  }}
                  placeholder={t.passwordPlaceholder}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${
                    isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
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
              {t.createAccount}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate("/login")}
            >
              {t.backToSignIn}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}