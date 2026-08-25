"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, UserCircle, LogOut } from "lucide-react";
import Avatar from "../Avatar";
import { useLogoutModal } from "@/app/hook/useModal";

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const logoutModal = useLogoutModal();
  const router = useRouter();

  const userId = (session?.user as { _id?: string })?._id;

  return (
    <>
      {session ? (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-x-2 rounded-full py-1 pl-1 pr-2 text-ink-700 transition-colors hover:bg-ink-100"
          >
            <Avatar seed={userId} size="small" />
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-ink-100 bg-white py-1 shadow-soft"
                >
                  <a
                    href={`/user/${userId}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </a>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logoutModal.onOpen();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-ink-700 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <a
          href="/login"
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
        >
          Login
        </a>
      )}
    </>
  );
}

export default UserMenu;
