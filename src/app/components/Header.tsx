"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/logo.jpg";
import { motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, X, PenSquare } from "lucide-react";
import UserMenu from "../components/common/UserMenu";

const navLinks = [
  { href: "/allposts", label: "Explore" },
  { href: "/post", label: "Write" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-ink-100/70 bg-white/80 backdrop-blur-xl"
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Global"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-soft ring-1 ring-ink-100">
            <Image src={logo} alt="Chatter" fill sizes="36px" className="object-cover" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            Chatter
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/post"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <PenSquare className="h-4 w-4" />
            New post
          </Link>
          <UserMenu />
        </div>

        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-ink-700 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </nav>

      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10 bg-ink-950/30" />
        <DialogPanel
          transition
          className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 duration-300 ease-out data-[closed]:translate-x-full sm:max-w-sm sm:ring-1 sm:ring-ink-900/10"
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg ring-1 ring-ink-100">
                <Image src={logo} alt="Chatter" fill sizes="32px" className="object-cover" />
              </span>
              <span className="font-display text-base font-bold text-ink-900">Chatter</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-ink-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-ink-100">
              <div className="space-y-1 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-xl px-3 py-2.5 text-base font-semibold text-ink-900 hover:bg-brand-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <UserMenu />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </motion.header>
  );
}
