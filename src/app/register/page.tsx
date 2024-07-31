"use client";

import axios, { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import GoogleButton from "@/app/components/common/GoogleButton";
import GitHubButton from "@/app/components/common/GithubButton";
import Link from "next/link";
import Joi from "joi";

function RegisterPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter();

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
      const signupResponse = await axios.post("/api/auth/register", {
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
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'An error occurred during registration');
      }
    }
    setLoading(false);
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <form onSubmit={handleSubmit} className="bg-neutral-950 px-8 py-10 w-3/12">
        {error && <div className="bg-red-500 text-white px-4 py-2">{error}</div>}

        <h1 className="text-4xl font-bold mb-7">Signup</h1>

        <input
          type="text"
          placeholder="John Doe"
          name="username"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <input
          type="email"
          placeholder="somemail@gmail.com"
          name="email"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <input
          type={showPassword ? "text" : "password" }
          placeholder="******"
          name="password"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <button  
          type="button"
          className="absolute right-4 top-4"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
        <input
          type={showConfirmPassword ? "text" : "password" }
          placeholder="******"
          name="confirm-password"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />
        <button  
          type="button"
          className="absolute right-4 top-4"
          onClick={() => setShowConfirmPassword(!showPassword)}
        >
          {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
        </button>

        <button className="bg-indigo-500 px-4 py-2" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <GoogleButton />
        <GitHubButton />
        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Existing account?{' '}
          <Link className="underline" href={'/login'}>Login here &raquo;</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
