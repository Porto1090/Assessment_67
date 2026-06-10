import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import Button from "@/components/Button";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center mb-2 text-3xl font-bold text-slate-800">
            Welcome back
          </h1>

          <p className="text-center mb-8 text-sm text-slate-500">
            Sign in to continue using CipherVision.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="userName" className="block mb-2 text-sm font-medium text-slate-800">
                Username/Email
              </label>

              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  borderColor: errors.userName ? "#EF4444" : "#E2E8F0",
                }}
                placeholder="Enter your username or email"
              />

              {errors.userName && (
                <p className="mt-1 text-xs text-red-500">{errors.userName}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-800">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border outline-none pr-12"
                  style={{
                    borderColor: errors.password ? "#EF4444" : "#E2E8F0",
                  }}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate("/create-account")}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}