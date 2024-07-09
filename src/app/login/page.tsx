// 'use client';
// import {signIn} from "next-auth/react";
// // import Image from "next/image";
// import React, {useState} from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginInProgress, setLoginInProgress] = useState(false);

//   async function handleFormSubmit(ev: any) {
//     ev.preventDefault();
//     setLoginInProgress(true);

//     await signIn('credentials', {email, password, callbackUrl: '/'});

//     setLoginInProgress(false);
//   }
//   return (
//     <section className="mt-8">
//       <h1 className="text-center text-primary text-4xl mb-4">
//         Login
//       </h1>
//       <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
//         <input className="bg-black" type="email" name="email" placeholder="email" value={email}
//                disabled={loginInProgress}
//                onChange={ev => setEmail(ev.target.value)} />
//         <input className="bg-black" type="password" name="password" placeholder="password" value={password}
//                disabled={loginInProgress}
//                onChange={ev => setPassword(ev.target.value)}/>
//         <button className="bg-black" disabled={loginInProgress} type="submit">Login</button>
//       </form>
//     </section>
//   );
// }


"use client";

import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GitHubButton from "@/app/components/common/GithubButton";
import GoogleButton from "@/app/components/common/GoogleButton"

function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

        <button className="bg-indigo-500 px-4 py-2" type="submit">
          Login
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