"use client";

import React from "react";
import ShowAllPosts from "../components/Posts/Posts";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function AllPostsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-ink-50/60">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 font-display text-3xl font-bold tracking-tight text-ink-950"
          >
            Every story, in one place
          </motion.h1>
          <ShowAllPosts />
        </div>
      </div>
    </>
  );
}
