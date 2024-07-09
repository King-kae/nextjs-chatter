// "use client";
// import {signIn} from "next-auth/react";
// import Image from "next/image";
// import React, {useState} from "react";
// import { useRouter} from "next/navigation";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [creatingUser, setCreatingUser] = useState(false);
//   const [userCreated, setUserCreated] = useState(false);
//   const [error, setError] = useState(false);
//   async function handleFormSubmit(ev: any) {
//     ev.preventDefault();
//     setCreatingUser(true);
//     setError(false);
//     setUserCreated(false);
//     const response = await fetch('/api/register', {
//       method: 'POST',
//       body: JSON.stringify({email, password}),
//       headers: {'Content-Type': 'application/json'},
//     });
//     if (response.ok) {
//       console.log('User created');
//       router.push('/login')
//       setUserCreated(true);
//     }
//     else {
//       setError(true);
//     }
//     setCreatingUser(false);
//   }
//   return (
//     <section className="mt-8">
//       <h1 className="text-center text-primary text-4xl mb-4">
//         Register
//       </h1>
//       {userCreated && (
//         <div className="my-4 text-center">
//           User created.<br />
//           Now you can{' '}
//           <Link className="underline" href={'/login'}>Login &raquo;</Link>
//         </div>
//       )}
//       {error && (
//         <div className="my-4 text-center">
//           An error has occurred.<br />
//           Please try again later
//         </div>
//       )}
//       <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
//         <input className="bg-black" type="email" placeholder="email" value={email}
//                disabled={creatingUser}
//                onChange={ev => setEmail(ev.target.value)} />
//         <input className="bg-black" type="password" placeholder="password" value={password}
//                disabled={creatingUser}
//                 onChange={ev => setPassword(ev.target.value)}/>
//         <button className="bg-black" type="submit" disabled={creatingUser}>
//           Register
//         </button>
//         <div className="my-4 text-center text-gray-500">
//           or login with provider
//         </div>
//         <GoogleButton />
//         <GitHubButton />
//         <div className="text-center my-4 text-gray-500 border-t pt-4">
//           Existing account?{' '}
//           <Link className="underline" href={'/login'}>Login here &raquo;</Link>
//         </div>
//       </form>
//     </section>
//   );
// }


"use client";

import axios, {AxiosError} from "axios";
import { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import GoogleButton from "@/app/components/common/GoogleButton";
import GitHubButton from "@/app/components/common/GithubButton";
import Link from "next/link";


function RegisterPage() {

  const [error, setError] = useState();
  const router = useRouter();                     

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");


    try {
      const signupResponse = await axios
      .post("/api/auth/register", {
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
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
        setError(error.response?.data?.message);
      }
    }
};


  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center" >
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
          type="password"
          placeholder="******"
          name="password"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
        />

        <button className="bg-indigo-500 px-4 py-2" type="submit">Signup</button>
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