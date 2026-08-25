import React from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CommentButton({ initialTitle, comments }: { initialTitle: string; comments: any }) {
  return (
    <Link
      href={`/allposts/${initialTitle}`}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
    >
      <MessageCircle className="h-5 w-5" />
      <span>{comments?.length || 0}</span>
    </Link>
  );
}
