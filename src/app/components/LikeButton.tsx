"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLike } from "../hook/useLike";
import { useSession } from "next-auth/react";
import { useLoginModal } from "../hook/useModal";

const LikeButton = ({ initialTitle }: { initialTitle: string }) => {
  const { liked, likeCount, loading, toggleLike } = useLike(initialTitle);
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  const handleLikeClick = () => {
    if (!session) {
      loginModal.onOpen();
    } else {
      toggleLike();
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
    >
      <motion.span whileTap={{ scale: 1.3 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
        <Heart className={`h-5 w-5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
      </motion.span>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
