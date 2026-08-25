"use client";

import React from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Hash } from "lucide-react";
import PostList from "@/app/components/PostList/PostList";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";

const getPostsByTagName = async (name: string) => {
  const response = await apiClient.get(`/api/tag/${name}`);
  return response.data || [];
};

export default function TagPage() {
  const params = useParams<{ name: string }>();
  const name = decodeURIComponent(params.name as string);

  const { isLoading, isError, data, error } = useQuery<{ posts: any[] }>({
    queryKey: ["posts", "tag", name],
    queryFn: () => getPostsByTagName(name),
  });

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10 flex items-center gap-3"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/20">
            <Hash className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500">Browsing tag</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {name}
            </h1>
          </div>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader />
          </div>
        )}

        {isError && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-center text-rose-600">
            {(error as Error)?.message || "Something went wrong."}
          </p>
        )}

        {data && (!data.posts || data.posts.length === 0) && (
          <p className="rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center text-slate-500">
            No posts have been tagged <strong>#{name}</strong> yet.
          </p>
        )}

        {data?.posts && data.posts.length > 0 && <PostList items={data.posts} />}
      </main>
    </>
  );
}
