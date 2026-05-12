import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReusableButton from "../components/reusableButton";
import { loginUser } from "../utils/api";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const userName = formData.userName.trim();
    if (!/^[A-Za-z0-9]{3,20}$/.test(userName)) {
      setError("Username must be 3-20 characters and contain only letters and numbers.");
      return;
    }

    if (!strongPasswordRegex.test(formData.password)) {
      setError(
        "Password must be 8-30 chars and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser({ ...formData, userName });
      navigate("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-100 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        <div className="hidden lg:flex bg-red-700 text-white p-10 flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-200">MealTown</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">Welcome Back</h2>
            <p className="mt-4 text-red-100">
              Log in to continue ordering your favorite meals and track deliveries in real time.
            </p>
          </div>
          <p className="text-sm text-red-200">Fast food delivery, made personal.</p>
        </div>

        <form className="p-8 sm:p-10" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            New here?{" "}
            <Link to="/register" className="font-semibold text-red-600 hover:text-red-700">
              Create an account
            </Link>
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                minLength={3}
                maxLength={20}
                pattern="[A-Za-z0-9]{3,20}"
                title="3-20 letters or numbers only"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  minLength={8}
                  maxLength={30}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}"
                  title="8-30 chars with uppercase, lowercase, number, and special character"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          </div>

          <ReusableButton type="submit" variant="primary" disabled={isSubmitting} className="mt-8 w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </ReusableButton>
        </form>
      </div>
    </div>
  );
}

export default Login;
