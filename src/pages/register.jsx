import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReusableButton from "../components/reusableButton";
import { registerUser } from "../utils/api";

const initialForm = {
  name: "",
  email: "",
  userName: "",
  phone: "",
  country: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordMismatch = useMemo(() => {
    if (!formData.confirmPassword) {
      return false;
    }
    return formData.password !== formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    const userName = formData.userName.trim();
    if (!/^[A-Za-z0-9]{3,20}$/.test(userName)) {
      setError(
        "Username must be 3-20 characters and contain only letters and numbers.",
      );
      return;
    }

    if (!/^\+?[0-9]{11,15}$/.test(formData.phone.trim())) {
      setError("Phone number must be 11 to 15 digits and may start with +.");
      return;
    }

    if (!strongPasswordRegex.test(formData.password)) {
      setError(
        "Password must be 8-30 chars and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        userName,
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        password: formData.password,
      };

      const response = await registerUser(payload);
      setSuccessMessage(
        response?.message || "Registration successful. Redirecting...",
      );
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-red-50 via-white to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-[1.05fr_1fr]">
        <section className="bg-slate-900 text-slate-100 p-8 sm:p-10 lg:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-300">
            Join MealTown
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
            Create your delivery account
          </h1>
          <p className="mt-4 text-slate-300 max-w-md">
            Sign up to discover local meals, reorder favorites quickly, and
            track every rider update from checkout to doorstep.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
              <p className="font-semibold text-white">Quick Checkout</p>
              <p className="mt-1 text-slate-300">
                Save your details for faster orders.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
              <p className="font-semibold text-white">Real-Time Tracking</p>
              <p className="mt-1 text-slate-300">
                Get rider updates from pickup to delivery.
              </p>
            </div>
          </div>
          <p className="mt-10 text-sm text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-300 hover:text-red-200 font-semibold"
            >
              Log in
            </Link>
          </p>
        </section>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 lg:p-12">
          <h2 className="text-2xl font-bold text-slate-900">Register</h2>
          <p className="mt-2 text-sm text-slate-600">
            Fill in your details to get started.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ayo Daniels"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </span>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="mealuser"
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
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234..."
                autoComplete="tel"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Country
              </span>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Nigeria"
                autoComplete="country"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8-30 chars, upper/lower/number/symbol"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </span>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`w-full rounded-xl border px-4 py-3 pr-20 outline-none transition focus:ring-2 ${
                    passwordMismatch
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-300 focus:border-red-500 focus:ring-red-100"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I agree to the terms and conditions and consent to account
              creation.
            </span>
          </label>

          <ReusableButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="mt-8 w-full"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </ReusableButton>
        </form>
      </div>
    </div>
  );
}

export default Register;
