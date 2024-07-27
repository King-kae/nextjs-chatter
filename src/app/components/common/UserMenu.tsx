"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon, UserCircleIcon, } from "@heroicons/react/24/outline";
import Link from "next/link";
import avatar from "../../../../public/default.png";
import Avatar from "../Avatar"
import useCurrentUser from "@/app/hook/useCurrentUser";

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const { data: currentUser, isLoading } = useCurrentUser();
    const handleLogout = () => {
		setIsOpen(false);
		signOut();
        router.push("/");
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
                        <Avatar seed={currentUser?._id} size="small" />
                        {isOpen ? (
                            <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                        )}
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                            
                                <a href={`/user/${currentUser?._id}`} className="block text-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <UserCircleIcon className="h-6 w-6 inline-block text-center" />{" "}
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