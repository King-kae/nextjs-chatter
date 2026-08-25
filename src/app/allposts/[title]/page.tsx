// app/posts/[title]/page.tsx
"use client";

import { deletePostByTitle } from "@/lib/fetchPost";
import React, { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import CommentForm from "@/app/components/CommentForm";
import Avatar from "@/app/components/Avatar";
import LikeButton from "@/app/components/LikeButton";
import BookmarkButton from "@/app/components/BookmarkButton";
import { marked } from "marked";
import { AuthorInfo } from "@/app/components/AuthorInfo/AuthorInfo";
import Image from "next/image";
import { PostTags } from "@/app/components/PostTags/PostTags";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/app/hook/useToast";
import Header from "@/app/components/Header";
import ShareButton from "@/app/components/ShareButton";
import { apiClient } from "@/lib/api";
import { motion } from "framer-motion";
import Loader from "@/app/components/Loader";

interface Comment {
  user: {
    _id: string | undefined;
    avatar: string | undefined;
    username: string;
  };
  content: ReactNode;
  _id: string;
}

const fetchComments = async (title: string): Promise<Comment[]> => {
  const response = await fetch(`/api/post/${title}/comments`);
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
};

const fetchPost = async (title: string) => {
  const response = await apiClient.get(`/api/post/${title}`);
  console.log(response.data)
  return response.data
}
const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date(date);

  return today.toLocaleDateString("en-US", options);
};

export default function PostPage() {
  const params = useParams<{ title: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: deletePostByTitle,
    onSuccess: async () => {
      console.log("Post deleted successfully, navigating to /allposts");
      toast.success("Post deleted successfully");
      // Refetch posts after a successful deletion
      router.push("/allposts");
    },
  });
  const title = decodeURIComponent(params.title as string);
  const { data: session } = useSession();

  const userId = session?.user as { _id?: string }
  const userEmail = session?.user?.email

  
  // Fetch post data
  const {
    data: post,
    error: postError,
    isLoading: postLoading,
  } = useQuery({
    queryKey: ["post", title],
    queryFn: async () => {
      const response = await apiClient.get(`/api/post/${title}`);
      console.log(response.data)
      return response.data
    },
  });
  
  console.log(post?.author?.email);
  
  // Fetch comments data
  const {
    data: comments,
    error: commentsError,
    isLoading: commentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["comments", title],
    queryFn: () => fetchComments(title),
  });

  // Handle comment submission
  const handleCommentSubmit = async (content: string) => {
    try {
      const res = await fetch(`/api/post/${title}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      
      if (!res.ok) {
        throw new Error("Error posting comment");
      }
      
      await res.json();
      refetch(); // Optionally, refetch comments if needed
    } catch (err: any) {
      console.error("Error posting comment:", err.message);
    }
  };

  const formattedDate = formatDate(post?.date);

  if (postLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (postError || commentsError) {
    return (
      <div className="flex h-screen items-center justify-center text-rose-600">
        Error: {(postError || commentsError)?.message}
      </div>
    );
  }

  const htmlContent = marked.parse(post?.content);

  return (
    <>
      <Header />
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6"
      >
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <Image
            src={post.imageURL}
            alt={post.title}
            className="h-64 w-full object-cover sm:h-96"
            width={800}
            height={400}
          />
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
          <Avatar seed={post.author._id} size="small" />
          <AuthorInfo status="preview" author={post.author} date={formattedDate} />
          <span className="ml-auto text-xs text-ink-400">
            {post.views.length || 0} view{post.views.length === 1 ? "" : "s"}
          </span>
          <div className="relative">
            {userEmail === post.author.email && (
              <>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-ink-100"
                >
                  {isOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-ink-100 bg-white py-1 shadow-soft">
                    <Link
                      href={`/allposts/${title}/edit`}
                      className="block w-full px-4 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => mutation.mutate(title)}
                      className="block w-full px-4 py-2 text-left text-sm font-medium text-ink-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <h1 className="mt-8 text-balance text-center font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex justify-center">
          <PostTags tags={post.tags} />
        </div>

        <div
          className="markdown-preview prose mx-auto mt-8 max-w-none text-ink-800"
          dangerouslySetInnerHTML={{ __html: htmlContent as string }}
        />

        <div className="mt-8 flex items-center justify-center gap-6 border-y border-ink-100 py-4">
          <LikeButton initialTitle={post.title} />
          <BookmarkButton initialTitle={post.title} />
          <ShareButton titleURL={post.titleURL} title={post.title} />
        </div>

        {session && (
          <div className="mt-8">
            <CommentForm postTitle={post.title} onCommentPosted={handleCommentSubmit} />
          </div>
        )}

        <h2 className="mt-10 mb-4 font-display text-xl font-bold text-ink-950">Comments</h2>
        <div className="space-y-5">
          {comments?.length === 0 ? (
            <p className="text-ink-500">No comments yet — be the first to say something.</p>
          ) : (
            comments?.map((comment) => (
              <div key={comment._id} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar seed={comment.user._id} size="small" />
                  <h4 className="font-semibold text-ink-900">{comment.user.username}</h4>
                </div>
                <p className="text-ink-700">{comment.content}</p>
              </div>
            )) ?? null
          )}
        </div>
      </motion.article>
    </>
  );
}
