import React from "react";
import Link from "next/link";

const links = [
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Help" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white/70 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-ink-500">
          © {new Date().getFullYear()} Chatter. Made for people who love to write.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
