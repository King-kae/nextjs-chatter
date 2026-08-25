"use client";

import React, { useState } from "react";
import { AuthorInfo } from "../AuthorInfo/AuthorInfo";
import { PostImage } from "./PostImage";
import Avatar from "../Avatar";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";
import { PostTags } from "../PostTags/PostTags";
import CommentButton from "../CommentButton";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { deletePostByTitle } from "@/lib/fetchPost";
import { useToast } from "@/app/hook/useToast";
import ShareButton from "../ShareButton";
import { useSession } from "next-auth/react";

const formatDate = (date: string | number | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const today = new Date(date);

  return today.toLocaleDateString("en-US", options);
};

const PostCard = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data: session } = useSession();
  const mutation = useMutation({
    mutationFn: deletePostByTitle,
    onSuccess: async () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const userEmail = session?.user?.email;

  const { title, views, image, tags, author, date, titleURL, comments } =
    props;
  const formattedDate = formatDate(date);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-shadow hover:shadow-glow"
    >
      <PostImage link={titleURL} src={image} alt={title} className="post__image" />

      <div className="flex items-center gap-3 px-6 pt-6">
        <Avatar seed={author.id} size="small" />
        <AuthorInfo status="preview" author={author} date={formattedDate} />
        <span className="ml-auto text-xs text-ink-400">
          {views?.length || 0} view{views?.length === 1 ? "" : "s"}
        </span>

        {userEmail === author.email && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-ink-100"
            >
              <MoreHorizontal className="h-4 w-4" />
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
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-4">
        <Link href={`/allposts/${title}`} className="title-link">
          <h2 className="font-display text-xl font-bold text-ink-950 transition-colors group-hover:text-brand-600">
            {title}
          </h2>
        </Link>
        <div className="mt-3">
          <PostTags tags={tags} />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
          <div className="flex items-center gap-1.5">
            <CommentButton comments={comments} initialTitle={title} />
            <LikeButton initialTitle={title} />
            <BookmarkButton initialTitle={title} />
          </div>
          <ShareButton titleURL={titleURL} title={title} />
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
