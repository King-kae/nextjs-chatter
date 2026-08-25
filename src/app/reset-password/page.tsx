"use client";

import React, { useState, Suspense } from "react";
import { apiClient } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // console.log(token);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post("/api/auth/reset-password", {
        token,
        password,
      });

      setTimeout(() => {
        setMessage(response.data.message);
        setLoading(false);
        router.push("/login");
      }, 8000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-ink-100 bg-white/90 px-8 py-10 shadow-soft backdrop-blur"
      >
        <h1 className="mb-6 text-center font-display text-2xl font-bold text-ink-950">
          Reset password
        </h1>

        {message && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 pr-10 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="relative mb-5">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 pr-10 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          className={`w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98] ${
            loading ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting password..." : "Reset password"}
        </button>
      </motion.form>
    </div>
  );
};

const ResetPasswordPageWrapper = () => (
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-ink-400">Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>
);

export default ResetPasswordPageWrapper;
