"use client";

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-mesh px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
          <Compass className="h-8 w-8" />
        </span>
        <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-600">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-ink-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03] active:scale-[0.98]"
          >
            Go back home
          </Link>
          <Link href="/allposts" className="text-sm font-semibold text-ink-700 hover:text-brand-600">
            Explore stories <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
