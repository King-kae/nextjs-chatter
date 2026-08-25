"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("email", email);

    try {
      setLoading(true);
      const response = await apiClient.post("/api/auth/forgot-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-ink-100 bg-white/90 px-8 py-10 shadow-soft backdrop-blur"
      >
        {success ? (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <MailCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-xl font-bold text-ink-950">Check your inbox</h1>
            <p className="mt-2 text-sm text-ink-500">
              {message || "A password reset link is on its way to your email address."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1 className="mb-2 text-center font-display text-2xl font-bold text-ink-950">
              Forgot password?
            </h1>
            <p className="mb-6 text-center text-sm text-ink-500">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
                {error}
              </div>
            )}

            <input
              type="text"
              id="email"
              placeholder="somemail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-5 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98] ${
                loading ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"
              }`}
            >
              {loading ? "Sending..." : "Send reset email"}
            </button>

            <div className="mt-6 border-t border-ink-100 pt-5 text-center text-sm text-ink-500">
              Remembered your password?{" "}
              <a href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Log in here &raquo;
              </a>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
