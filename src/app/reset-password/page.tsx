"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message);
      router.push('/login');
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        <h1 className="text-4xl font-bold mb-7">Reset Password</h1>

        {message && <div className="bg-green-500 text-white px-4 py-2">{message}</div>}
        {error && <div className="bg-red-500 text-white px-4 py-2">{error}</div>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <button className="bg-indigo-500 px-4 py-2 w-full" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
