"use client";

import { apiClient, ApiError } from "@/lib/api";
import React, { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import GoogleButton from "@/app/components/common/GoogleButton";
import GitHubButton from "@/app/components/common/GithubButton";
import Link from "next/link";
import Joi from "joi";

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
    return null; // Prevent rendering the form
  }

  // Define the Joi schema for form validation
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      'string.base': 'Username should be a type of text',
      'string.empty': 'Username is required',
      'string.min': 'Username should have a minimum length of 3 characters',
      'string.max': 'Username should have a maximum length of 30 characters',
      'any.required': 'Username is required',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password should have a minimum length of 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || '';
    const email = formData.get("email")?.toString() || '';
    const password = formData.get("password")?.toString() || '';
    const confirmPassword = formData.get("confirm-password")?.toString() || '';

    // Validate the form data
    const { error: validationError } = schema.validate({ username, email, password, confirmPassword }, { abortEarly: false });
    if (validationError) {
      setError(validationError.details.map(detail => detail.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      const signupResponse = await apiClient.post("/api/auth/register", {
        username,
        email,
        password,
      });

      console.log(signupResponse);

      const signinResponse = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signinResponse?.ok) return router.push('/');

      console.log(signinResponse);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        setError(error.response?.data?.message || 'An error occurred during registration');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-mesh p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-3xl border border-ink-100 bg-white/90 px-8 py-10 shadow-soft backdrop-blur"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-2xl font-bold text-ink-950 md:text-3xl">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-500">Join Chatter and start sharing your story.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />

          <input
            type="text"
            placeholder="somemail@example.com"
            name="email"
            className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 pr-10 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="confirm-password"
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 pr-10 text-ink-900 placeholder-ink-400 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          className={`w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition active:scale-[0.98] ${
            loading ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"
          }`}
          type="submit"
          data-testid="Sign Up"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink-400">
          <span className="h-px flex-1 bg-ink-100" />
          or sign up with
          <span className="h-px flex-1 bg-ink-100" />
        </div>

        <div className="flex flex-col space-y-2.5">
          <GoogleButton />
          <GitHubButton />
        </div>

        <div className="border-t border-ink-100 pt-5 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link className="font-semibold text-brand-600 hover:text-brand-700" href={"/login"}>
            Login here &raquo;
          </Link>
        </div>
      </motion.form>
    </div>
  );
}

export default RegisterPage;
