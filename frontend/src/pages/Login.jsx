import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import Button from "@/components/Button";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl"
              style={{ backgroundColor: "#3B82F6" }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1
            className="text-center mb-2"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            Welcome to CipherVision
          </h1>

          <p
            className="text-center mb-8"
            style={{
              fontSize: "14px",
              color: "#64748B",
            }}
          >
            Detect and recover hidden encrypted messages from images using
            advanced AI technology
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1E293B",
                }}
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors outline-none"
                style={{
                  borderColor: errors.fullName ? "#EF4444" : "#E2E8F0",
                }}
                placeholder="Enter your full name"
              />

              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1E293B",
                }}
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors outline-none"
                style={{
                  borderColor: errors.email ? "#EF4444" : "#E2E8F0",
                }}
                placeholder="Enter your email"
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
                className="block mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#1E293B",
                }}
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border transition-colors outline-none pr-12"
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Sign In
            </Button>

            <Button variant="outline" fullWidth>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}