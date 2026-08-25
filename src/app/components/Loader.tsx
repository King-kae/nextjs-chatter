import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.span
        className="block h-8 w-8 rounded-full border-2 border-brand-200 border-t-brand-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
      />
    </div>
  );
}
