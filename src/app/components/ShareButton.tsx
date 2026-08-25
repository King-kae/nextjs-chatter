"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

const ShareButton = ({ titleURL, title }: { titleURL: string; title: string }) => {
  const handleShare = () => {
    const titleLink = `${window.location.origin}/allposts/${title}` || `${titleURL}`;
    if (navigator.share) {
      navigator.share({ title: "Chatter", text: title, url: titleLink }).catch(() => {});
    } else {
      navigator.clipboard.writeText(titleLink);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100"
    >
      <Share2 className="h-5 w-5" />
    </button>
  );
};

export default ShareButton;
