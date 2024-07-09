"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const handleLogout = () => {
		setIsOpen(false);
		signOut();
        router.push("/login");
	};
    const router = useRouter();
    return (
        <>
          {
            session ? (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-x-2 text-gray-700"
                    >
                        <span className="text-sm font-semibold">{session.user?.name}</span>
                        <Image 
                            src={session.user?.image ?? ''}
                            alt="profile picture"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        {isOpen ? (
                            <ChevronUpDownIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                            
                                <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile
                                </a>
                            
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                
                    <a href="/login" className="text-sm font-semibold text-gray-700">Login</a>
                
            )
          }
        </>
    )
}

export default UserMenu;