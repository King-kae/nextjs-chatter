"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Icons for visibility toggle

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
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message);
      router.push('/login');
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        <h1 className="text-4xl font-bold mb-7">Reset Password</h1>

        {message && <div className="bg-green-500 text-white px-4 py-2">{message}</div>}
        {error && <div className="bg-red-500 text-white px-4 py-2">{error}</div>}

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 px-4 py-2 block w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2 text-white"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative mb-2">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-zinc-800 px-4 py-2 block w-full"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 px-3 py-2 text-white"
          >
            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <button
          className={`bg-indigo-500 px-4 py-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
