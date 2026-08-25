"use client";

import React, { FormEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import GitHubButton from "@/app/components/common/GithubButton";
import GoogleButton from "@/app/components/common/GoogleButton";
import logo from "@/../public/logo.jpg";

function LoginPage() {
  const [error, setError] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginInProgress(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-ink-100 bg-white/90 px-8 py-10 shadow-soft backdrop-blur"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="relative mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl shadow-soft ring-1 ring-ink-100">
            <Image src={logo} alt="Chatter" fill sizes="48px" className="object-cover" />
          </span>
          <h1 className="font-display text-2xl font-bold text-ink-950">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Log in to keep the conversation going.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
        <input
          type="text"
          data-testid="Email"
          placeholder="somemail@example.com"
          name="email"
          className="mb-4 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />

        <label className="mb-1 block text-sm font-medium text-ink-700">Password</label>
        <input
          type="password"
          data-testid="Password"
          placeholder="••••••••"
          name="password"
          className="mb-2 w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <div className="mb-5 text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loginInProgress}
          data-testid="Login"
          className={`w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98] ${
            loginInProgress ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"
          }`}
          type="submit"
        >
          {loginInProgress ? "Logging in..." : "Log in"}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink-400">
          <span className="h-px flex-1 bg-ink-100" />
          or continue with
          <span className="h-px flex-1 bg-ink-100" />
        </div>

        <div className="space-y-2.5">
          <GoogleButton />
          <GitHubButton />
        </div>

        <div className="mt-6 border-t border-ink-100 pt-5 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up here &raquo;
          </Link>
        </div>
      </motion.form>
    </div>
  );
}

export default LoginPage;
