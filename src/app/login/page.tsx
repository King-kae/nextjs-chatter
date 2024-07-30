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

    if (signinResponse?.error) return setError(signinResponse.error as string);

    if (signinResponse?.ok) return router.push("/dashboard/profile");

    setLoginInProgress(false);

    console.log(signinResponse);
  };
  
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2">{error}</div>
        )}

        <h1 className="text-4xl font-bold mb-7">Login</h1>

        <input
          type="email"
          placeholder="somemail@gmaail.com"
          name="email"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <input
          type="password"
          placeholder="******"
          name="password"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <div className="text-right text-gray-500 mb-4">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button disabled={loginInProgress} className="bg-indigo-500 px-4 py-2" type="submit">
          {loginInProgress ? "Logging in..." : "Login"}
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>

        <GoogleButton />
        <GitHubButton />
      </form>
    </div>
  );
}

export default LoginPage;