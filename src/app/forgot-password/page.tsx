"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("email", email);

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/forgot-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
    //   router.push("/reset-password");
    setLoading(false);
    setSuccess(true);

    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {success ? (
        <div className="bg-green-500 text-white px-4 py-2">Reset link sent to your email address.</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
          <h1 className="text-4xl font-bold mb-7">Forgot Password</h1>

          {message && <div className="bg-green-500 text-white px-4 py-2">{message}</div>}
          {error && <div className="bg-red-500 text-white px-4 py-2">{error}</div>}

          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          />

          <button type="submit" className={`bg-blue-500 cursor-pointer text-white px-4 py-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? "Sending" : "Send Reset Email" }
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
