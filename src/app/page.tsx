"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, MessageCircle } from "lucide-react";
import landPic from "../../public/landing.jpg";
import { useSession } from "next-auth/react";

const features = [
  {
    icon: Sparkles,
    title: "Write beautifully",
    body: "A distraction-free markdown editor with live preview, image and video embeds.",
  },
  {
    icon: Users,
    title: "Grow an audience",
    body: "Tags, follows, and a personalized feed help the right readers find your work.",
  },
  {
    icon: MessageCircle,
    title: "Real conversations",
    body: "Likes, bookmarks, and comments turn reading into a two-way conversation.",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-brand-mesh" data-testid="result">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-16 sm:pt-24 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft ring-1 ring-brand-100">
              <Sparkles className="h-3.5 w-3.5" />
              Now with a fresh new look
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-6xl">
              Read, write, and widen your understanding.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">
              Chatter is a colorful home for the stories you write and the
              people you follow — publish in minutes, discover something new
              every day.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={session ? "/post" : "/register"}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {session ? "Start writing" : "Get started"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/allposts"
                className="rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                Explore stories
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative mx-auto max-w-md animate-float"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-300/40 via-amber-200/40 to-indigo-300/40 blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] shadow-soft ring-1 ring-ink-100">
              <Image
                src={landPic}
                alt="People reading and writing together"
                width={560}
                height={560}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.12 }}
          className="mt-28 grid w-full gap-6 sm:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="rounded-2xl border border-ink-100 bg-white/80 p-6 shadow-soft backdrop-blur"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-amber-400 text-white">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-600">{feature.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
