"use client";

import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GitHubButton from "@/app/components/common/GithubButton";
import GoogleButton from "@/app/components/common/GoogleButton"

function LoginPage() {
  const [error, setError] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginInProgress(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const signinResponse = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signinResponse?.error) {
      setError(signinResponse.error as string);
      setLoginInProgress(false);
      return;
    }

    if (signinResponse?.ok) {
      router.push("/dashboard/profile");
    }

    console.log(signinResponse);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-white">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg shadow-lg px-8 py-10 w-full max-w-md">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">{error}</div>
        )}

        <h1 className="text-3xl font-semibold mb-6 text-center">Log In</h1>
        <input
          type="email"
          data-testid='Email'
          placeholder="somemail@example.com"
          name="email"
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500"
          required
        />
        <input
          type="password"
          data-testid='Password'
          placeholder="******"
          name="password"
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-black placeholder-gray-500"
          required
        />
        <div className="text-right text-gray-500 mb-4">
          <a href="/forgot-password" className="underline">Forgot password?</a>
        </div>

        <button 
          disabled={loginInProgress} 
          className={`bg-black text-white rounded px-4 py-2 w-full ${loginInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
        >
          {loginInProgress ? "Logging in..." : "Login"}
        </button>

        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>

        <GoogleButton />
        <GitHubButton />

        <div className="text-center mt-4 text-gray-500 border-t pt-4">
          Don&apos;t have an account?{' '}
          <a href="/register" className="underline">Sign up here &raquo;</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
