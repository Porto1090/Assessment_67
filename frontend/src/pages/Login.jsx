import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/translations/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuthContext();
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t.login.usernameRequired;
    }

    if (!formData.password) {
      newErrors.password = t.login.passwordRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">

          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center mb-2 text-3xl font-bold text-slate-800 dark:text-white">
            {t.login.title}
          </h1>

          <p className="text-center mb-8 text-sm text-slate-500 dark:text-slate-400">
            {t.login.subtitle}
          </p>

          {authError && (
            <p className="mb-4 text-sm text-center text-red-500 bg-red-50 dark:bg-red-950/20 py-2 px-4 rounded-lg">
              {authError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.login.usernameEmailLabel}
              </label>

              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder={t.login.usernameEmailPlaceholder}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  outline-none
                  bg-white
                  dark:bg-slate-900
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  dark:placeholder:text-slate-500
                "
                style={{
                  borderColor: errors.username ? "#EF4444" : "#E2E8F0",
                }}
              />

              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.login.passwordLabel}
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="
                    w-full
                    px-4
                    py-3
                    pr-12
                    rounded-lg
                    border
                    outline-none
                    bg-white
                    dark:bg-slate-900
                    text-slate-900
                    dark:text-white
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                  "
                  style={{
                    borderColor: errors.password ? "#EF4444" : "#E2E8F0",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-1
                    rounded-md
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                  "
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? t.login.signingin : t.login.signin}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate("/create-account")}
            >
              {t.login.createAccount}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}