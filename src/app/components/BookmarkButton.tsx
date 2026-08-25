"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useBookmark } from "@/app/hook/useBookmark";
import { useSession } from "next-auth/react";
import { useLoginModal } from "../hook/useModal";

const BookmarkButton = ({ initialTitle }: { initialTitle: string }) => {
  const { bookmarked, bookmarkCount, loading, toggleBookmark } = useBookmark(initialTitle);
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  const handleBookmarkClick = () => {
    if (!session) {
      loginModal.onOpen();
    } else {
      toggleBookmark();
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
    >
      <motion.span whileTap={{ scale: 1.3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
        <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
      </motion.span>
      <span>{bookmarkCount}</span>
    </button>
  );
};

export default BookmarkButton;
