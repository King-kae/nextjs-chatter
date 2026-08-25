"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const TabSwitcher = ({ tabs }: any) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <ul className="flex gap-1 border-b border-ink-100">
        {tabs.map((tab: any, index: number) => (
          <li
            key={index}
            className={`relative cursor-pointer list-none px-4 py-3 text-sm font-semibold transition-colors ${
              index === activeTab ? "text-brand-600" : "text-ink-500 hover:text-ink-800"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
            {index === activeTab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-500"
              />
            )}
          </li>
        ))}
      </ul>
      <div className="py-6">{tabs[activeTab].content}</div>
    </div>
  );
};

export default TabSwitcher;
