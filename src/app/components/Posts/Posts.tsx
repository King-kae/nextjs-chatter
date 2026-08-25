"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import PostList from "../PostList/PostList";
import Loader from "../Loader";

const getAllPosts = async () => {
  const response = await apiClient.get("/api/post");
  return response.data.data || [];
};

export default function ShowAllPosts() {
  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-rose-50 px-4 py-3 text-center text-rose-600">
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  const filteredPosts = data?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-20 text-center text-ink-500">
        No posts available yet. Be the first to write one!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm shadow-soft outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>
      {!filteredPosts?.length ? (
        <p className="text-center text-ink-500">No posts match your search.</p>
      ) : (
        <PostList items={filteredPosts} />
      )}
    </div>
  );
}
